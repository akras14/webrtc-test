navigator.getUserMedia || (navigator.getUserMedia = navigator.mozGetUserMedia || navigator.webkitGetUserMedia || navigator.msGetUserMedia);

if (navigator.getUserMedia) {

    var onSuccess = function onSuccess(stream){
        //1. Setup video
        var video = document.getElementById('webcam');
        var videoSource;

        if (window.webkitURL) {
            videoSource = window.webkitURL.createObjectURL(stream);
        } else {
            videoSource = stream;
        }

        video.autoplay = true;
        video.src = videoSource;

        //2. Setup audio
        var audioContext, mediaStreamSource;

        window.audioContext || (window.audioContext = window.webkitAudioContext);

        if (window.audioContext) {
            audioContext = new window.audioContext();
            mediaStreamSource = audioContext.createMediaStreamSource(stream);

            mediaStreamSource.connect(audioContext.destination);
        }
    };

    var onError = function onError(){
        alert("Error");
    };

    // do something
    navigator.getUserMedia({
        video: true,
        audio: true
    }, onSuccess, onError);

} else {
    alert('getUserMedia is not supported in this browser.');
}