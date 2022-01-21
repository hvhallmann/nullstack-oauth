const express = require('express')
const router = express.Router() // Instantiate a new router
const DebugControl = require('../utilities/debug.js')

router.get('/', (req,res) => {  // Successfully reached if can hit this :)
  // DebugControl.log.variable({name: 'res.locals.oauth.token', value: res.locals.oauth.token})
  console.log('Reached here secured')
  res.json({success: true})
})

module.exports = router
