window.onload=function(){
    $.ajax({
        url: "assets/data/tim.json",
        method: "GET",
        dataType: "JSON",
        success : function(data){
            ispisTima(data);
        },
        error : function(error, status){
            console.log(status);
        }
    });
};

function ispisTima(data){
    var ispis="";
    var brojac=0;
    data.forEach(element => {
        if(brojac%2==0)
        ispis+=`
        <div class="d-flex justify-content-between row mb-5">
        <div class="col-12 col-md-6 text-center text-md-left">
        `
        else{
            ispis+=`
        <div class="d-flex justify-content-between flex-md-row-reverse row mb-5">
        <div class="col-12 col-md-6 text-center text-md-right">
        `
        }
        ispis+=`
            <h2 class=" mt-5">${element.ime}</h2>
            <p>${element.opis}</p>
            <p><span>Instrument:</span> ${element.instrument}</p>
        </div>
        <div class="col-12 col-md-6">
            <img src="${element.slika}" class="img-fluid" alt="${element.ime}"/>
        </div>
        </div>
        `
        brojac++;
    });
    document.getElementById("tim").innerHTML=ispis;
}