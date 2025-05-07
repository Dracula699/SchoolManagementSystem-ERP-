const express = require('express');// impoble to acess the express function 
const pool = require('./dbconnection');// connecting to the ./dbconncection file in the repository to access it's features.
const bodyParser = require('body-parser');// using body parser for the middleware
const mysql = require('mysql');// imprrting the express module
const app = express();// making an variaoting mysql module in nodejs to connect the sql database
const port = 3000;// defining a port where the commuination should happen
const path = require('path');// impoting the path module to make our work easier
const multer = require('multer');
const publicTwoFolderPath = path.join(__dirname, 'publictwo');
const imagesFolderPath = path.join(publicTwoFolderPath, 'images');
const folderName = 'adminhomepage';
const storage = multer.memoryStorage(); // Store file in memory
const upload = multer({ storage: storage });

let globalUsername;  
let globalPassword;

app.use(express.static(path.join(__dirname, 'public')));// joining public folder so that the user can see all the html, css and images on the page on ths localhost:3000
app.use(bodyParser.urlencoded({ extended: true }));// creating the middleware
app.use(express.static(publicTwoFolderPath));
app.use('/homepage', express.static(path.join(__dirname, 'homepage')));
app.use('/images', express.static(imagesFolderPath));// Serve the images folder as static
app.use(bodyParser.json());// getting json data using middleware
// Serve static files from the specified folder
app.use('/adminhomepage', express.static(path.join(__dirname, folderName)));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));



app.get('/logined', (req, res) => {
  const loginFilePath = path.join(publicTwoFolderPath, 'logined.ejs');

  // Check if it's an admin login
  const adminQuery = 'SELECT * FROM admin WHERE admin_username = ? AND admin_password = ?';
  pool.query(adminQuery, [globalUsername, globalPassword], (adminError, adminResults) => {
    if (adminError) {
      console.error('Error executing MySQL query for admin:', adminError);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }

    if (adminResults.length > 0) {
      const userData = adminResults[0];
      userData.isAdmin = true; // Add a flag to indicate that the user is an admin
      // Convert the image binary data to a Base64-encoded string
      const base64Image = Buffer.from(userData.admin_image, 'binary').toString('base64');
      userData.imageData = base64Image; // Update the userData object with the Base64-encoded image

      // Render logined.ejs and pass userData to the view
      res.render(loginFilePath, { userData });
    } else {
      // If not admin, check for student login
      const studentQuery = 'SELECT * FROM students WHERE username = ? AND password = ?';
      pool.query(studentQuery, [globalUsername, globalPassword], (studentError, studentResults) => {
        if (studentError) {
          console.error('Error executing MySQL query for students:', studentError);
          res.status(500).json({ message: 'Internal server error' });
          return;
        }

        if (studentResults.length > 0) {
          const userData = studentResults[0];
          userData.isAdmin = false; // Add a flag to indicate that the user is not an admin
          // Convert the image binary data to a Base64-encoded string
          const base64Image = Buffer.from(userData.image, 'binary').toString('base64');
          userData.imageData = base64Image; // Update the userData object with the Base64-encoded image

          // Render logined.ejs and pass userData to the view
          res.render(loginFilePath, { userData });
        } else {
          // Handle the case when no user is found, you can redirect or render an error page
          res.status(401).json({ message: 'Invalid username or password' });
          // Alternatively, you can redirect to the login page
          // res.redirect('/login');
        }
      });
    }
  });
});





