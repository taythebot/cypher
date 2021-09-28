# Cypher
Secure Node.js scripts with in memory decryption and two factor authentication

**I am not responsible for your actions. Use at your own discretion.**

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
1. All local imports are localized (Disabled due to bugs)
2. Implement OTP if enabled (`--otp` flag)
   1. Generate OTP secret
   2. Generate OTP code and wrap original code (OTP code & secret is encrypted)
3. Generate random password
4. Derive encryption key using Scrypt
5. Encrypt code using AES-256-CBC
6. Generate final code with decryption methods
7. Write final code to output file

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