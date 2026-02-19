const express = require('express')
const app = express()
const PORT = 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(express.static('public'))

const employeeRoutes = require('./routes/employees')
app.use('/api/employees', employeeRoutes)

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/public/index.html')
})

app.listen(PORT, () => {
	console.log(`🚀 Сервер запущен на http://localhost:${PORT}`)
})
