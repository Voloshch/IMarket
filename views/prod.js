var btn=document.getElementById('update');

btn.addEventListener('click',function(){
    $.ajax({
        url: "/updateprod",
        success: function(data){
            console.log(data);
        }
    });

})/**
 * Created by home-pc on 02.01.2019.
 */
