document.addEventListener('DOMContentLoaded', function () {
    var taglineElement = document.getElementById('typing-text');
    var taglineText = taglineElement.textContent;
    taglineElement.textContent = '';

    var cursor = document.createElement('span');
    cursor.className = 'cursor';
    taglineElement.appendChild(cursor);

    var index = 0;

    function type() {
        var currentText = taglineElement.textContent || ''; // Use an empty string as a default value
        taglineElement.textContent = currentText + taglineText.charAt(index);

        index++;

        if (index <= taglineText.length) {
            cursor.style.display = 'inline-block';
            setTimeout(type, 100);
        } else {
            cursor.style.display = 'none';
        }
    }

    setTimeout(type, 1000); // Add a delay before starting the typing animation
});


function showPopup() {
    document.getElementById('myPopup').style.display = 'block';
}

function closePopup() {
    document.getElementById('myPopup').style.display = 'none';
}

// Example: Call showPopup() to display the popup
// You can call this function when needed, such as on a button click or any other event.
function showPopup(customText) {
    document.getElementById('myPopup').style.display = 'block';
    document.getElementById('h5').innerText = customText;
}

function closePopup() {
    document.getElementById('myPopup').style.display = 'none';
}

       