app.get('/adminhomepage', (req, res) => {
  const adminHomepageFilePath = path.join(__dirname, 'adminhomepage', 'adminhomepage.ejs'); // Update the path

  const adminQuery = 'SELECT admin_name, admin_class, admin_division, admin_image FROM admin WHERE admin_username = ? AND admin_password = ?';

  pool.getConnection((err, connection) => {
      if (err) {
          console.error('Error getting MySQL connection:', err);
          res.status(500).json({ message: 'Internal server error' });
          return;
      }

      connection.query(adminQuery, [globalUsername, globalPassword], (error, results) => {
          connection.release(); // Release the connection back to the pool

          if (error) {
              console.error('Error executing MySQL query:', error);
              res.status(500).json({ message: 'Internal server error' });
              return;
          }

          if (results.length > 0) {
              const userData = results[0];
              // Convert the image binary data to a Base64-encoded string
              const base64Image = Buffer.from(userData.admin_image, 'binary').toString('base64');
              userData.imageData = base64Image; // Update the adminData object with the Base64-encoded image

              // Render adminhomepage.ejs and pass adminData to the view
              res.render(adminHomepageFilePath, { userData });
          } else {
              // Handle the case when no admin is found, you can redirect or render an error page
              res.status(401).json({ message: 'Invalid admin credentials' });
          }
      });
  });
});







app.get('/homepage', (req, res) => {
    const homepageFilePath = path.join(__dirname, 'homepage', 'homepage.ejs'); // Update the path
    

    const query = 'SELECT student_name, class, division, image FROM students WHERE username = ? AND password = ?';

    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting MySQL connection:', err);
            res.status(500).json({ message: 'Internal server error' });
            return;
        }

        connection.query(query, [globalUsername, globalPassword], (error, results) => {
            connection.release(); // Release the connection back to the pool

            if (error) {
                console.error('Error executing MySQL query:', error);
                res.status(500).json({ message: 'Internal server error' });
                return;
            }

            if (results.length > 0) {
                const userData = results[0];
                // Convert the image binary data to a Base64-encoded string
                const base64Image = Buffer.from(userData.image, 'binary').toString('base64');
                userData.image = base64Image;

                // Render homepage.ejs and pass userData to the view
                
                res.render(homepageFilePath, { userData });
            } else {
                // Handle the case when no user is found, you can redirect or render an error page
                res.status(401).json({ message: 'Invalid username or password' })
            }
        });
    });
});





app.post('/login', (req, res) => {
  const { username, password } = req.body; // getting the data from the frontend using post method
  globalUsername = username;
  globalPassword = password;

  // Use the connection pool to query the database
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting MySQL connection:', err);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }

    // Checking whether the username and password are correct in the students table using a SQL query
    const studentQuery = 'SELECT * FROM students WHERE username = ? AND password = ?';
    connection.query(studentQuery, [username, password], (studentError, studentResults) => {
      if (studentError) {
        console.error('Error executing MySQL query for students:', studentError);
        res.status(500).json({ message: 'Internal server error' });
        connection.release(); // Release the connection back to the pool
        return;
      }

      if (studentResults.length > 0) {
        // Authentication successful for student
        res.status(200).json({ message: 'Authentication successful for student' });
      } else {
        // If not found in the students table, check in the admin table
        const adminQuery = 'SELECT * FROM admin WHERE admin_username = ? AND admin_password = ?';
        connection.query(adminQuery, [username, password], (adminError, adminResults) => {
          connection.release(); // Release the connection back to the pool

          if (adminError) {
            console.error('Error executing MySQL query for admin:', adminError);
            res.status(500).json({ message: 'Internal server error' });
            return;
          }

          if (adminResults.length > 0) {
            // Authentication successful for admin
            res.status(200).json({ message: 'Authentication successful for admin', userDetails: adminResults[0] });
          } else {
            // Authentication failed for both student and admin
            res.status(401).json({ message: 'Invalid username or password' });
          }
        });
      }
    });
  });
});



