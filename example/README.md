# Example using OTP
1. Encrypt file
```sh
# node ../cypher --input hello.js --output output.js --otp

Encrypting file hello.js
Successfully localized 0 imports
OTP Secret code is FMDAW5A7FZCUUYBP <-- OTP Secret code
Encrypting file using AES-256-CBC...
Successfully encrypted file
Wrote to file output.js
Password is dab5af90f241dc3df55b4eee9d7771bf37a5f8477cdace019c274786d48c582e
```
2. Run file
```sh
node --expose_gc output.js
```
3. Enter password
4. Generate OTP code from https://totp.danhersam.com/
5. Enter OTP code

# Example without OTP
1. Encrypt file
```sh
# node ../cypher --input hello.js --output output.js

Encrypting file hello.js
Successfully localized 0 imports
Encrypting file using AES-256-CBC...
Successfully encrypted file
Wrote to file output.js
Password is dab5af90f241dc3df55b4eee9d7771bf37a5f8477cdace019c274786d48c582e
```
2. Run file
```sh
node --expose_gc output.js
```
3. Enter password

# Compile with Vercel Pkg

```
pkg output.js --options expose_gc
```
* **Must have pkg installed globally**