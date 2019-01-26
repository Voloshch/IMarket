var btn=document.getElementById('btn'),div=document.getElementById('div'),btnn=document.getElementById('btnn');
var ctx=document.getElementById('myChart').getContext('2d');
function getRandom(a, b){
    var r = Math.random();
    return Math.ceil((b-a)*r+a)-1;
}
btn.addEventListener('click',function(){
    $.ajax({
        url: "/testajax",
        success: function(data){
            console.log(data);
            var name=[],kol=[],col=[];
            for(var i=0;i<data.length;i++){
                name.push(data[i].name);
                kol.push(data[i].kol);
            }
            for(var i=0;i<name.length;i++){
                col.push(`rgb(${getRandom(0,255)},${getRandom(0,255)},${getRandom(0,255)})`)
            }
            console.log(col);
            console.log(name);
            console.log(kol);
            var chart=new Chart(ctx,{
                type: 'bar',
                data: {
                    labels: name,
                    datasets: [{
                        label: "Заказы",
                        backgroundColor: col,
                        borderColor:'rgb(0,0,0)',
                        data: kol,
                    }]
                },
                options:{}
            })

           // var dat=JSON.stringify(data);
            //console.log(data);
            //div.innerHTML=dat;
        }
    });

})
btnn.addEventListener('click',function(){
    $.ajax({
        url: "/testajaxx",
        success: function(data){
            console.log(data);
            var name=[],kol=[],col=[];
            for(var i=0;i<data.length;i++){
                name.push(data[i].name);
                kol.push(data[i].kol);
            }
            for(var i=0;i<name.length;i++){
                col.push(`rgb(${getRandom(0,255)},${getRandom(0,255)},${getRandom(0,255)})`)
            }
            console.log(name);
            console.log(kol);
            var chart=new Chart(ctx,{
                type: 'pie',
                data: {
                    labels: name,
                    datasets: [{
                        label: "Доходы",
                        backgroundColor: col,
                        borderColor:'rgb(0,0,0)',
                        data: kol,
                    }]
                },
                options:{}
            })

            // var dat=JSON.stringify(data);
            //console.log(data);
            //div.innerHTML=dat;
        }
    });

})