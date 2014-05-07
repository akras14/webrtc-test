navigator.getUserMedia || (navigator.getUserMedia = navigator.mozGetUserMedia || navigator.webkitGetUserMedia || navigator.msGetUserMedia);

if (navigator.getUserMedia) {

    var onSuccess = function onSuccess(stream){
        var video = document.getElementById('webcam');
        var videoSource;

        if (window.webkitURL) {
            videoSource = window.webkitURL.createObjectURL(stream);
        } else {
            videoSource = stream;
        }

        video.autoplay = true;
        video.src = videoSource;
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