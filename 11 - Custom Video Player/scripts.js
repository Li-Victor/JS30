//Get elemenets
var player = document.querySelector('.player');
var video = player.querySelector('.viewer');
var progress = player.querySelector('.progress');
var progressBar = player.querySelector('.progress__filled');
var toggle = player.querySelector('.toggle');
var skipButtons = player.querySelectorAll('[data-skip]');
var ranges = player.querySelectorAll('.player__slider');
var fullScreenButton = player.querySelector('.fullScreen');

//build out functions

//toggle play video
function togglePlay() {
    if(video.paused) {
        video.play();
    } else {
        video.pause();
    }
}

function updateButton() {
    var icon = this.paused ? '►' : '❚ ❚';
    toggle.textContent = icon;
}

function skip() {
    video.currentTime += parseFloat(this.dataset.skip);
}

function handleRangeUpdate() {
    //this refers to the both ranges
    video[this.name] = this.value;
}

function handleProgress() {
    var percent = (video.currentTime / video.duration) * 100;
    progressBar.style.flexBasis = percent + '%';
}

function scrub(event) {
    var scrubTime = (event.offsetX / progress.offsetWidth) * video.duration;
    video.currentTime = scrubTime;
}

//hook up the event listeners
video.addEventListener('click', togglePlay);

//listening for play and pause events
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);

toggle.addEventListener('click', togglePlay);

skipButtons.forEach(function (button) {
    button.addEventListener('click', skip);
});

ranges.forEach(function (range) {
    range.addEventListener('change', handleRangeUpdate);
});

video.addEventListener('timeupdate', handleProgress);
progress.addEventListener('click', scrub);

var mousedown = false;
//want both mousedown and mousemove to scrub the video
progress.addEventListener('mousemove', function (event) {
    if(mousedown) scrub(event);
});
progress.addEventListener('mousedown', function () {
    mousedown = true;
});
progress.addEventListener('mouseup', function () {
    mousedown = false;
});

fullScreenButton.addEventListener('click', function () {
    if(video.requestFullscreen) video.requestFullScreen();
    else if(video.mozRequestFullscreen) video.mozRequestFullScreen();
    else if(video.webkitRequestFullscreen) video.webkitRequestFullscreen();
});
