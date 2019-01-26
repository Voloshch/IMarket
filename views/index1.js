var btn=document.getElementById("btn");

if(btn) {
    btn.addEventListener('click', function (e) {
        //document.cookie.token="11";
        console.log(document.cookie);
        document.cookie = 'token=""; ';
        console.log(document.cookie);
    });
}