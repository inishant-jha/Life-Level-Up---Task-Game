// Data Initialization
let coins = localStorage.getItem('coins') ? parseInt(localStorage.getItem('coins')) : 0;
let weeklyData = JSON.parse(localStorage.getItem('weeklyData')) || [0, 0, 0, 0, 0, 0, 0];

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const todayIndex = new Date().getDay(); // Aaj ka din (0-6)

document.getElementById('coin-count').innerText = coins;

// Tab Switching
function showSection(sectionId) {
    document.querySelectorAll('section').forEach(s => s.classList.add('hidden'));
    document.getElementById(sectionId).classList.remove('hidden');
    if(sectionId === 'progress') renderChart();
}

// Task Completion & Graph Update
document.querySelectorAll('.task-check').forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        const completedTasks = document.querySelectorAll('.task-check:checked').length;
        
        // Update weekly data for today
        weeklyData[todayIndex] = completedTasks;
        localStorage.setItem('weeklyData', JSON.stringify(weeklyData));
    });
});

// Claim Reward Logic
document.getElementById('claim-btn').addEventListener('click', () => {
    const checks = document.querySelectorAll('.task-check:checked');
    if (checks.length === 5) {
        coins += 100;
        updateCoins();
        alert("Shaandaar! 100 bonus coins mil gaye!");
    } else {
        alert("Saare 5 tasks poore karo tabhi bonus milega!");
    }
});

// Shop Logic
function buyItem(price) {
    if (coins >= price) {
        coins -= price;
        updateCoins();
        alert("Item kharid liya gaya!");
    } else {
        alert("Paise (coins) kam hain! Thoda aur kaam karo.");
    }
}

function updateCoins() {
    document.getElementById('coin-count').innerText = coins;
    localStorage.setItem('coins', coins);
}

// Global variable for chart to prevent re-rendering issues
let myChart = null;

function renderChart() {
    const ctx = document.getElementById('progressChart').getContext('2d');
    
    // Purana chart delete karna zaroori hai naya banane se pehle
    if (myChart) {
        myChart.destroy();
    }

    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: days,
            datasets: [{
                label: 'Tasks Completed',
                data: weeklyData,
                borderColor: '#4ecca3',
                backgroundColor: 'rgba(78, 204, 163, 0.2)',
                borderWidth: 3,
                fill: true,
                tension: 0.3, // Curve effect
                pointRadius: 5
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 5, // Kyunki total 5 tasks hain
                    ticks: { stepSize: 1, color: '#fff' }
                },
                x: { ticks: { color: '#fff' } }
            },
            plugins: {
                legend: { labels: { color: '#fff' } }
            }
        }
    });
}