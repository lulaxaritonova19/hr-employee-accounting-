Понял! Вот **полный README.md** одним кодом:

````markdown
# hr-employee-accounting-

Система кадрового учета сотрудников для HR-специалиста.

## 🛠 Технологии

- Node.js + Express
- PostgreSQL
- HTML, CSS, JavaScript
- IMask (маски ввода)

## ✨ Функционал

- Просмотр всех сотрудников
- Добавление нового сотрудника
- Редактирование данных
- Увольнение (мягкое удаление)
- Фильтрация по отделу и должности
- Поиск по ФИО
- Маски ввода для паспорта (0000 000000) и телефона (+7 (000) 000-0000)
- Блокировка редактирования для уволенных

## 🚀 Установка и запуск

1. **Клонировать репозиторий**
   ```bash
   git clone https://github.com/lulaxaritonova19/hr-employee-accounting-.git
   cd hr-employee-accounting-
   ```
````

2. **Установить зависимости**
   ```bash
   npm install
   ```
3. База данных
   Выполните SQL из файла database.sql в pgAdmin:
   Создастся БД hr_database
   Создастся таблица employees
   Добавятся тестовые данные

4. **Настройка подключения к БД**
   DB*HOST=localhost
   DB_USER=postgres
   DB_PASSWORD=ваш*пароль
   DB_DATABASE=hr_database
   DB_PORT=5432

5. **Запустить сервер**

   ```bash
   node server/server.js
   ```

6. **Открыть в браузере**
   ```
   http://localhost:3000
   ```

## 📁 Структура проекта

```
├── public/
│   ├── index.html
│   ├── add.html
│   ├── edit.html
│   └── assets/
│       ├── css/style.css
│       └── js/script.js
├── server/
│   ├── server.js
│   ├── database.js
│   └── routes/employees.js
├── .env
├── database.sql
└── package.json
```

## 🔒 Безопасность

- Пароль хранится в `.env` (файл добавлен в `.gitignore`)
