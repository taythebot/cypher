# Cypher
Secure Node.js scripts with in memory decryption and two factor authentication

**I am not responsible for your usage. Use at your own risk**

## Features
* Uses AES-256-CBC encryption
* Uses Scrypt to derive encryption key
* OTP support for two factor authentication
* Calls garbage collector to clear memory after decryption
* Works with Vercel's pkg to compile into executable (Use `--options expose_gc` when building)

## How it works
1. All imports are local imports are localized
2. OTP secret is generated (OTP code is encrypted)
3. OTP code is wrapped around code
4. Random password is generated
5. Key is derived from password using Scrypt
6. Code is encrypted using AES-256-CBC
7. Final code is written to output

## Usage
```
node cypher --input <file> --output <file> --otp
```

* OTP code can be generated in your browser using https://totp.danhersam.com/

**You must use `--expose_gc` option when executing the output script**
```
node --expose_gc <file>
```

## Localize imports
**You must localize your imports manually for the moment**

Original
```js
const lib = require('./lib/test')

lib()
```

Localized
```js
const lib = (module.exports = () => console.log('test'))

lib()
```

## Compile using Vercel Pkg
```
pkg <file> --options expose_gc
```

## Todo
* Automatic compiler
* Randomize function names
* Add second layer of encryption using OTP