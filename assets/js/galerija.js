window.onload=function(){ 
    ispisGalerije()

    $(".otvori").click(function(){
        $(this).next().show();
    })

    $(".zatvori").click(function(){
        $(this).parent().hide();
    })  
}

function ispisGalerije(){
    var ispis="";
    for(let i = 1;i<=17;i++){
        ispis+=`<a href="#" class="otvori"><img src="assets/img/galerija${i}.jpg" alt="Image Alt Text" class="imgal-img"></a><div class="velikaSlika text-center"><img src="assets/img/galerija${i}.jpg" alt="slikaGalerije" class="img-fluid otvoreneSlike"><a href="#" class="zatvori"><i class="far fa-times-circle"></i></a></div>`
    }
    document.getElementById("galerijaSLike").innerHTML=ispis;
}
