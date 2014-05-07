(function(){
    var getVideo, getAudio, video;

    var takePhoto = function takePhoto() {
        var photo = document.getElementById('photo'),
            context = photo.getContext('2d');

        photo.width = video.clientWidth;
        photo.height = video.clientHeight;

        context.drawImage(video, 0, 0, photo.width, photo.height);
    };

    var photoButton = document.getElementById('takePhoto');
    photoButton.addEventListener('click', takePhoto, false);

    var onSuccess = function onSuccess(stream){
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

    (function init() {
        getVideo = true;
        getAudio = true;
        requestStreams();
    }());
}());