app.get('/About-Me', (req, res) => {
  const profileFilePath = path.join(__dirname, 'homepage', 'dashboard_page.ejs');

  // Query to fetch user data including class and division
  const userDataQuery = 'SELECT Roll_no, student_name, class, division, image, Teacher FROM students WHERE username = ? AND password = ?';

  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting MySQL connection:', err);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }

    connection.query(userDataQuery, [globalUsername, globalPassword], (error, results) => {
      connection.release(); // Release the connection back to the pool

      if (error) {
        console.error('Error executing MySQL query:', error);
        res.status(500).json({ message: 'Internal server error' });
        return;
      }

      if (results.length > 0) {
        const userData = results[0];

        // Convert the image binary data to a Base64-encoded string
        const base64Image = Buffer.from(userData.image, 'binary').toString('base64');
        userData.image = base64Image;

        // Fetch the user's class and division
        const userClass = userData.class;
        const userDivision = userData.division;

        // Fetch the notice with the largest ID for the user's class and division
        const noticeQuery = 'SELECT * FROM NoticeTable WHERE class = ? AND division = ? ORDER BY id DESC LIMIT 1';

        pool.query(noticeQuery, [userClass, userDivision], (err, noticeResults) => {
          if (err) {
            console.error('Error fetching notice:', err);
            res.status(500).json({ error: 'Internal Server Error' });
          } else {
            // Include the notice data in the userData
            userData.notice = noticeResults[0];

            // Fetch circular information
            const circularQuery = 'SELECT * FROM CircularTable';

            pool.query(circularQuery, (error, circularResults) => {
              if (error) {
                console.error('Error fetching circular information:', error);
                res.status(500).json({ error: 'Internal Server Error' });
              } else {
                // Render dashboard_page.ejs and pass userData and circulars to the view
                res.render(profileFilePath, { userData, circulars: circularResults });
              }
            });
          }
        });
      } else {
        // Handle the case when no user is found, you can redirect or render an error page
        res.status(401).json({ message: 'Invalid username or password' });
      }
    });
  });
});


app.get('/adminprofile', (req, res) => {
  const adminProfileFilePath = path.join(__dirname, 'adminhomepage', 'adminprofile_page.ejs');

  const adminQuery = 'SELECT admin_name, admin_class, admin_division, admin_image FROM admin WHERE admin_username = ? AND admin_password = ?';

  pool.getConnection((err, connection) => {
      if (err) {
          console.error('Error getting MySQL connection:', err);
          res.status(500).json({ message: 'Internal server error' });
          return;
      }

      connection.query(adminQuery, [globalUsername, globalPassword], (error, results) => {
          connection.release(); // Release the connection back to the pool

          if (error) {
              console.error('Error executing MySQL query:', error);
              res.status(500).json({ message: 'Internal server error' });
              return;
          }

          if (results.length > 0) {
              const userData = results[0];
              // Convert the image binary data to a Base64-encoded string
              const base64Image = Buffer.from(userData.admin_image, 'binary').toString('base64');
              userData.imageData = base64Image;

              // Render adminprofile_page.ejs and pass adminData to the view
              res.render(adminProfileFilePath, { userData });
          } else {
              // Handle the case when no admin is found, you can redirect or render an error page
              res.status(401).json({ message: 'Invalid admin credentials' });
          }
      });
  });
});

// Optionally, you can remove the separate /student-circular route if it's no longer needed.


// /profile route to fetch userData from the database and render profile_page.ejs
app.get('/Profile', (req, res) => {
  const profileFilePath = path.join(__dirname, 'homepage', 'profile_page.ejs');

  const query = 'SELECT Roll_no,student_name, class, division, image, Teacher FROM students WHERE username = ? AND password = ?';

  pool.getConnection((err, connection) => {
      if (err) {
          console.error('Error getting MySQL connection:', err);
          res.status(500).json({ message: 'Internal server error' });
          return;
      }

      connection.query(query, [globalUsername, globalPassword], (error, results) => {
          connection.release(); // Release the connection back to the pool

          if (error) {
              console.error('Error executing MySQL query:', error);
              res.status(500).json({ message: 'Internal server error' });
              return;
          }

          if (results.length > 0) {
              const userData = results[0];
              // Convert the image binary data to a Base64-encoded string
              const base64Image = Buffer.from(userData.image, 'binary').toString('base64');
              userData.image = base64Image;

              // Render profile_page.ejs and pass userData to the view
              res.render(profileFilePath, { userData });
          } else {
              // Handle the case when no user is found, you can redirect or render an error page
              res.status(401).json({ message: 'Invalid username or password' });
          }
      });
  });
});



app.get('/Notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'homepage', 'notes_page.html'));
});

