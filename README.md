# SchoolManagementSystem-ERP-

This is a student dashboard (ERP) system created for managing school data such as notes, circulars, student profiles, attendance, and more. Though it was built just for fun and learning, it functions like a real dashboard system and can be used as a base for school management platforms.
The backend is built with Node.js, and the data is stored and managed using MySQL.

✨ Features
.Student profile dashboard

.Admin login to view/edit student info

.View circulars, notes, attendance

.User authentication (login system)

.Easy database setup using a SQL script

⚙️ Prerequisites
Before you start, make sure you have the following installed:

- [Node.js](https://nodejs.org/en/) (for running the backend server)
- [MySQL](https://www.mysql.com/) (for the database)


MySQL

📥 Installation Steps
1. Clone the Repository

In powershell(windows) and same on Linux
git clone https://github.com/Dracula699/SchoolManagementSystem-ERP- (if git is installed if not u have to first install it)
cd SchoolManagementSystem-ERP-

2. Install Dependencies
   
⚠️ The node_modules folder is not included in this repository to reduce clutter.
To install all required dependencies, just run:

npm install

This will automatically download everything listed in package.json

🛠️ Database Setup
Create a MySQL database.

Run the SQL commands in database.sql to generate tables and insert default data.
You can use MySQL Workbench, phpMyAdmin, or CLI.

📌 The database includes:

Default admin and student usernames/passwords for easy login

Tables to store student details, attendance, circulars, etc.

🚀 Run the Project

Start the backend server:

node backend.js

Then open your browser and go to:
http://localhost:3000

🔐 Default Login Credentials
These are included in the database.sql file:

Admin

Username: admin

Password: adminpass

Student

Username: student1

Password: studentpass

Feel free to modify or add your own users via the database.

📂 Project Structure 

📁 school-erp-dashboard
├── backend.js
├── dbconnection.js
├── database.sql
├── package.json
├── package-lock.json
├── public/
├── publictwo/
├── adminghomepage/
├── homepage/
├── .vscode/
├── views/
└── README.md

##Dislaimer 
You have to make your own db using the databse.sql file and have to fill data for live data visuliation on the website.


