# SchoolManagementSystem-ERP-

This is a student dashboard (ERP) system created for managing school data such as notes, circulars, student profiles, attendance, and more. Though it was built just for fun and learning, it functions like a real dashboard system and can be used as a base for school management platforms.  
The backend is built with **Node.js**, and the data is stored and managed using **MySQL**.

---

## ✨ Features

- Student profile dashboard  
- Admin login to view/edit student info  
- View circulars, notes, attendance  
- User authentication (login system)  
- Easy database setup using a SQL script  

---

## ⚙️ Prerequisites

Before you start, make sure you have the following installed:

- [Node.js](https://nodejs.org/en/) (for running the backend server)  
- [MySQL](https://www.mysql.com/) (for the database)  

---

## 📥 Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/Dracula699/SchoolManagementSystem-ERP-
cd SchoolManagementSystem-ERP-

### 2. Install Dependencies

⚠️ The `node_modules` folder is not included in this repository to reduce clutter.

To install all required dependencies, run:

```bash
npm install

### 🛠️ Database Setup

1. Create a MySQL database.
2. Run the SQL commands in `database.sql` to generate tables and insert default data.
3. You can use **MySQL Workbench**, **phpMyAdmin**, or **CLI** for this.

📌 The database includes:

- Default admin and student usernames/passwords for easy login  
- Tables to store student details, attendance, circulars, etc.

### 🚀 Run the Project

To start the backend server, run:

```bash
node backend.js

Then open your browser and go to:
---> http://localhost:3000

### 🔐 Default Login Credentials

These are included in the `database.sql` file:

**Admin**
- **Username:** `admin`
- **Password:** `adminpass`

**Student**
- **Username:** `student1`
- **Password:** `studentpass`

📝 Feel free to modify or add your own users via the database.

## 📂 Project Structure 

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



