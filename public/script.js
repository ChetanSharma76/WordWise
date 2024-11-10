document.getElementById('urlForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const url = document.getElementById('urlInput').value;
    const n = parseInt(document.getElementById('nInput').value, 10);
    const resultBody = document.getElementById('resultBody');
    resultBody.innerHTML = '';

    if (isNaN(n) || n < 1) {
        alert('Please enter a valid number for top N words');
        return;
    }

    try {
        const response = await fetch('/api/frequency', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url, n }),
        });

        const data = await response.json();

        if (response.ok) {
            data.forEach(item => {
                const row = document.createElement('tr');
                const wordCell = document.createElement('td');
                const countCell = document.createElement('td');
                wordCell.textContent = item.word;
                countCell.textContent = item.count;
                row.appendChild(wordCell);
                row.appendChild(countCell);
                row.className = "bg-gray-50 dark:bg-gray-700 text-center";
                resultBody.appendChild(row);
            });
        } else {
            alert(data.error);
        }
    } catch (error) {
        alert('An error occurred: ' + error.message);
    }
});

// Dark Mode Toggle with Icon
const themeIcon = document.getElementById('themeIcon');

// Function to set the theme
function setTheme(isDark) {
    if (isDark) {
        document.documentElement.classList.add('dark'); // Apply dark mode
        themeIcon.textContent = 'light_mode'; // Change icon to sun
        localStorage.setItem('theme', 'dark'); // Save preference
    } else {
        document.documentElement.classList.remove('dark'); // Remove dark mode
        themeIcon.textContent = 'dark_mode'; // Change icon to moon
        localStorage.setItem('theme', 'light'); // Save preference
    }
}

// Initialize Theme on Page Load
const currentTheme = localStorage.getItem('theme');
setTheme(currentTheme === 'dark');

// Toggle Theme on Icon Click
themeIcon.addEventListener('click', () => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    setTheme(!isDarkMode);
});
