

  // document.addEventListener('DOMContentLoaded', function () {
  //   console.log('Script executed!'); // Add this line
  //   var loginButton = document.getElementById('loginButton');

  //   loginButton.addEventListener('click', function () {
  //     // Redirect to the homepage when the login button is clicked
  //     const hostpath = 'http://localhost:3000';
  //     const newPath = hostpath + '/homepage';
  //     window.location.href = newPath;
  //   });
  // });

// logined.js

document.addEventListener('DOMContentLoaded', function () {
  console.log('Script executed!'); // Add this line
  var loginButton = document.getElementById('loginButton');

  loginButton.addEventListener('click', function () {
    // Access the value of the hidden input field
    const isAdminValue = document.getElementById('isAdminValue').value;
    const isAdmin = JSON.parse(isAdminValue) || false; // Default to false if value not set

    // Redirect based on user type
    if (isAdmin) {
      const hostpath = 'http://localhost:3000';
      const adminPath = hostpath + '/adminhomepage';
      window.location.href = adminPath;
    } else {
      const hostpath = 'http://localhost:3000';
      const newPath = hostpath + '/homepage';
      window.location.href = newPath;
    }
  });
});

  