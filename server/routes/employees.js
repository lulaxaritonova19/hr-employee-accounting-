const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
	res.json({ message: 'Employees route works' })
})

module.exports = router
