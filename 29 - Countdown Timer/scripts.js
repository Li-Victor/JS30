var countdown;
var timerDisplay = document.querySelector('.display__time-left');
var endTime = document.querySelector('.display__end-time');
var buttons = document.querySelectorAll('[data-time]');

function timer(seconds) {
    //clear any existing timers
    clearInterval(countdown);

    var now = Date.now();
    var then = now + (seconds * 1000);
    displaytimeLeft(seconds); //run first
    displayEndTime(then);

    countdown = setInterval(function () {
        var secondsLeft = Math.round((then - Date.now()) / 1000);

        if(secondsLeft < 0) {
            clearInterval(countdown);
            return;
        }

        displaytimeLeft(secondsLeft);
    }, 1000);
}

function displaytimeLeft(seconds) {
    var minutes = Math.floor(seconds / 60);
    var remainderSeconds = seconds % 60;

    var display = `${minutes}:${remainderSeconds >= 10 ? remainderSeconds : '0' + remainderSeconds}`;
    timerDisplay.textContent = display;
    document.title = display;
}

function displayEndTime(timestamp) {
    var end = new Date(timestamp);
    var hour = end.getHours();
    var minutes = end.getMinutes();
    endTime.textContent = `Be Back At ${hour > 12 ? hour - 12 : hour}:${minutes < 10 ? '0' : ''}${minutes}`;
}

function startTimer() {
    var seconds = parseInt(this.dataset.time);
    timer(seconds);
}

buttons.forEach(function (button) {
    button.addEventListener('click', startTimer);
});

document.customForm.addEventListener('submit', function (event) {
    event.preventDefault();
    var mins = this.minutes.value;
    timer(mins * 60);
    this.reset();
})
