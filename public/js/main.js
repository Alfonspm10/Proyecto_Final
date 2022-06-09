const socket = io();

socket.on('message', message => {
    console.log(message);
});


window.onload = function () {

    var erasebutton = document.getElementById("erase-task");

    erasebutton.onclick = function () {
        localStorage.clear()
        location.reload();
    }

}
