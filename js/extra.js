//snack bar
function toastbar(message, color) {
    var el = document.createElement("div");
    el.className = "snackbar";
    var y = document.getElementById("snackbar-container");
    el.style.color = color;
    el.innerHTML = message;
    y.append(el);
    el.className = "snackbar show";
    setTimeout(function () {
        el.className = el.className.replace("snackbar show", "snackbar");
    }, 3000);
}

// Header
const headerContainer = document.getElementById('header-container');

fetch('sub_files/header.html')
    .then(response => response.text())
    .then(data => {
        headerContainer.innerHTML = data;
        const currentUrl = window.location.href;
        const currentFilename = currentUrl.substring(currentUrl.lastIndexOf('/') + 1).split('?')[0];

        const navBar = document.querySelector('.nav-bar');
        const links = navBar.getElementsByTagName('a');
        for (let i = 0; i < links.length; i++) {
            const link = links[i];
            const href = link.href;
            const linkFilename = href.substring(href.lastIndexOf('/') + 1).split('?')[0];
            if (currentFilename == linkFilename) {
                link.classList.add('active');
            }
        }
        //Logout  

        document.getElementById("logout_btn").addEventListener("click", function (event) {
            event.preventDefault();
            // Check if the cookies for email and username exist
            var emailCookie = getCookie("email");
            var usernameCookie = getCookie("username");

            if (emailCookie && usernameCookie) {
                // Delete both cookies
                deleteCookie("email");
                deleteCookie("username");
                toastbar(usernameCookie + " Logged out successfully!", 'green');
            } else {
                // Alert the user that they are not logged in
                toastbar("You are not logged in.", 'red');
            }
        });
    })
    .catch(error => {
        toastbar("Error fetching header:","red")
    });


// Booking
const bookformContainer = document.getElementById('bookform-container');
if (bookformContainer) {
    fetch('sub_files/booking_form.html')
        .then(response => response.text())
        .then(data => {
            // Insert the header contents into the container element
            bookformContainer.innerHTML = data;
            const searchInput = document.getElementById('searchInput');
            const searchResults = document.getElementById('searchResults');
            const maxResults = 4; // Maximum number of search results to display

            searchInput.addEventListener('input', function () {
                const searchText = searchInput.value.toLowerCase();
                searchResults.innerHTML = ''; // Clear previous search results
                if (searchText !== '') {
                    fetch('../package.html')
                        .then(response => response.text())
                        .then(html => {
                            const parser = new DOMParser();
                            const doc = parser.parseFromString(html, 'text/html');
                            const packageTitles = doc.getElementsByClassName('package-title');
                            
                            for (let i = 0; i < packageTitles.length; i++) {
                                const packageTitle = packageTitles[i].textContent;
                                if (packageTitle.toLowerCase().includes(searchInput.value.toLowerCase())) {
                                    const listItem = document.createElement('li');
                                    listItem.textContent = packageTitle;
                                    searchResults.appendChild(listItem);
                                }
                            }
                            if (packageTitles.length > 0) {
                                searchResults.style.display = 'block';
                            } else {
                                searchResults.style.display = 'none';
                            }
                        })
                        .catch(error => {
                            console.error('Error fetching package.html:', error);
                        });
                } else {
                    searchResults.style.display = 'none';
                }
            });

            searchResults.addEventListener('click', function (event) {
                const selectedResult = event.target.textContent;
                searchInput.value = selectedResult;
                searchResults.style.display = 'none';
            });
            // Submit booking form btn booking_btn
            // Get the elements
            const searchInputValue = document.getElementById("searchInput");
            const date1 = document.getElementById("date1");
            const date2 = document.getElementById("date2");
            const bookingBtn = document.getElementById("booking_btn");

            // Add click event listener to the booking button
            bookingBtn.addEventListener("click", function () {
                if (searchInputValue.value == '' || date1.value == '' || date2.value == '') {
                    toastbar('Please Fill in all the information','red')
                    searchInput.classList.add("flashing");
                    date1.classList.add("flashing");
                    date2.classList.add("flashing");

                    // Remove the flashing class after 3 seconds
                    setTimeout(function () {
                        searchInput.classList.remove("flashing");
                        date1.classList.remove("flashing");
                        date2.classList.remove("flashing");
                    }, 1500);
                    return
                }
                // Create a JSON object with the input values
                const bookingData = {
                    search: searchInputValue.value,
                    date1: date1.value,
                    date2: date2.value
                };

                // Calculate the expiry date (1 year from now)
                const expiryDate = new Date();
                expiryDate.setFullYear(expiryDate.getFullYear() + 1);

                // Set the cookie with the expiry date
                document.cookie = "Searchinginfo=" + encodeURIComponent(JSON.stringify(bookingData)) + "; expires=" + expiryDate.toUTCString();

                // Open the new page
                window.open("package.html?" + searchInputValue.value, "_self");
            });

            //Get Blog Data
            // Function to retrieve the value of a cookie by name
            function getCookie(cname) {
                var name = cname + "=";
                var decodedCookie = decodeURIComponent(document.cookie);
                var ca = decodedCookie.split(';');
                for (var i = 0; i < ca.length; i++) {
                    var c = ca[i];
                    while (c.charAt(0) === ' ') {
                        c = c.substring(1);
                    }
                    if (c.indexOf(name) === 0) {
                        return c.substring(name.length, c.length);
                    }
                }
                return "";
            }

            // Retrieve the stored cookie value
            const storedCookie = getCookie("Searchinginfo");
            // Parse the stored cookie value as a JSON object
            if (storedCookie != '') {
                const storedData = JSON.parse(decodeURIComponent(storedCookie));

                // Retrieve the input elements
                const date1Input = document.getElementById("date1");
                const date2Input = document.getElementById("date2");

                // Set the input field values from the stored data
                searchInput.value = storedData.search;
                date1Input.value = storedData.date1;
                date2Input.value = storedData.date2;

                // Fetch the "blog.json" file and process the results based on the search input
                fetch('../package.html')
                    .then(response => response.text())
                    .then(html => {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(html, 'text/html');
                        const packageTitles = doc.getElementsByClassName('package-title');

                        for (let i = 0; i < packageTitles.length; i++) {
                            const packageTitle = packageTitles[i].textContent;
                            if (packageTitle.toLowerCase().includes(searchInput.value.toLowerCase())) {
                                const listItem = document.createElement('li');
                                listItem.textContent = packageTitle;
                                searchResults.appendChild(listItem);
                            }
                        }
                    })
                    .catch(error => {
                        console.error('Error fetching package.html:', error);
                    });
            } 
        })
        .catch(error => {
            console.error('Error fetching header:', error);
        });
}

