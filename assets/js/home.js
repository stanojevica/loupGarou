window.onload=function(){
    $.ajax({
        url: "assets/data/ourFirst.json",
        method: "GET",
        dataType: "JSON",
        success : function(data){
            printInfo(data);
        },
        error : function(error, status){
            console.log(status);
        }
    });
};

function printInfo(data){
    var printing = "";
    data.forEach(element => {
        var arrayLinks = [];
        arrayLinks = element.links;
        if(element.isImg){
            printing+=`<div class="d-flex justify-content-between row mb-5 mt-5">
            <div class="col-12 col-md-6 ">
                <h2 class="text-md-left text-center">${element.title}</h2>
                <p class="text-md-left text-center">${element.description}</p>
            <ul>`
            arrayLinks.forEach(link=>{
                printing+=`<li class="text-md-left text-center"><a href="${link.href}" target="blank">${link.title}</a></li>`
            });
            printing+=`</ul></div>
            <div class="col-12 col-md-4">
                <img src="${element.src}" alt="${element.title}" class="img-fluid borderRadus"/>
            </div>
            </div>`
        }
        else{
            printing+=`<div class="d-flex justify-content-between flex-md-row-reverse row">
            <div class="col-12 col-md-6">
                <h2 class="text-md-right text-center">${element.title}</h2>
                <p class="text-md-right text-center">${element.description}</p>
            </div>
            <div class="col-12 col-md-4">
                <iframe class="video borderRadus" src="${element.src}" frameborder="0" allow="autoplay; picture-in-picture" allowfullscreen></iframe>
            </div>
            </div>`
        }
    });

    document.getElementById("info").innerHTML=printing;
}
