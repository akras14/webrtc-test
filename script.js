var webrtc = (function(){

    var feed = document.getElementById('feed'),
        feedContext = feed.getContext('2d'),
        display = document.getElementById('display'),
        displayContext = display.getContext('2d');

    display.width = feed.width = 320;
    display.height = feed.height = 240;

    var getVideo, getAudio, video;

    window.requestAnimationFrame ||
    (window.requestAnimationFrame = window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function( callback ){
            window.setTimeout(callback, 1000 / 60);
        });

    function takePhoto() {
        var photo = document.getElementById('photo'),
            context = photo.getContext('2d');

        photo.width = display.width;
        photo.height = display.height;

        context.drawImage(display, 0, 0, photo.width, photo.height);
    }

    function onSuccess(stream){

        var photoButton = document.getElementById('takePhoto');
        photoButton.addEventListener('click', takePhoto, false);

        //1. Setup video
        if(getVideo){
            video = document.getElementById('webcam');
            var videoSource;

            if (window.webkitURL) {
                videoSource = window.webkitURL.createObjectURL(stream);
            } else {
                videoSource = stream;
            }

            video.autoplay = true;
            video.src = videoSource;

            streamFeed();
        }

        //2. Setup audio
        if(getAudio){
            var audioContext, mediaStreamSource;

            window.audioContext || (window.audioContext = window.webkitAudioContext);

            if (window.audioContext) {
                audioContext = new window.audioContext();
                mediaStreamSource = audioContext.createMediaStreamSource(stream);

                mediaStreamSource.connect(audioContext.destination);
            }
        }
    }

    function onError(){
        alert("Error");
    }

    var requestStreams = function requestStreams() {
        navigator.getUserMedia || (navigator.getUserMedia = navigator.mozGetUserMedia || navigator.webkitGetUserMedia || navigator.msGetUserMedia);

        if (navigator.getUserMedia) {
            navigator.getUserMedia({
                video: getVideo,
                audio: getAudio
            }, onSuccess, onError);
        } else {
            alert('getUserMedia is not supported in this browser.');
        }
    };

    var addEffects = {
        red: function addEffects(data) {
            for (var i = 0, l = data.length; i < l; i += 4) {
                data[i + 1] = 0; // g
                data[i + 2] = 0; // b
            }
            return data;
        },
        invert: function (data) {
            for (var i = 0, l = data.length; i < l; i += 4) {
                data[i] = 255 - data[i]; // r
                data[i + 1] = 255 - data[i + 1]; // g
                data[i + 2] = 255 - data[i + 2]; // b
            }
            return data;
        },
        transparentRed: function (data) {
            for (var i = 0, l = data.length; i < l; i += 4) {
                if (data[i] > 127) {
                    data[i + 3] = 127;
                }
            }
            return data;
        }
    };

    function streamFeed() {
        requestAnimationFrame(streamFeed);
        feedContext.drawImage(video, 0, 0, display.width, display.height);
        var imageData = feedContext.getImageData(0, 0, display.width, display.height);

        //Change effect bellow to addEffects.red or addEffects.transparentRed to see different effects
        imageData.data = addEffects.invert(imageData.data);
        displayContext.putImageData(imageData, 0, 0);
    }

    (function init() {
        getVideo = true;
        getAudio = true;
        requestStreams();
    }());
}());