//Footer
const footerContainer = document.getElementById('footer-container');
if (footerContainer) {
    fetch('sub_files/footer.html')
        .then(response => response.text())
        .then(data => {
            footerContainer.innerHTML = data;
            const currentUrl = window.location.href;
            const currentFilename = currentUrl.substring(currentUrl.lastIndexOf('/') + 1).split('?')[0];

            const navBar = document.querySelector('.nav-bar');
            const links = navBar.getElementsByTagName('a');
            for (let i = 0; i < links.length; i++) {
                const link = links[i];
                const href = link.href;
                const linkFilename = href.substring(href.lastIndexOf('/') + 1).split('?')[0];
                if (currentFilename == linkFilename) {
                    link.classList.add('active');
                }
            }
        })
        .catch(error => {
            console.error('Error fetching footer:', error);
        });
}
if (document.readyState === "complete" || document.readyState === "interactive") {
    var snackbarContainer = document.createElement("div");
    snackbarContainer.id = "snackbar-container";

    // Append the snackbar container element to the body
    document.body.appendChild(snackbarContainer);
    const jsonData = [
        {
            "username": "user1",
            "password": "123456",
            "email": "user1@example.com",
            "phone": "12345678"
        },
        {
            "username": "user2",
            "password": "123456",
            "email": "user2@example.com",
            "phone": "23456789"
        },
        {
            "username": "user3",
            "password": "123456",
            "email": "user3@example.com",
            "phone": "34567890"
        }
    ];

    if (!localStorage.getItem('user')) {
        localStorage.setItem('user', JSON.stringify(jsonData));
        console.log('User data stored in localStorage:', jsonData);
    } else {
        const userData = JSON.parse(localStorage.getItem('user'));
        console.log('User data retrieved from localStorage:', userData);
        // Call a function or perform any additional operations with the data
    }
};

//Login
var loginBtn = document.getElementById("login_btn");
// Check if the login button element exists
if (loginBtn) {
    loginBtn.addEventListener("click", function (event) {
        event.preventDefault(); // Prevent the default form submission behavior

        // Get the values from the email and password inputs
        var email = document.querySelector('input[name="lemail"]').value;
        var password = document.querySelector('input[name="lpass"]').value;

        var userData = JSON.parse(localStorage.getItem('user'));
        var isLoggedIn = document.cookie.includes('email=') && document.cookie.includes('username=');
        if (isLoggedIn) {
            toastbar("You are already logged in " + getCookie(username), 'red')
            return
        }
        if (userData) {
            var user = userData.find(user => user.email === email);
            if (!user) {
                toastbar("User not found", 'red');
                return;
            }
            if (user.password === password) {
                document.cookie = "email=" + encodeURIComponent(user.email) + "; path=/";
                document.cookie = "username=" + encodeURIComponent(user.username) + "; path=/";
                toastbar("Login successful\nUsername: " + user.username, 'green')
            } else {
                // Invalid email or password
                toastbar("Invalid email or password", 'red')
                // Display an error message or perform other actions for invalid login
            }
        } else {
            // User data not found in localStorage
            toastbar("localStorage not initialized", 'red')
        }
    });
}

