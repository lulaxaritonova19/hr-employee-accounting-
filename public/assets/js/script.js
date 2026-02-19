let currentEmployeeId = null

document.addEventListener('DOMContentLoaded', function () {
	loadEmployees()
	loadFilters()
})

async function loadEmployees() {
	try {
		const response = await fetch('/api/employees')
		const employees = await response.json()
		displayEmployees(employees)
	} catch (error) {
		console.error('Ошибка загрузки:', error)
	}
}

function displayEmployees(employees) {
	const tbody = document.getElementById('employeeTableBody')
	tbody.innerHTML = ''

	employees.forEach(emp => {
		const row = document.createElement('tr')
		if (emp.is_fired) row.classList.add('fired')

		// Форматируем даты
		const birthDate = emp.birth_date
			? new Date(emp.birth_date).toLocaleDateString('ru-RU')
			: ''
		const hireDate = emp.hire_date
			? new Date(emp.hire_date).toLocaleDateString('ru-RU')
			: ''

		row.innerHTML = `
            <td>${emp.full_name || ''}</td>
            <td>${birthDate}</td>
            <td>${emp.passport || ''}</td>
            <td>${emp.contact_info || ''}</td>
            <td>${emp.address || ''}</td>
            <td>${emp.department || ''}</td>
            <td>${emp.position || ''}</td>
            <td>${Number(emp.salary).toLocaleString('ru-RU')} ₽</td>
            <td>${hireDate}</td>
            <td>
                <span class="${emp.is_fired ? 'badge-danger' : 'badge-success'}">
                    ${emp.is_fired ? 'Уволен' : 'Работает'}
                </span>
            </td>
            <td>
                ${
									!emp.is_fired
										? `<button onclick="editEmployee(${emp.id})">✏️ Ред.</button>
                       <button onclick="showFireModal(${emp.id}, '${emp.full_name}')">🔴 Уволить</button>`
										: '<span style="color: #999; font-style: italic;">Заблокировано</span>'
								}
            </td>
        `
		tbody.appendChild(row)
	})
}

async function loadFilters() {
	try {
		const response = await fetch('/api/employees')
		const employees = await response.json()

		const departments = [
			...new Set(employees.map(e => e.department).filter(Boolean)),
		]
		const positions = [
			...new Set(employees.map(e => e.position).filter(Boolean)),
		]

		const deptSelect = document.getElementById('departmentFilter')
		const posSelect = document.getElementById('positionFilter')

		// Очищаем и добавляем опции
		deptSelect.innerHTML = '<option value="">Все отделы</option>'
		posSelect.innerHTML = '<option value="">Все должности</option>'

		departments.forEach(dept => {
			deptSelect.innerHTML += `<option value="${dept}">${dept}</option>`
		})

		positions.forEach(pos => {
			posSelect.innerHTML += `<option value="${pos}">${pos}</option>`
		})
	} catch (error) {
		console.error('Ошибка загрузки фильтров:', error)
	}
}

async function applyFilters() {
	const search = document.getElementById('searchInput').value
	const department = document.getElementById('departmentFilter').value
	const position = document.getElementById('positionFilter').value

	let url = '/api/employees?'
	const params = []

	if (search) params.push(`search=${encodeURIComponent(search)}`)
	if (department) params.push(`department=${encodeURIComponent(department)}`)
	if (position) params.push(`position=${encodeURIComponent(position)}`)

	url += params.join('&')

	try {
		const response = await fetch(url)
		const employees = await response.json()
		displayEmployees(employees)
	} catch (error) {
		console.error('Ошибка фильтрации:', error)
	}
}

function showFireModal(id, name) {
	currentEmployeeId = id
	document.getElementById('fireEmployeeName').textContent = name
	document.getElementById('fireModal').style.display = 'block'
}

function closeModal() {
	document.getElementById('fireModal').style.display = 'none'
}

async function confirmFire() {
	try {
		const response = await fetch(`/api/employees/${currentEmployeeId}/fire`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
		})

		if (response.ok) {
			closeModal()
			// Перезагружаем данные
			await loadEmployees()
			await loadFilters()
		} else {
			const error = await response.json()
			alert('Ошибка: ' + error.error)
		}
	} catch (error) {
		console.error('Ошибка увольнения:', error)
		alert('Произошла ошибка при увольнении')
	}
}

function editEmployee(id) {
	window.location.href = `edit.html?id=${id}`
}
