CREATE DATABASE IF NOT EXISTS logincred;

USE logincred;

CREATE TABLE IF NOT EXISTS admin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admin_username VARCHAR(255) NOT NULL,
    admin_password VARCHAR(255) NOT NULL,
    admin_name VARCHAR(255) NOT NULL,
    admin_class INT,
    admin_division CHAR(1),
    admin_image BLOB DEFAULT NULL;
);

INSERT INTO admin (admin_username, admin_password, admin_name, admin_class, admin_division, admin_image)
VALUES ('admin', 'adminpass', 'Default Admin', 10, 'A', 'publictwo/images/user.png');


CREATE TABLE IF NOT EXISTS attendance (
    Roll_no INT PRIMARY KEY,
    student_name VARCHAR(255) NOT NULL,
    Class INT NOT NULL,
    division CHAR(1) NOT NULL,
    Date DATE NOT NULL,
    presenty VARCHAR(10) NOT NULL,
    Teacher_name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS circulartable (
    circular_id INT AUTO_INCREMENT PRIMARY KEY,
    circular_date DATE NOT NULL,
    circular_text TEXT DEFAULT NULL,
    pdf BLOB DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS class10notes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    subject VARCHAR(100) NOT NULL,
    chapter VARCHAR(255) NOT NULL
);


CREATE TABLE IF NOT EXISTS class9notes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    subject VARCHAR(100) NOT NULL,
    chapter VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS notes_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    subject VARCHAR(100) NOT NULL,
    chapter VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    file_data BLOB DEFAULT NULL,
    class INT DEFAULT NULL,
    division CHAR(1) DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS student_info (
    Roll_no INT PRIMARY KEY,
    class INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    division CHAR(1) NOT NULL
);

CREATE TABLE IF NOT EXISTS students (
    Roll_no INT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    student_name VARCHAR(255) NOT NULL,
    class INT NOT NULL,
    division CHAR(1) NOT NULL,
    image BLOB DEFAULT NULL,
    teacher VARCHAR(255) NOT NULL
);


INSERT INTO students (Roll_no, username, password, student_name, class, division, image, teacher)
VALUES (1, 'student1', 'studentpass', 'Default Student', 10, 'A', 'publictwo/images/user.png', 'Teacher1');