//Sign in
var signBtn = document.getElementById("sign_btn");
// Check if the login button element exists
if (signBtn) {
    signBtn.addEventListener("click", function (event) {
        event.preventDefault(); // Prevent the default form submission behavior

        // Get the values from the signup form inputs
        var username = document.querySelector('input[name="name"]').value;
        var password = document.querySelector('input[name="pass"]').value;
        var email = document.querySelector('input[name="email"]').value;
        var phone = document.querySelector('input[name="phoneno"]').value;

        // Validate each field
        if (username.trim() === '') {
            toastbar('Please enter a username.', 'red');
            return;
        }

        if (email.trim() === '') {
            toastbar('Please enter an email.', 'red');
            return;
        }

        if (phone.trim() === '') {
            toastbar('Please enter a phone number.', 'red');
            return;
        }

        if (password.trim() === '') {
            toastbar('Please enter a password.', 'red');
            return;
        }


        // Create a new user object with the signup data
        var newUser = {
            "username": username,
            "password": password,
            "email": email,
            "phone": phone
        };

        // Get the existing user data from localStorage
        var userData = JSON.parse(localStorage.getItem('user')) || [];

        // Add the new user to the existing user data
        userData.push(newUser);

        // Store the updated user data in localStorage
        localStorage.setItem('user', JSON.stringify(userData));

        // Reset the form inputs
        document.querySelector('input[name="name"]').value = '';
        document.querySelector('input[name="pass"]').value = '';
        document.querySelector('input[name="email"]').value = '';
        document.querySelector('input[name="phoneno"]').value = '';

        // Display a success message as a toast and log the modified data to the console
        toastbar('Signup successful', 'green');
        console.log('Modified Data:', userData);

    });
}

// Helper function to get the value of a cookie
function getCookie(name) {
    var cookieName = name + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var cookieArray = decodedCookie.split(";");

    for (var i = 0; i < cookieArray.length; i++) {
        var cookie = cookieArray[i];
        while (cookie.charAt(0) == " ") {
            cookie = cookie.substring(1);
        }
        if (cookie.indexOf(cookieName) == 0) {
            return cookie.substring(cookieName.length, cookie.length);
        }
    }

    return "";
}

// Helper function to delete a cookie
function deleteCookie(name) {
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}


//set the profile.html content
var profile = document.querySelector(".container.profile");
// Check if the login button element exists
if (profile) {
    var cookies = document.cookie.split("; ");
    var username = null;
    cookies.forEach(function (cookie) {
        var parts = cookie.split("=");
        if (parts[0] === "username") {
            username = decodeURIComponent(parts[1]);
        }
    });


    if (username) {
        // Get the user data from localStorage
        var userData = JSON.parse(localStorage.getItem('user')) || [];
        // Find the user with the matching username
        var user = userData.find(function (user) {
            return user.username === username;
        });

        if (user) {
            // Set the values in the input fields
            document.getElementById("name").value = user.username;
            document.getElementById("email").value = user.email;
            document.getElementById("psw").value = user.password;
            document.getElementById("phone").value = user.phone;
        }
    }
}


//Profile page submit btn
var submitChangeBtn = document.getElementById("submit_change_btn");
// Check if the submit button element exists
if (submitChangeBtn) {
    submitChangeBtn.addEventListener("click", function (event) {
        event.preventDefault(); // Prevent the default form submission behavior

        // Get the values from the input fields
        var name = document.getElementById("name").value;
        var email = document.getElementById("email").value;
        var password = document.getElementById("psw").value;
        var phone = document.getElementById("phone").value;

        // Get the user data from localStorage
        var userData = JSON.parse(localStorage.getItem('user')) || [];

        // Find the user with the matching email
        var user = userData.find(function (user) {
            //console.log(user.email === getCookie("email"))
            return user.email === getCookie("email");
        });
        // Check if there are any changes
        if (user && user.username === name && user.password === password && user.phone === phone && user.email === email) {
            toastbar("No changes need to submit", 'red');
            return;
        }

        // Update the user data in localStorage
        var updatedUserData = userData.map(function (existingUser) {
            // console.log(existingUser)
            if (existingUser.username === getCookie("username")) {
                return {
                    "username": name,
                    "password": password,
                    "email": email,
                    "phone": phone
                };
            }
            return existingUser;
        });
        localStorage.setItem('user', JSON.stringify(updatedUserData));
        if (getCookie("email")) {
            toastbar("User edits saved", 'green');
        }
        var emailCookie = getCookie("email");
        var usernameCookie = getCookie("username");

        if (emailCookie && usernameCookie) {
            // Delete both cookies
            deleteCookie("email");
            deleteCookie("username");
            toastbar(usernameCookie + " Logged out successfully!", 'green');
        } else {
            // Alert the user that they are not logged in
            toastbar("You are not logged in.", 'red');
        }
        // Redirect user to login.html after 2 seconds
        setTimeout(function () {
            window.location.href = "login.html";
        }, 2000);
    });
}