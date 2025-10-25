let timers = [];
let nextId = 1;
let intervals = {};

const hoursInput = document.getElementById('hours');
const minutesInput = document.getElementById('minutes');
const secondsInput = document.getElementById('seconds');
const setTimerBtn = document.getElementById('setTimerBtn');
const timersContainer = document.getElementById('timersContainer');
const noTimersMessage = document.getElementById('noTimersMessage');

function playAlert() {
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSp+zPDTgjMGHm7A7+OZSA0PVqzn6qxbGQg+ltryxnMnBSl+zPDUhDUHH2/C8OKZSQ0OV63o6qxcGgg+mtvzxHIoBSh9y/DWhTYII3DE8N+UQwsRYrfq6qVSEwg7k9jwz38sBy59zPDXhjgIIXDA8N2PQgsQYbXp66VTFAc6kdfsz38tCCp+zPDXhjgIJXLA8N2PQgsQYbXp66VUFAc5kdfsz4AtCCp+zPDXhjgIJXLA8N2PQgsQYbXp66VUFAc5kdfsz4AtCCp+zPDXhjgIJXLA8N2PQgsQYbXp66VTFAc6kdfsz4AtCCp+zPDXhjgIJXLA8N2PQgsQYbXp66VTFAc6kdfsz38tCCp+zPDXhjgIJXLA8N2PQgsQYbXp66VTFAc6kdfsz38tCCp+zPDXhjgIJXLA8N2PQgsQYbXp66VTFAc6kdfsz38tCCp+zPDXhjgIJXLA8N2PQgsQYbXp66VTFAc6kdfsz38tCCp+zPDXhjgIJXLA8N2PQgsQYbXp66VTFAc6kdfsz38tCCp+zPDXhjgIJXLA8N2PQgsQYbXp66VTFAc6kdfsz38tCCp+zPDXhjgIJXLA8N2PQgsQYbXp66VTFAc6kdfsz38tCCp+zPDXhjgIJXLA8N2PQgsQYbXp66VTFAc6kdfsz38tCCp+zPDXhjgIJXLA8N2PQgsQYbXp66VTFAc6kdfsz38tCCp+zPDXhjgIJXLA8N2PQgsQYbXp66VTFAc6kdfsz38tCCp+zPDXhjgIJXLA8N2PQgsQYbXp66VTFAc6kdfsz38tCCp+zPDXhjgIJXLA8N2PQgsQYbXp66VTFAc6kdfsz38tCCp+zPDXhjgIJXLA8N2PQgsQYbXp66VTFAc6kdfsz38tCCp+zPDXhjgIJXLA8N2PQgsQYbXp66VTFAc6kdfsz38tCCp+zPDXhjgIJXLA8N2PQgsQYbXp66VTFAc6kdfsz38tCCp+zPDXhjgIJXLA8N2PQgsQYbXp66VTFAc6kdfsz38tCCp+zPDXhjgIJXLA8N2PQgsQYbXp66VTFAc6kdfsz38tCCp+zPDXhjgIJXLA8N2PQgsQYbXp66VTFAc6kdfsz38tCCp+zPDXhjgIJXLA8N2PQgsQYbXp66VTFAc6kdfsz38tCCp+zPDXhjgIJXLA8N2PQgsQYbXp66VTFAc6kdfsz38tCCp+zPDXhjgIJXLA8N2PQgsQYbXp66VTFAc6kdfs');
    audio.play().catch(e => console.log('Audio play failed'));
}

function formatTime(totalSeconds) {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return {
        hours: String(h).padStart(2, '0'),
        minutes: String(m).padStart(2, '0'),
        seconds: String(s).padStart(2, '0')
    };
}

function updateNoTimersMessage() {
    if (timers.length === 0) {
        noTimersMessage.classList.remove('hidden');
    } else {
        noTimersMessage.classList.add('hidden');
    }
}

function createTimerElement(timer) {
    const time = formatTime(timer.timeLeft);
    
    if (timer.finished) {
        const finishedDiv = document.createElement('div');
        finishedDiv.className = 'timer-finished';
        finishedDiv.setAttribute('data-id', timer.id);
        finishedDiv.innerHTML = `
            <span class="timer-finished-text">Timer Is Up !</span>
            <button class="stop-btn" onclick="deleteTimer(${timer.id})">Stop</button>
        `;
        return finishedDiv;
    }
    
    const timerCard = document.createElement('div');
    timerCard.className = 'timer-card';
    timerCard.setAttribute('data-id', timer.id);
    timerCard.innerHTML = `
        <div class="timer-content">
            <div class="timer-display">
                <span class="timer-label">Time Left :</span>
                <div class="time-display">
                    <span class="time-value">${time.hours}</span>
                    <span class="separator">:</span>
                    <span class="time-value">${time.minutes}</span>
                    <span class="separator">:</span>
                    <span class="time-value">${time.seconds}</span>
                </div>
            </div>
            <button class="delete-btn" onclick="deleteTimer(${timer.id})">Delete</button>
        </div>
    `;
    return timerCard;
}

function renderTimers() {
    timersContainer.innerHTML = '';
    timers.forEach(timer => {
        const timerElement = createTimerElement(timer);
        timersContainer.appendChild(timerElement);
    });
    updateNoTimersMessage();
}

function updateTimer(id) {
    const timer = timers.find(t => t.id === id);
    if (!timer || timer.finished) {
        if (intervals[id]) {
            clearInterval(intervals[id]);
            delete intervals[id];
        }
        return;
    }
    
    timer.timeLeft--;
    
    if (timer.timeLeft <= 0) {
        timer.timeLeft = 0;
        timer.finished = true;
        playAlert();
        clearInterval(intervals[id]);
        delete intervals[id];
    }
    
    const timerElement = document.querySelector(`[data-id="${id}"]`);
    if (timerElement && !timer.finished) {
        const time = formatTime(timer.timeLeft);
        const timeValues = timerElement.querySelectorAll('.time-value');
        if (timeValues.length === 3) {
            timeValues[0].textContent = time.hours;
            timeValues[1].textContent = time.minutes;
            timeValues[2].textContent = time.seconds;
        }
    } else if (timer.finished) {
        renderTimers();
    }
}

function startTimer(id) {
    if (intervals[id]) {
        clearInterval(intervals[id]);
    }
    intervals[id] = setInterval(() => updateTimer(id), 1000);
}

function deleteTimer(id) {
    if (intervals[id]) {
        clearInterval(intervals[id]);
        delete intervals[id];
    }
    timers = timers.filter(t => t.id !== id);
    renderTimers();
}

function handleSetTimer() {
    const h = parseInt(hoursInput.value) || 0;
    const m = parseInt(minutesInput.value) || 0;
    const s = parseInt(secondsInput.value) || 0;
    
    if (h === 0 && m === 0 && s === 0) {
        return;
    }
    
    if (m > 59 || s > 59) {
        return;
    }
    
    const totalSeconds = h * 3600 + m * 60 + s;
    
    const newTimer = {
        id: nextId,
        timeLeft: totalSeconds,
        finished: false
    };
    
    timers.push(newTimer);
    startTimer(nextId);
    nextId++;
    
    hoursInput.value = '';
    minutesInput.value = '';
    secondsInput.value = '';
    
    renderTimers();
}

setTimerBtn.addEventListener('click', handleSetTimer);

hoursInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSetTimer();
    }
});

minutesInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSetTimer();
    }
});

secondsInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSetTimer();
    }
});

updateNoTimersMessage();
