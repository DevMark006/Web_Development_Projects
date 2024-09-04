// Variables to hold timer and interval
let startTime, updatedTime, difference, tInterval;
let running = false;
let hours = 0;
let minutes = 0;
let seconds = 0;

// HTML elements
const display = document.getElementById('display');
const startButton = document.getElementById('start');
const stopButton = document.getElementById('stop');
const resetButton = document.getElementById('reset');

// Update display
function updateDisplay() {
    display.textContent = 
        (hours < 10 ? '0' : '') + hours + ':' +
        (minutes < 10 ? '0' : '') + minutes + ':' +
        (seconds < 10 ? '0' : '') + seconds;
}

// Start stopwatch
function startTimer() {
    if (!running) {
        running = true;
        startTime = new Date().getTime();
        tInterval = setInterval(getShowTime, 1);
    }
}

// Stop stopwatch
function stopTimer() {
    if (running) {
        running = false;
        clearInterval(tInterval);
    }
}

// Reset stopwatch
function resetTimer() {
    stopTimer();
    hours = 0;
    minutes = 0;
    seconds = 0;
    updateDisplay();
}

// Get elapsed time
function getShowTime() {
    updatedTime = new Date().getTime();
    difference = updatedTime - startTime;
    
    hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    minutes = Math.floor((difference / (1000 * 60)) % 60);
    seconds = Math.floor((difference / 1000) % 60);
    
    updateDisplay();
}

// Event listeners for buttons
startButton.addEventListener('click', startTimer);
stopButton.addEventListener('click', stopTimer);
resetButton.addEventListener('click', resetTimer);

// Initial display
updateDisplay();
