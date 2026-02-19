const express = require('express')
const app = express()
const PORT = 3000

// Подключаем middleware для парсинга JSON
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Отдаем статические файлы из папки public
app.use(express.static('public'))

// Подключаем маршруты для сотрудников
const employeeRoutes = require('./routes/employees')
app.use('/api/employees', employeeRoutes)

// Главная страница
app.get('/', (req, res) => {
	res.sendFile(__dirname + '/public/index.html')
})

app.listen(PORT, () => {
	console.log(`🚀 Сервер запущен на http://localhost:${PORT}`)
})
