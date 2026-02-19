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

		row.innerHTML = `
            <td>${emp.full_name || ''}</td>
            <td>${emp.birth_date || ''}</td>
            <td>${emp.passport || ''}</td>
            <td>${emp.contact_info || ''}</td>
            <td>${emp.address || ''}</td>
            <td>${emp.department || ''}</td>
            <td>${emp.position || ''}</td>
            <td>${emp.salary || ''} ₽</td>
            <td>${emp.hire_date || ''}</td>
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
										: '🚫 Заблокировано'
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
	if (search) url += `search=${search}&`
	if (department) url += `department=${department}&`
	if (position) url += `position=${position}`

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
		await fetch(`/api/employees/${currentEmployeeId}/fire`, { method: 'PUT' })
		closeModal()
		loadEmployees()
		loadFilters()
	} catch (error) {
		console.error('Ошибка увольнения:', error)
	}
}

function editEmployee(id) {
	window.location.href = `edit.html?id=${id}`
}
