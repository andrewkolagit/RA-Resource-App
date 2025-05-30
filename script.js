const notificationBell = document.getElementById('notificationBell');
const notificationDropdown = document.getElementById('notificationDropdown');
const notificationList = document.getElementById('notificationList');
const notificationDot = document.getElementById('notificationDot'); // Get the notification dot element

// Create overlay element
const overlay = document.createElement('div'); // Create overlay element
overlay.className = 'overlay'; // Assign class for styling
document.body.appendChild(overlay); // Add overlay to the body

notificationBell.addEventListener('click', () => {
    if (notificationDropdown.classList.contains('show')) {
        // If dropdown is already shown, apply closing animation
        notificationDropdown.classList.add('closing');
        notificationDropdown.addEventListener('animationend', function hideAfterClose() {
            notificationDropdown.style.display = 'none'; // Hide dropdown after animation ends
            notificationDropdown.classList.remove('show', 'closing'); // Remove classes
            overlay.classList.remove('visible'); // Hide overlay
            document.body.classList.remove('no-scroll'); // Enable page scroll
            notificationDropdown.removeEventListener('animationend', hideAfterClose);
        });
    } else {
        // Show dropdown and load notifications
        notificationDropdown.style.display = 'block'; // Show dropdown
        notificationDropdown.classList.add('show'); // Apply show class
        loadNotifications(); // Load notifications when bell is clicked
        notificationDot.style.display = 'none'; // Hide dot when dropdown is opened
        overlay.classList.add('visible'); // Show overlay
        document.body.classList.add('no-scroll'); // Disable page scroll
    }
});

// Close dropdown when clicking outside
window.addEventListener('click', (event) => {
    if (!event.target.matches('.notification-bell')) {
        if (notificationDropdown.classList.contains('show')) {
            // Apply closing animation when closing from outside
            notificationDropdown.classList.add('closing');
            notificationDropdown.addEventListener('animationend', function hideAfterClose() {
                notificationDropdown.style.display = 'none'; // Hide dropdown after animation ends
                notificationDropdown.classList.remove('show', 'closing'); // Remove classes
                overlay.classList.remove('visible'); // Hide overlay
                document.body.classList.remove('no-scroll'); // Enable page scroll
                notificationDropdown.removeEventListener('animationend', hideAfterClose);
            });
        }
    }
});

// Overlay click event to close the dropdown
overlay.addEventListener('click', () => {
    if (notificationDropdown.classList.contains('show')) {
        notificationDropdown.classList.add('closing');
        notificationDropdown.addEventListener('animationend', function hideAfterClose() {
            notificationDropdown.style.display = 'none'; // Hide dropdown after animation ends
            notificationDropdown.classList.remove('show', 'closing'); // Remove classes
            overlay.classList.remove('visible'); // Hide overlay
            document.body.classList.remove('no-scroll'); // Enable page scroll
            notificationDropdown.removeEventListener('animationend', hideAfterClose);
        });
    }
});

