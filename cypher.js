'use strict'

const arg = require('arg')
const fs = require('fs')
// const { parse } = require('acorn')
const { authenticator } = require('otplib')

const aes = require('./utils/aes')
const error = require('./utils/error')
let localized = 0

// CLI arguments
const args = arg({ '--input': String, '--output': String, '--otp': Boolean })
if (!args['--input']) error('Input is required')
else if (!args['--output']) error('Output is required')

// Read input file
let file
try {
  file = fs.readFileSync(args['--input'], 'utf-8')
} catch (error) {
  error(`Failed to read input file: ${error.message}`)
}

// Split input file
const lines = file.split(/\r?\n/)
if (lines.length === 0) error('File has no data to encrypt')

// OUtput banner
console.log(`
   _____            _               
  / ____|          | |              
 | |    _   _ _ __ | |__   ___ _ __ 
 | |   | | | | '_ \\| '_ \\ / _ \\ '__|
 | |___| |_| | |_) | | | |  __/ |   
  \\_____\\__, | .__/|_| |_|\\___|_|   
         __/ | |                    
        |___/|_|                    
`)
console.log('Decrypt Node.js code in memory')
console.log('Made by Tay (https://github.com/taythebot)\n')
console.log(`Encrypting file ${args['--input']}`)

// Parse file
// const parsed = parse(file, {
//   ecmaVersion: 'latest',
//   sourceType: 'script',
//   locations: true,
// })

// Localize imports
// for (const { type, declarations, kind } of parsed.body) {
//   // Look for variable declarations
//   if (type !== 'VariableDeclaration') continue
//
//   for (const { id, init } of declarations) {
//     // Look for "require"
//     if (init.callee?.name === 'require') {
//       const name = id.name
//       const line = id.loc.start.line
//       const file = init.arguments[0].value
//
//       // Only encrypt local imports
//       if (!file.startsWith('./')) continue
//
//       console.log(`Found local import at line ${line} to file ${file}`)
//
//       // Load file and replace declaration
//       const data = fs.readFileSync(`${file}.js`, 'utf-8')
//       lines[line - 1] = `${kind} ${name} = (${data})`
//       localized++
//     }
//   }
// }
// console.log(`Successfully localized ${localized} imports`)

let compiled = lines.join('\n')

// Add OTP verification
if (args['--otp']) {
  const secret = authenticator.generateSecret()

  compiled = `
    const readline = require('readline')
    const { authenticator } = require('otplib')
    let otpValid = false
    
    const otp = () => {
      return new Promise((resolve, reject) => {
        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout,
        })
    
        rl.input.on('keypress', () => {
          const len = rl.line.length
          readline.moveCursor(rl.output, -len, 0)
          readline.clearLine(rl.output, 1)
          for (let i = 0; i < len; i++) {
            rl.output.write('*')
          }
        })
    
        rl.question('Code: ', (code) => {
          try {
            if (code === '') throw new Error('Invalid code')
    
            const isValid = authenticator.check(code, '${secret}');
            token = code = undefined
            global.gc()
            
            resolve(isValid)
          } catch {
            reject()
          }
        })
      })
    }
    
    ;(async () => {
      try {
        const isValid = await otp()
        if (!isValid) throw new Error('invalid code')
      } catch (error) {
        console.log('Invalid code')
        process.exit(0)
      }
      
      ${compiled}
    })()
  `
  console.log(`OTP Secret code is ${secret}`)
}

// Encrypt using AES
console.log('Encrypting file using AES-256-CBC...')
const { encrypted, password, salt, iv } = aes(compiled)
console.log('Successfully encrypted file')

// Write file
const template = `'use strict'

const readline = require('readline')
const crypto = require('crypto')
const vm = require('vm')
const m = require('module')

const decrypt = () => {
  return new Promise((resolve, reject) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })

    rl.input.on('keypress', () => {
      const len = rl.line.length
      readline.moveCursor(rl.output, -len, 0)
      readline.clearLine(rl.output, 1)
      for (let i = 0; i < len; i++) {
        rl.output.write('*')
      }
    })

    rl.question('Password: ', (password) => {
      try {
        if (password === '') throw new Error('Wrong password')

        let key = crypto
          .scryptSync(password, '${salt}', 32)
          .toString('hex')
          .slice(0, 32)

        const decipher = crypto.createDecipheriv('aes-256-cbc', key, '${iv}')
        const decrypted = Buffer.concat([
          decipher.update('${encrypted}', 'hex'),
          decipher.final(),
        ])
        rl.close()
        
        password = key = undefined
        global.gc()
        
        resolve(decrypted.toString('utf-8'))
      } catch {
        reject()
      }
    })
  })
}

;(async () => {
  let decrypted
  try {
    decrypted = await decrypt()
  } catch {
    console.log('Invalid password')
    process.exit(0)
  }
  
  vm.runInThisContext(m.wrap(decrypted))(
    exports,
    require,
    module,
    __filename,
    __dirname
  )
})()
`

try {
  fs.writeFileSync(args['--output'], template, 'utf-8')
  console.log(`Wrote to file ${args['--output']}`)
} catch (error) {
  error(`Failed to write to output file: ${error.message}`)
}

console.log(`Password is ${password}`)
