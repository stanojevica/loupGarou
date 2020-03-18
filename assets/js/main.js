
navigation();
$("#otvoriMeni").click(function(){
    $(this).next().next().slideToggle();
});
footer();

function navigation(){
    $.ajax({
        url: "assets/data/meni.json",
        method: "GET",
        dataType: "JSON",
        success: function(data){
            ipsisMenija(data);
        },
        error: function(xhr,statur,error){
            console.log(status);
        }
    })
};

function footer(){
    $.ajax({
        url: "assets/data/socijalneMreze.json",
        method: "GET",
        dataType: "JSON",
        success: function(data){
            ispisFutera(data);
        },
        error: function(xhr,statur,error){
            console.log(status);
        }
    })
};

function ipsisMenija(data){
    var ispis = `<ul class="d-flex justify-content-around">`
    var ispisResponsvive = `<ul class="d-flex flex-column justify-content-around">`

    data.forEach(element => {
        ispis+=`<li><a href="${element.href}">${element.opis}</a></li>`
        ispisResponsvive+=`<li><a href="${element.href}" class="block">${element.opis}</a></li>`
    });

    ispis+=`<li><a href="rezervacija.html"><i class="fas fa-bookmark"></i> <i class="fas fa-exclamation-circle informacija
    "></i></a></li>
    </ul>`
    document.getElementById("nav").innerHTML = ispis;

    ispisResponsvive+="</ul>"
    document.getElementById("responsiveNav").innerHTML = ispisResponsvive;
    
    document.getElementById("ispisiNav").innerHTML= `<a href="rezervacija.html"><i class="fas fa-bookmark"></i> <i class="fas fa-exclamation-circle informacija
    "></i></a>`
}
function ispisFutera(data){
    var ispis = `<div class="row d-flex justify-content-between">
    <div class="col-12 col-md-3">
        <div class="row">
            <div class="col-12 text-md-left text-center">
                <p>Korisni linkovi</p>
            </div>
            <div class="col-12 text-md-left text-center mt-n3">`;
    data.forEach(element=>{
        ispis+=`<a href="${element.href}"  class="boja" target="blank">
        <i class="${element.ikonica}"></i>
        </a>`
    });
    ispis+=`</div>
        </div>
            </div>
            <div class="col-12 col-md-5">
                <div class="row">
                    <div class="col-12 text-center">
                        <p>Loup-Garou | Blues Band <span class="boja" >&copy;</span></p>
                    </div>
                    <div class="col-12 text-center mt-n3">
                        <p>Made with <i class="far fa-heart boja"></i> by <a href="autor.html"> Aleksandra Stanojevic</a></p>
                    </div>
                </div>
            </div>
            <div class="col-12 col-md-3">
                <div class="row">
                    <div class="col-12 text-md-right text-center">
                        <p>Kod sajta</p>
                    </div>
                    <div class="col-12 text-md-right text-center mt-n3">
                        <a href="dokumentacija.pdf" class="boja" ><i class="far fa-file-pdf"></i></a>
                    </div>
                </div>
            </div>
        </div>`
    document.getElementsByTagName("footer")[0].innerHTML=ispis;
}