async function fetchNotifications() {
    const tableName = 'notifications'; // Replace with your table name
    const url = `/.netlify/functions/fetchAirtable?tableName=${tableName}`;

    const response = await fetch(url);

    if (!response.ok) {
        console.error('Error fetching notifications data:', response.statusText);
        return [];
    }

    const data = await response.json();
    return data.records;
}
        
        function filterNotifications(records) {
            const currentTime = new Date();
            const notificationsToShow = records.filter(record => {
                const dateToPost = new Date(record.fields.date_to_post);
                const dateToRemove = new Date(record.fields.date_to_remove);
                return (currentTime >= dateToPost && currentTime < dateToRemove);
            });

            return notificationsToShow;
        }

        async function loadNotifications() {
            const records = await fetchNotifications();
            const notifications = filterNotifications(records);

            notificationList.innerHTML = ''; // Clear existing notifications

            if (notifications.length === 0) {
                notificationList.innerHTML = '<li>No new notifications</li>';
                notificationDot.style.display = 'none'; // Hide the dot if no notifications
            } else {
                notificationDot.style.display = 'block'; // Show the dot if there are notifications
                notifications.forEach(notification => {
                    const li = document.createElement('li');
                    li.innerHTML = `<p><strong>Subject:</strong> ${notification.fields.subject}<br> - ${notification.fields.message}</p>`; // Bold subject with break
                    notificationList.appendChild(li);
                });
            }
        }

        // Duty Day functionality
        async function fetchDutyDay() {
    const tableName = 'dutyday'; // Replace with your table name
    const url = `/.netlify/functions/fetchAirtable?tableName=${tableName}`;

    const response = await fetch(url);

    if (!response.ok) {
        console.error('Error fetching notifications data:', response.statusText);
        return [];
    }

    const data = await response.json();
    return data.records;
        }

        async function loadDutyDay() {
            const records = await fetchDutyDay();
            const currentTime = new Date();
            const dutyDayContent = document.getElementById('dutyDayContent');

            // Reset content
            dutyDayContent.innerHTML = '';

            // Check if there's a matching duty day for the current time
            let hasData = false;
            records.forEach(record => {
                const dateStart = new Date(record.fields.date_start);
                const dateEnd = new Date(record.fields.date_end);
                
                if (currentTime >= dateStart && currentTime < dateEnd) {
                    hasData = true;

                    const div = document.createElement('div');
                    div.innerHTML = `
                        <h3>
                        <p>Warhawk/Courtyards:<br> <a>${record.fields.warhawk_courtyards}</a></p><br>
                        <p>Commons/P-40:<br> <a>${record.fields.commons_p40}</a></p><br>
                        <p>RLC:<br> <a>${record.fields.rlc}</a></p></h3>
                    `;
                    dutyDayContent.appendChild(div);
                }
            });

            // If no data found, show default message
            if (!hasData) {
                const defaultDiv = document.createElement('div');
                defaultDiv.innerHTML = `<p>Will update at 4:30PM</p>`;
                dutyDayContent.appendChild(defaultDiv);
            }
        }

        // Load both notifications and duty day on page load
        window.onload = () => {
            loadNotifications();
            loadDutyDay();
            setInterval(loadNotifications, 1000);
            setInterval(loadDutyDay, 1000);
            };
      
const hamburgerMenu = document.querySelector('.hamburger-menu');
const sidePanel = document.querySelector('.side-panel');

hamburgerMenu.addEventListener('click', () => {
    const isOpen = sidePanel.classList.toggle('open'); // Toggle the side panel
    overlay.classList.toggle('visible', isOpen); // Show/hide overlay based on panel state
    document.body.classList.toggle('no-scroll', isOpen); // Disable/enable page scroll
});

overlay.addEventListener('click', () => {
    // Close side panel when overlay is clicked
    sidePanel.classList.remove('open');
    overlay.classList.remove('visible'); // Hide the overlay
    document.body.classList.remove('no-scroll'); // Enable page scroll
});

// Close the side panel if clicked outside (overlay handles this)
window.addEventListener('click', (event) => {
    if (!sidePanel.contains(event.target) && !hamburgerMenu.contains(event.target) && sidePanel.classList.contains('open')) {
        sidePanel.classList.remove('open');
        overlay.classList.remove('visible'); // Hide the overlay
        document.body.classList.remove('no-scroll'); // Enable page scroll
    }
});
      
