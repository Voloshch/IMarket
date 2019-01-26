/*
var div = document.getElementById('div');
var x=document.cookie, string=/token=""/;
found = x.match(string);
if(found){
    div.innerHTML='    <a href="http://localhost:3001/registration" class="nav-item nav-link">Регистрация</a> <a href="http://localhost:3001/authorization" class="nav-item nav-link">Авторизация</a>';
}
else if(!found){
    div.innerHTML='    <form class="form-inline pull-xs-right" name="myForm" action="/" method="post"> <a href="http://localhost:3001/kabinet" class="nav-link" style="color:white">Корзина</a> <button type="submit" id="btn" class="btn btn-sm btn-outline-secondary">Выйти</button> </form>'
}
*/
var btn=document.getElementById("btn");

if(btn) {
    btn.addEventListener('click', function (e) {
        //document.cookie.token="11";
        console.log(document.cookie);
        document.cookie = 'token=""; ';
        console.log(document.cookie);
    });
}
console.log(document.cookie);