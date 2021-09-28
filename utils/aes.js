'use strict'

const crypto = require('crypto')

module.exports = (text) => {
  // Generate password
  const password = crypto.randomBytes(32).toString('hex')

  // Derive key with scrypt
  const salt = crypto.randomBytes(32).toString('hex')
  const key = crypto.scryptSync(password, salt, 32).toString('hex').slice(0, 32)

  // Generate IV
  const iv = crypto.randomBytes(16).toString('hex').slice(0, 16)

  // Encrypt using AES-256-CBC
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv)
  const encrypted = Buffer.concat([
    cipher.update(text),
    cipher.final(),
  ]).toString('hex')

  return { encrypted, password, key, salt, iv }
}
