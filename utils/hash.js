const md5 = require('md5')

// Authentication for server side
// ts - a timestamp (or other long string which can change on a request-by-request basis)
// hash - a md5 digest of the ts parameter, your private key and your public key (e.g. md5(ts+privateKey+publicKey)

const md5Hash = (PRIVATE_API_KEY, PUBLIC_API_KEY) => {

    const ts = Date.now()
    const preHash = `${ts}${PRIVATE_API_KEY}${PUBLIC_API_KEY}`
    const hash = md5(preHash)

    return [ts, hash]
}

module.exports = { md5Hash }