app.get('/Tracking', (req, res) => {
    res.sendFile(path.join(__dirname, 'homepage', 'tracking_page.html'));
});


app.get('/student-notice', (req, res) => {
  const userQuery = 'SELECT class, division FROM students WHERE username = ? AND password = ?';

  pool.getConnection((err, connection) => {
      if (err) {
          console.error('Error getting MySQL connection:', err);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
      }

      connection.query(userQuery, [globalUsername, globalPassword], (error, userResults) => {
          connection.release(); // Release the connection back to the pool

          if (error) {
              console.error('Error executing MySQL query:', error);
              res.status(500).json({ error: 'Internal Server Error' });
              return;
          }

          if (userResults.length > 0) {
              const { class: userClass, division: userDivision } = userResults[0];

              // Fetch notices based on the user's class and division
              const noticeQuery = 'SELECT * FROM NoticeTable WHERE class = ? AND division = ?';

              pool.query(noticeQuery, [userClass, userDivision], (err, noticeResults) => {
                  if (err) {
                      console.error('Error fetching notices:', err);
                      res.status(500).json({ error: 'Internal Server Error' });
                  } else {
                      // Render the show_notices.html page with the filtered notices
                      res.render('show_notices', { notices: noticeResults });
                  }
              });
          } else {
              // Handle the case when no user is found, you can redirect or render an error page
              res.status(401).json({ message: 'Invalid username or password' });
          }
      });
  });
});



app.get('/download-pdf/:id', (req, res) => {
  const pdfId = req.params.id;

  // Fetch PDF data from the database based on the ID
  const query = 'SELECT pdf FROM NoticeTable WHERE id = ?';

  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting MySQL connection:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    connection.query(query, [pdfId], (error, results) => {
      connection.release(); // Release the connection back to the pool

      if (error) {
        console.error('Error fetching PDF data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }

      if (results.length > 0) {
        const pdfData = results[0].pdf;

        // Set appropriate headers for PDF
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=downloaded.pdf');

        // Send the PDF data as the response
        res.send(pdfData);
      } else {
        // If the PDF with the given ID is not found, return a 404 response
        res.status(404).send('PDF not found');
      }
    });
  });
});


app.get('/view-pdf/:id', (req, res) => {
  const pdfId = req.params.id;

  // Fetch PDF data from the database based on the ID
  const query = 'SELECT pdf FROM NoticeTable WHERE id = ?';

  pool.getConnection((err, connection) => {
      if (err) {
          console.error('Error getting MySQL connection:', err);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
      }

      connection.query(query, [pdfId], (error, results) => {
          connection.release(); // Release the connection back to the pool

          if (error) {
              console.error('Error fetching PDF data:', error);
              res.status(500).json({ error: 'Internal Server Error' });
              return;
          }

          if (results.length > 0) {
              const pdfData = results[0].pdf;

              if (pdfData !== null) {
                  // Set appropriate headers for PDF
                  res.setHeader('Content-Type', 'application/pdf');
                  res.setHeader('Content-Disposition', 'inline; filename=viewed.pdf');

                  // Send the PDF data as the response
                  res.send(pdfData);
              } else {
                  // If the PDF field is NULL, return a response indicating no file
                  res.status(404).send('No PDF file available');
              }
          } else {
              // If the PDF with the given ID is not found, return a 404 response
              res.status(404).send('PDF not found');
          }
      });
  });
});

