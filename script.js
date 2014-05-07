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

    var takePhoto = function takePhoto() {
        var photo = document.getElementById('photo'),
            context = photo.getContext('2d');

        photo.width = display.width;
        photo.height = display.height;

        context.drawImage(video, 0, 0, photo.width, photo.height);
    };

    var onSuccess = function onSuccess(stream){

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
    };

    var onError = function onError(){
        alert("Error");
    };

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

    function streamFeed() {
        requestAnimationFrame(streamFeed);
        feedContext.drawImage(video, 0, 0, display.width, display.height);
        var imageData = feedContext.getImageData(0, 0, display.width, display.height);
        displayContext.putImageData(imageData, 0, 0);
    }

    (function init() {
        getVideo = true;
        getAudio = true;
        requestStreams();
    }());
}());