-- Создание базы данных
CREATE DATABASE hr_database;

-- Подключение к базе (для psql)
\c hr_database;

-- Создание таблицы сотрудников
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    birth_date DATE NOT NULL,
    passport VARCHAR(20) NOT NULL,
    contact_info VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    department VARCHAR(100) NOT NULL,
    position VARCHAR(100) NOT NULL,
    salary DECIMAL(10,2) NOT NULL,
    hire_date DATE NOT NULL,
    is_fired BOOLEAN DEFAULT FALSE,
    fired_date DATE
);

-- Добавление тестовых данных
INSERT INTO employees (full_name, birth_date, passport, contact_info, address, department, position, salary, hire_date) VALUES
('Иванов Иван Иванович', '1990-05-15', '1234 567890', '+7 (999) 123-45-67', 'г. Москва, ул. Ленина, д.1', 'IT', 'Разработчик', 150000, '2022-01-10'),
('Петрова Мария Сергеевна', '1985-10-20', '4321 123456', 'maria@mail.com', 'г. Казань, ул. Баумана, д.5', 'HR', 'Менеджер', 90000, '2021-08-15'),
('Сидоров Петр Николаевич', '1975-03-10', '5678 901234', '+7 (912) 888-22-33', 'г. Екатеринбург, ул. Мира, д.10', 'Бухгалтерия', 'Бухгалтер', 120000, '2019-11-20');