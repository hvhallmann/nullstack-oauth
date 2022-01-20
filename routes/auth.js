const path = require('path') // has path and __dirname
const express = require('express')

const router = express.Router() // Instantiate a new router

const filePath = path.join(__dirname, '../public/oauthAuthenticate.html')

router.get('/', (req,res) => {  // send back a simple form for the oauth
  res.sendFile(filePath)
})

<<<<<<< HEAD

=======
>>>>>>> ad57079cd81e54e8fefb31990dac21e192ea7abf
module.exports = router