function toggleFeedbackPopup() {
    const feedbackPopup = document.getElementById("feedbackPopup");
    const overlay = document.querySelector('.overlay'); // Get the overlay element

    if (feedbackPopup.classList.contains("opening")) {
        // If the form is open, apply the closing animation
        feedbackPopup.classList.remove("opening");
        feedbackPopup.classList.add("closing");

        // Wait for animation to complete before hiding
        feedbackPopup.addEventListener("animationend", function hideAfterClose() {
            feedbackPopup.style.display = "none";
            feedbackPopup.classList.remove("closing");
            overlay.classList.remove("visible"); // Hide overlay
            document.body.classList.remove("no-scroll"); // Enable page scroll
            feedbackPopup.removeEventListener("animationend", hideAfterClose);
        });
    } else {
        // If the form is closed, apply the opening animation
        feedbackPopup.classList.add("opening");
        feedbackPopup.style.display = "block";
        overlay.classList.add("visible"); // Show overlay
        document.body.classList.add("no-scroll"); // Disable page scroll
    }
}

// Close the popup when clicking outside of it
document.addEventListener("click", function(event) {
    const feedbackPopup = document.getElementById("feedbackPopup");
    const feedbackIcon = document.querySelector(".feedback-icon");
    const overlay = document.querySelector('.overlay'); // Get the overlay element

    // Check if the clicked target is not the popup or the feedback icon
    if (!feedbackPopup.contains(event.target) && !feedbackIcon.contains(event.target)) {
        // Close the popup if it is open
        if (feedbackPopup.classList.contains("opening")) {
            toggleFeedbackPopup();
        }
    }
});

// Overlay click event to close the feedback popup
overlay.addEventListener('click', () => {
    if (feedbackPopup.classList.contains("opening")) {
        toggleFeedbackPopup(); // Close the popup on overlay click
    }
});

// Function to send data to Airtable
async function sendFeedbackToAirtable(feedbackData) {
    const response = await fetch('/.netlify/functions/submitFeedback', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ feedback: feedbackData }) // Sending feedback as JSON
    });

    if (!response.ok) {
        const error = await response.json();
        console.error('Error:', error);
        alert('Error submitting feedback. Please try again later.');
    } else {
        alert('Feedback submitted successfully!');

        // Clear the form fields
        document.getElementById('feedbackForm').reset(); // Resets all form fields

        // Optionally, close the feedback popup after submission
        toggleFeedbackPopup();
    }
}

// Add an event listener to the form
document.getElementById('feedbackForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    const feedbackData = event.target.elements.feedback.value; // Get feedback value
    sendFeedbackToAirtable(feedbackData); // Call the function to send data
});

        async function fetchStudentData() {
    const sNumber = document.getElementById('sNumberInput').value.trim();
    const tableName = 'starrez'; // Replace with your table name
    const url = `/.netlify/functions/fetchAirtable2?tableName=${tableName}&sNumber=${encodeURIComponent(sNumber)}`;

    const response = await fetch(url);

    if (!response.ok) {
        console.error('Error fetching data:', response.statusText);
        alert("Student data not found.");
        return;
    }

    const data = await response.json();
    displayStudentData(data.records);
        }

        function displayStudentData(records) {
            const infoContainer = document.getElementById('studentInfoContainer');
            infoContainer.innerHTML = ''; // Clear any existing data

            if (records.length === 0) {
                alert("No data found for the provided SNumber.");
                return;
            }

            const fields = records[0].fields;

            // Data mapping
            const dataMap = {
                'Student ID Number': fields.snumber || 'N/A',
                'Last Name': fields.last_name || 'N/A',
                'First Name': fields.first_name || 'N/A',
                'Date of Birth': fields.dob || 'N/A',
                'Gender': fields.gen || 'N/A',
                'Room Number': fields.room_no || 'N/A',
                'Community': fields.community || 'N/A',
                'ESA': fields.esa || 'N/A'
            };

            // Display data vertically
            for (const [label, value] of Object.entries(dataMap)) {
                const row = document.createElement('div');
                row.className = 'info-row';
                
                const labelElement = document.createElement('span');
                labelElement.className = 'label';
                labelElement.textContent = `${label}: `;

                const valueElement = document.createElement('span');
                valueElement.className = 'value';
                valueElement.textContent = value;

                row.appendChild(labelElement);
                row.appendChild(valueElement);
                infoContainer.appendChild(row);
            }
        }
