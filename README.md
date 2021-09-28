# Cypher
Secure Node.js scripts with in memory decryption and two factor authentication

**I am not responsible for your usage. Use at your own risk**

## Features
* Randomly generated 32 character password
* Uses AES-256-CBC encryption
* Uses Scrypt to derive encryption key (Protects against bruteforce attacks)
* OTP support for two factor authentication (OTP Secret is encrypted)
* Calls garbage collector to clear memory after decryption (Protects against memory dump attacks)
* Works with Vercel's pkg to compile into executable (Use `--options expose_gc` when building)

## Use cases
* Securely distribute Node.js scripts
* Protect scripts from unauthorized execution
* Protect script source code

## How it works
1. All imports are local imports are localized
2. OTP secret is generated
3. OTP code is wrapped around code (OTP code & secret is encrypted)
4. Random password is generated
5. Key is derived from password using Scrypt
6. Code is encrypted using AES-256-CBC
7. Final code is written to output

**Check out the example in the [example folder](./example)**

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