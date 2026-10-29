CRM Programming School

1. Клонуй репозиторій
Склонуй проєкт на свій комп'ютер та перейди в папку з проєктом:

    bash
    git clone <url_репозиторію>

2. Перевір наявність необхідного ПЗ
Переконайся, що в тебе встановлено:

Node.js (LTS версія 22 або вище)

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

5. У файлі backend/.env вкажіть параметри підключення до вашої бази даних MySQL

DB_HOST=ваш_хост_хмарної_бд
DB_PORT=порт_бд
DB_USERNAME=користувач_бд
DB_PASSWORD=пароль_бд
DB_DATABASE=назва_бд
DB_SSL=true


6. Міграції бази даних та створення Суперадміна

cd backend

    1. Застосування міграцій на чистій БД
npm run migration:run

    2. Створення суперадміна за замовчуванням
npm run seed

Дані для входу суперадміна:
Email: admin@gmail.com
Password: admin

7. Завантаження тестових заявок (Дамп БД)
Для тестування додатку ви можете завантажити тестові заявки з файлу orders.sql

Файл з заявками знаходиться тут:
backend/dump/orders.sql

Відкрийте панель Database.
Натисніть правою кнопкою миші на вашу базу даних (наприклад, crm_school_db).
У контекстному меню оберіть Run SQL Script...
У вікні, що з'явиться, виберіть файл orders.sql та натисніть Run.

8. Запуск

Запускайте  у двох окремих вікнах термінала з кореневої папки проєкту:

cd backend
npm run start:dev

cd frontend
npm run dev

Доступ до додатку:

Фронтенд: http://localhost:5173

API: http://localhost:3000

Swagger Docs: http://localhost:3000/docs

9. Робота з Postman

Файл колекції для тестування API знаходиться тут:
backend/postman/crm.postman_collection.json

Як імпортувати колекцію в Postman:

Відкрий програму Postman.

Натисни кнопку Import (у верхньому лівому куті).

Обери файл crm.postman_collection.json