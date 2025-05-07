async function login() {// login function of an button specified in the html file
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    var loginButton = document.getElementById("loginbut");
    
        // Send a request to the server for authentication
    console.log(username);
    console.log(password);
    if(username === "" || password ===""){
        // alert("Fill Username and Password");
        showPopup('Fill all the credentils!');
        
    }    
    else{
        
        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),// sending data to the server in the form of json data
            });

            const data = await response.json();// waiting for the respose from the server

            if (response.ok) {
                // Authentication successful, redirect the user
                const hostpath = 'http://localhost:3000';
                const newPath = hostpath + '/logined';
                // console.log(newPath);
                
                // alert("Succesfuly Logined..");
                showPopup('Succesfuly Logined..');
                window.location.href = newPath;

            } else {
                // authentical unsuccesful, print message password or username is inorrect
                // alert("Password or Username is incorrect!");
                showPopup('Password or Username is incorrect!');
                //location.reload();
            }
        } catch (error) {
            console.error('Error during login:', error);// endline error
        }
    
    //loginButton.disabled = true;
    // location.reload();
   }
}