app.get('/student-circular', (req, res) => {
  const circularQuery = 'SELECT * FROM CircularTable';

  pool.query(circularQuery, (error, circularResults) => {
    if (error) {
      console.error('Error fetching circular information:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      // Render the studentcircular_page.html page with the circular data
      res.render('show_circular', { circulars: circularResults });
    }
  });
});

// Route to download a PDF based on circular ID
app.get('/download-circular-pdf/:id', (req, res) => {
  const circularId = req.params.id;

  // Fetch PDF data from the database based on the circular ID
  const query = 'SELECT pdf FROM CircularTable WHERE circular_id = ?';

  pool.query(query, [circularId], (error, results) => {
    if (error) {
      console.error('Error fetching PDF data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      if (results.length > 0) {
        const pdfData = results[0].pdf;

        // Set appropriate headers for PDF
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=downloaded.pdf');

        // Send the PDF data as the response
        res.send(pdfData);
      } else {
        // If the PDF with the given ID is not found, return a 404 response
        res.status(404).send('PDF not found');
      }
    }
  });
});

app.get('/view-circular-pdf/:id', (req, res) => {
  const circularId = req.params.id;

  // Fetch the circular data from the database based on the ID
  const query = 'SELECT pdf FROM CircularTable WHERE circular_id = ?';

  pool.getConnection((err, connection) => {
      if (err) {
          console.error('Error getting MySQL connection:', err);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
      }

      connection.query(query, [circularId], (error, results) => {
          connection.release(); // Release the connection back to the pool

          if (error) {
              console.error('Error fetching PDF data:', error);
              res.status(500).json({ error: 'Internal Server Error' });
              return;
          }

          if (results.length > 0) {
              const pdfData = results[0].pdf;

              if (pdfData !== null) {
                  // Set appropriate headers for PDF
                  res.setHeader('Content-Type', 'application/pdf');
                  res.setHeader('Content-Disposition', 'inline; filename=viewed.pdf');

                  // Send the PDF data as the response
                  res.send(pdfData);
              } else {
                  // If the PDF field is NULL, return a response indicating no file
                  res.status(404).send('No PDF file available');
              }
          } else {
              // If the circular with the given ID is not found, return a 404 response
              res.status(404).send('Circular not found');
          }
      });
  });
});


app.post('/process_attendance', (req, res) => {
  const Division = req.body.Division;
  const Class = req.body.Class;

  console.log('Received request with Class:', Class, 'and Division:', Division);

  // Query the database to get student data based on Class and Division
  const query = `SELECT Roll_no, name, class, division FROM student_info WHERE class = ? AND division = ?`;

  pool.query(query, [Class, Division], (err, results) => {
    if (err) {
      console.error('Error executing the query:', err);
      res.status(500).send('Internal Server Error');
    } else {
      console.log('Query results:', results);
      res.json(results);
    }
  });
});

app.post('/submit_attendance', (req, res) => {
  try {
    const { Teacher, Date, attendanceData } = req.body;

    // Assuming you have a database connection setup
    const attendanceQuery =
      'INSERT INTO attendance (Roll_no, student_name, Class, division, presenty, Teacher_name, Date) VALUES (?, ?, ?, ?, ?, ?, ?)';

    attendanceData.forEach((student) => {
      const { Roll_no, student_name, Class, division, presenty } = student;
      pool.query(attendanceQuery, [Roll_no, student_name, Class, division, presenty, Teacher, Date], (err) => {
        if (err) {
          console.error('Error inserting attendance:', err);
          res.status(500).json({ success: false, message: 'Internal Server Error' });
          return;
        }
      });
    });

    console.log('Attendance submitted successfully');
    res.json({ success: true, message: 'Attendance submitted successfully.' });
  } catch (error) {
    console.error('Error in submit_attendance endpoint:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});


app.get('/Attendance', (req, res) => {
    res.sendFile(path.join(__dirname, 'adminhomepage', 'attendance_page.html'));
});

app.post('/addstudent', upload.single('image'), (req, res) => {
  const {
    student_name,
    class: student_class,
    division,
    username,
    password,
    Teacher,
    Roll_no,
  } = req.body;

  // Convert the file buffer to a Base64-encoded string
  const image = req.file.buffer.toString('base64');

  const insertQuery = 'INSERT INTO students (student_name, class, division, image, username, password, Teacher, Roll_no) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';

  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting MySQL connection:', err);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }

    connection.query(
      insertQuery,
      [student_name, student_class, division, image, username, password, Teacher, Roll_no],
      (error, results) => {
        connection.release();

        if (error) {
          console.error('Error executing MySQL query:', error);
          res.status(500).json({ message: 'Internal server error' });
          return;
        }

        res.redirect('/adminhomepage/');
      }
    );
  });
});


app.get('/uploadstudent', (req, res) => {
  // Render the notice_page.html or handle the notice-related logic here
  res.sendFile(path.join(__dirname, 'adminhomepage', 'addstudent.html'));
});


// Routes related to notice
app.post('/submit', upload.single('File'), (req, res) => {
    const { classValue, Division, Date, Notice } = req.body;
    // const pdfBuffer = req.file.buffer;
    const pdfBuffer = req.file ? req.file.buffer : null;
  
    const sql = 'INSERT INTO NoticeTable (class, division, notice_date, notice_text, pdf) VALUES (?, ?, ?, ?, ?)';
  
    pool.getConnection((err, connection) => {
      if (err) {
        console.error('Error getting MySQL connection:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
  
      connection.query(sql, [classValue, Division, Date, Notice, pdfBuffer], (err, result) => {
        connection.release(); // Release the connection back to the pool
  
        if (err) {
          console.error(err);
          res.status(500).json({ error: 'Internal Server Error' });
        } else {
          // Redirect to the /notice page and render notice_page.html
          res.redirect('http://localhost:3000/adminhomepage/');  // Replace with your actual domain and port

        }
      });
    });
  });
  
  app.get('/notice', (req, res) => {
    // Render the notice_page.html or handle the notice-related logic here
    res.sendFile(path.join(__dirname, 'adminhomepage', 'notice_page.html'));
  });



  app.post('/submit-circular', upload.single('File'), (req, res) => {
    const { Date, Circular } = req.body;  // Updated field names based on HTML form
    // const pdfBuffer = req.file.buffer;
    const pdfBuffer = req.file ? req.file.buffer : null;

    const sql = 'INSERT INTO CircularTable (circular_date, circular_text, pdf) VALUES (?, ?, ?)';  // Updated table name and columns

    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting MySQL connection:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        connection.query(sql, [Date, Circular, pdfBuffer], (err, result) => {
            connection.release(); // Release the connection back to the pool

            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Internal Server Error' });
            } else {
                // Redirect to the /Circular page and render circular_page.html
                res.redirect('http://localhost:3000/adminhomepage/');
            }
        });
    });
});

app.get('/circular', (req, res) => {
    // Render the circular_page.html or handle the circular-related logic here
    res.sendFile(path.join(__dirname, 'adminhomepage', 'circular_page.html'));
});

app.get('/student-notes', (req, res) => {
  // Render the circular_page.html or handle the circular-related logic here
  res.sendFile(path.join(__dirname, 'homepage', 'tracking_page.html'));
});



app.get('/subjects/:class', (req, res) => {
  const selectedClass = req.params.class;
  const tableName = `class${selectedClass}notes`;

  const query = `SELECT DISTINCT subject FROM ${tableName}`;

  pool.query(query, (error, results) => {
    if (error) {
      console.error('Error executing query: ', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    const subjects = results.map(result => result.subject);
    res.json(subjects);
  });
});

// API endpoint to get chapters based on the selected class and subject
app.get('/chapters/:class/:subject', (req, res) => {
  const selectedClass = req.params.class;
  const selectedSubject = req.params.subject;
  const tableName = `class${selectedClass}notes`;

  const query = `SELECT DISTINCT chapter FROM ${tableName} WHERE subject = ?`;

  pool.query(query, [selectedSubject], (error, results) => {
    if (error) {
      console.error('Error executing query: ', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    const chapters = results.map(result => result.chapter);
    res.json(chapters);
  });
});


app.post('/submitNotesData', upload.single('pdfFile'), (req, res) => {
  const { class: selectedClass, division, subject, chapter, description } = req.body;
  const pdfFileBuffer = req.file.buffer;

  // Convert 'null' string to actual null value for division
  const processedDivision = division === 'null' ? null : division;

  // Use the processed values in the database query
  const query = 'INSERT INTO notes_data (class, division, subject, chapter, description, file_data) VALUES (?, ?, ?, ?, ?, ?)';
  pool.query(query, [selectedClass, processedDivision, subject, chapter, description, pdfFileBuffer], (error, results) => {
    if (error) {
      console.error('Error executing query: ', error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    res.json({ message: 'Data submitted successfully' });
  });
});


app.get('/subjects', (req, res) => {
  // Retrieve class and division from the students table using globalUsername and globalPassword
  const userQuery = 'SELECT class, division FROM students WHERE username = ? AND password = ?';
  
  pool.query(userQuery, [globalUsername, globalPassword], (userError, userResults) => {
    if (userError) {
      console.error('Error executing user query: ', userError);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    if (userResults.length === 0) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const userClass = userResults[0].class;
    const userDivision = userResults[0].division;

    // Now, retrieve distinct subjects for the user's class
    const tableName = `class${userClass}notes`;
    const subjectsQuery = `SELECT DISTINCT subject FROM ${tableName}`;
    
    pool.query(subjectsQuery, (subjectsError, subjectsResults) => {
      if (subjectsError) {
        console.error('Error executing subjects query: ', subjectsError);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }

      const subjects = subjectsResults.map(result => result.subject);
      res.json(subjects);
    });
  });
});

// API endpoint to get chapters based on the selected subject
app.get('/chapters/:subject', (req, res) => {
  const { subject } = req.params;

  // Retrieve class from the students table using globalUsername and globalPassword
  const userQuery = 'SELECT class FROM students WHERE username = ? AND password = ?';
  
  pool.query(userQuery, [globalUsername, globalPassword], (userError, userResults) => {
    if (userError) {
      console.error('Error executing user query: ', userError);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    if (userResults.length === 0) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const userClass = userResults[0].class;

    // Now, retrieve chapters for the selected subject and user's class
    const tableName = `class${userClass}notes`;
    const chaptersQuery = `SELECT chapter FROM ${tableName} WHERE subject = ?`;
    
    pool.query(chaptersQuery, [subject], (chaptersError, chaptersResults) => {
      if (chaptersError) {
        console.error('Error executing chapters query: ', chaptersError);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }

      const chapters = chaptersResults.map(result => result.chapter);
      res.json(chapters);
    });
  });
});


app.get('/getFile/:id', (req, res) => {
    const { id } = req.params;
  
    pool.getConnection((err, connection) => {
      if (err) {
        console.error('Error getting MySQL connection from pool: ', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
  
      const query = 'SELECT file_data FROM notes_data WHERE id = ?';
      connection.query(query, [id], (error, results) => {
        connection.release(); // Release the connection back to the pool
        if (error) {
          console.error('Error executing query: ', error);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
        }
  
        if (results.length > 0 && results[0].file_data) {
          // Send the BLOB data as response with appropriate headers
          res.setHeader('Content-Type', 'application/pdf'); // Adjust based on your file type
          res.status(200).send(results[0].file_data);
        } else {
          res.status(404).send('File not found');
        }
      });
    });
  });


  app.post('/getNotesData', (req, res) => {
    const { subject, chapter } = req.body;
  
    // Step 1: Retrieve class and division of the user from the students table
    pool.getConnection((err, connection) => {
      if (err) {
        console.error('Error getting MySQL connection from pool: ', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
  
      const userQuery = 'SELECT class, division FROM students WHERE username = ? AND password = ?';
      connection.query(userQuery, [globalUsername, globalPassword], (userError, userResults) => {
        if (userError) {
          connection.release();
          console.error('Error executing user query: ', userError);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
        }
  
        if (userResults.length === 0) {
          connection.release();
          res.status(404).json({ error: 'User not found' });
          return;
        }
  
        const userClass = userResults[0].class;
        const userDivision = userResults[0].division;
  
        
        const query = `SELECT * FROM notes_data WHERE (subject = ? AND chapter = ? AND class = ? AND division = ?) OR (subject = ? AND chapter = ? AND class = ? AND division IS NULL)`;
  
        connection.query(query, [subject, chapter, userClass, userDivision, subject, chapter, userClass], (error, results) => {
          connection.release(); // Release the connection back to the pool
          if (error) {
            console.error('Error executing query: ', error);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
          }
  
          res.json(results);
        });
      });
    });
  });

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
