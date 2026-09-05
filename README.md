CRM Programming School

1. Клонуй репозиторій
Склонуй проєкт на свій комп'ютер та перейди в папку з проєктом:
bash
git clone

2. Перевір наявність необхідного ПЗ
Переконайся, що в тебе встановлено:

Node.js (LTS версія 22 або вище)
Docker Desktop

3.Встанови залежності

Для бекенду:

cd backend
npm install

Для фронтенду:

cd ../frontend
npm install
cd ..

4. Налаштуй конфігурацію
Створи конфігураційні файли .env на основі файлів-прикладів:

cp backend/.env.example backend/.env

cp frontend/.env.example frontend/.env

5. Запуск через Docker

docker compose up --build

Доступ до додатку:

Фронтенд: http://localhost 

API: http://localhost

Swagger Docs: http://localhost/docs

6.Робота з Postman

Файл колекції для тестування API знаходиться тут:
backend/postman/crm.postman_collection.json

Як імпортувати колекцію в Postman:

Відкрий програму Postman.

Натисни кнопку Import (у верхньому лівому куті).

Обери файл crm.postman_collection.json