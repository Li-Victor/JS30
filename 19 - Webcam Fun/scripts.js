const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo() {
    navigator.mediaDevices.getUserMedia({
        video: {width: 1280, height: 720},
        audio: false
    }).then(function (localMediaStream) {
        video.src = window.URL.createObjectURL(localMediaStream);
        video.play();
    }).catch(function (error) {
        console.log('the error happening is', error);
    });
}

function paintToCanvas() {
    var width = video.videoWidth;
    var height = video.videoHeight;
    canvas.width = width;
    canvas.height = height;

    //canvas is being updated with video every 16ms
    return setInterval(function () {
        ctx.drawImage(video, 0, 0,  width, height);
        //get pixels, pixels are in rgba
        var pixels = ctx.getImageData(0, 0, width, height);
        //do some kind of effect with the pixels
        pixels = redEffect(pixels);
        //pixels = rgbSplit(pixels);

        //use pixels for canvas
        //ctx.globalAlpha = 0.1;
        //pixels = greenScreen(pixels);
        ctx.putImageData(pixels, 0, 0);
    }, 16);
}

function takePhoto() {
    //play sound
    snap.currentTime = 0;
    snap.play();

    //take data out of the canvas
    var data = canvas.toDataURL('image/jpeg');
    var link = document.createElement('a');
    link.href = data;
    link.setAttribute('download', 'handsome');
    // link.textContent = 'Download Image';
    link.innerHTML = '<img src="' + data + '" alt="Handsome man" />';
    strip.insertBefore(link, strip.firstChild);
}

function redEffect(pixels) {
    for (var i = 0; i < pixels.data.length; i += 4) {
        pixels.data[i] = pixels.data[i] + 200; //red
        pixels.data[i + 1] = pixels.data[i + 1] - 50; //green
        pixels.data[i + 2] = pixels.data[i + 2] * 0.5; //blue
    }
    return pixels;
}

function rgbSplit(pixels) {
    for (var i = 0; i < pixels.data.length; i += 4) {
        pixels.data[i - 150] = pixels.data[i]; //red
        pixels.data[i + 500] = pixels.data[i + 1]; //green
        pixels.data[i - 550] = pixels.data[i + 2]; //blue
    }
    return pixels;
}

function greenScreen(pixels) {
    var levels = {};

    document.querySelectorAll('.rgb input').forEach(function (input) {
        levels[input.name] = input.value;
    });

    for (var i = 0; i < pixels.data.length; i += 4) {
        var red = pixels.data[i];
        var green = pixels.data[i + 1];
        var blue = pixels.data[i + 2];
        var alpha = pixels.data[i + 3];

        if (red >= levels.rmin && green >= levels.gmin && blue >= levels.bmin &&
             red <= levels.rmax && green <= levels.gmax && blue <= levels.bmax) {
              // take it out!
              pixels.data[i + 3] = 0;
        }
    }
    return pixels;
}


getVideo();

//once the webcam video works, paintToCanvas
video.addEventListener('canplay', paintToCanvas);
