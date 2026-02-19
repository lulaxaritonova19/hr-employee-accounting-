const express = require('express')
const router = express.Router()
const pool = require('../database')

// ✅ Получить всех сотрудников
router.get('/', async (req, res) => {
	try {
		const result = await pool.query('SELECT * FROM employees ORDER BY id')
		res.json(result.rows)
	} catch (err) {
		console.error('Ошибка:', err)
		res.status(500).json({ error: err.message })
	}
})

// ✅ ДОБАВИТЬ СОТРУДНИКА (НОВЫЙ КОД!)
router.post('/', async (req, res) => {
	try {
		console.log('📥 Получены данные:', req.body)

		const {
			full_name,
			birth_date,
			passport,
			contact_info,
			address,
			department,
			position,
			salary,
			hire_date,
		} = req.body

		if (
			!full_name ||
			!birth_date ||
			!passport ||
			!contact_info ||
			!address ||
			!department ||
			!position ||
			!salary ||
			!hire_date
		) {
			return res.status(400).json({ error: 'Все поля обязательны' })
		}

		const result = await pool.query(
			`INSERT INTO employees 
             (full_name, birth_date, passport, contact_info, address, department, position, salary, hire_date) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
             RETURNING *`,
			[
				full_name,
				birth_date,
				passport,
				contact_info,
				address,
				department,
				position,
				salary,
				hire_date,
			],
		)

		console.log('✅ Сотрудник добавлен:', result.rows[0])
		res.status(201).json(result.rows[0])
	} catch (err) {
		console.error('❌ Ошибка:', err)
		res.status(500).json({ error: err.message })
	}
})

// ✅ Получить сотрудника по ID
router.get('/:id', async (req, res) => {
	try {
		const result = await pool.query('SELECT * FROM employees WHERE id = $1', [
			req.params.id,
		])
		if (result.rows.length === 0) {
			return res.status(404).json({ error: 'Сотрудник не найден' })
		}
		res.json(result.rows[0])
	} catch (err) {
		res.status(500).json({ error: err.message })
	}
})

// ✅ Обновить сотрудника
router.put('/:id', async (req, res) => {
	try {
		const {
			full_name,
			birth_date,
			passport,
			contact_info,
			address,
			department,
			position,
			salary,
			hire_date,
		} = req.body

		const checkFired = await pool.query(
			'SELECT is_fired FROM employees WHERE id = $1',
			[req.params.id],
		)

		if (checkFired.rows.length === 0) {
			return res.status(404).json({ error: 'Сотрудник не найден' })
		}

		if (checkFired.rows[0].is_fired) {
			return res
				.status(403)
				.json({ error: 'Нельзя редактировать уволенного сотрудника' })
		}

		const result = await pool.query(
			`UPDATE employees 
             SET full_name = $1, birth_date = $2, passport = $3, contact_info = $4, 
                 address = $5, department = $6, position = $7, salary = $8, hire_date = $9 
             WHERE id = $10 AND is_fired = false 
             RETURNING *`,
			[
				full_name,
				birth_date,
				passport,
				contact_info,
				address,
				department,
				position,
				salary,
				hire_date,
				req.params.id,
			],
		)

		if (result.rows.length === 0) {
			return res.status(404).json({ error: 'Сотрудник не найден или уволен' })
		}

		res.json(result.rows[0])
	} catch (err) {
		console.error('Ошибка обновления:', err)
		res.status(500).json({ error: err.message })
	}
})

// ✅ Уволить сотрудника
router.put('/:id/fire', async (req, res) => {
	try {
		console.log(`🔄 Увольнение сотрудника с id: ${req.params.id}`)

		const result = await pool.query(
			'UPDATE employees SET is_fired = true, fired_date = CURRENT_DATE WHERE id = $1 RETURNING *',
			[req.params.id],
		)

		if (result.rows.length === 0) {
			console.log('❌ Сотрудник не найден')
			return res.status(404).json({ error: 'Сотрудник не найден' })
		}

		console.log('✅ Сотрудник уволен:', result.rows[0])
		res.json({
			message: 'Сотрудник уволен',
			employee: result.rows[0],
		})
	} catch (err) {
		console.error('❌ Ошибка увольнения:', err)
		res.status(500).json({ error: err.message })
	}
})

module.exports = router
