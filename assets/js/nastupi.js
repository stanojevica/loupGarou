window.onload=function(){
    //pozivanje funckije za ispis radio buttona za fultriranje po datumu
    ispisRadio();

    //pozivanje funckije za proveru zadrzaja u polju za pretragu
    $("#pretraga").keyup(pretraga);

    //pozivanje funckije za sortiranje po datumu
    $("#sortDatum").change(sortDatum);

    //setovanje vrednosti u localstorage
    localStorage.setItem("filtrirano",JSON.stringify([]));

    ajaxNastupi(function(data){
        ispisNastupa(data);
        ispisLokala(data);
        ispisTipa(data);
    })

}

function ajaxNastupi(povratnaFunkcija){
    $.ajax({
        url:"assets/data/performs.json",
        method: "GET",
        dataType: "JSON",
        success: povratnaFunkcija,
        error: function(error, status){
            console.log(status);
        }
    })
}

//ispis svih nastupa
function ispisNastupa(data){
    var ispis="";
    var danasnjiDatum = new Date();
    danasnjiDatum = Date.UTC(danasnjiDatum.getFullYear(),danasnjiDatum.getMonth(),danasnjiDatum.getDate());
    data.forEach(element => {
        var dobijeniDatum = new Date(element.datum);
        var mesec = dobijeniDatum.getMonth()+1;
        var datum = dobijeniDatum.getDate()+"/"+mesec+"/"+dobijeniDatum.getFullYear();
        dobijeniDatum = Date.UTC(dobijeniDatum.getFullYear(), dobijeniDatum.getMonth(), dobijeniDatum.getDate());
        ispis+=`
        <div class="d-flex justify-content-between row contentSadrzaj mb-5">
            <div class="col-sm-6 col-12 text-sm-left text-center">  
                <h2>${element.nazivLokala}</h2>
                <p><i class="fas fa-map-marker-alt"></i> ${element.lokacija}</p>
                <h3>${element.naslov}</h3>
                <p><i class="fas fa-calendar-alt"></i> ${datum}</p>
                <input type="button" class="btn-toggle" value="više informacija"/>
                <div class="info-toggle">
                    <h2>O lokalu</h2>
                    <p>${element.dodatno.opis}</p>
                    <h3>Korisni link i kontakt</h3>
                    <a class="black" href="${element.dodatno.link}">${element.nazivLokala}</a>
                    <p>${element.dodatno.kontakt}
                </div>`
                if(dobijeniDatum >= danasnjiDatum){
                    ispis+=`
                    <div>
                    <div class="izabratiBroj">
                        <div class="textBroj mt-3">
                            <p>Izaberite broj osoba:</p>
                            <input type="number" class="form-control izBroj mb-2 mx-auto" data-idRez="${element.id}" required/>
                            <p class="invalid-feedback"></p>
                            <input type="button" value="rezervisi" class="rezervisi p-1"/>
                        </div>
                    </div>
                        <input type="button" class="prestojeciDogadjaj" value="Rezervisi"/>
                    </div>`
                }
            ispis+=`</div>
            <div class="col-sm-4 col-10 text-sm-left text-center m-4 mx-auto">`
            if(element.slika.nastup != "assets/img/clubMladost.jpg"){
                ispis+=`<img src="${element.slika.nastup}" alt="${element.nazivLokala}" class="img-fluid slikeLokala"/>`
            }
            else{
                ispis+=`<img src="${element.slika.nastup}" alt="${element.nazivLokala}" class="img-fluid"/>`
            } 
            ispis+=`</div>
        </div>
        `
    });
    document.getElementById("contentNastup").innerHTML=ispis;
    $(".btn-toggle").click(infoToggle);
    $(".prestojeciDogadjaj").click(sacuvajRezervaciju);
    $(".rezervisi").click(dodajRezervaciju);
}

//ispis radio button-a
function ispisRadio(){
    var danasnjiDatum = new Date();
    danasnjiDatum = Date.UTC(danasnjiDatum.getFullYear(),danasnjiDatum.getMonth(),danasnjiDatum.getDate());
    var datumProsli = new Date();
    datumProsli = Date.UTC(datumProsli.getFullYear(),datumProsli.getMonth(),datumProsli.getDate()-1);
    var ispis=`
    <input type="radio" name="nastupi" class="nastupi" value="${datumProsli}"/> Prethodni nastupi
    <input type="radio" name="nastupi" class="nastupi" value="${danasnjiDatum}"/> Sledeci nastupi
    `

    document.getElementById("nastupiRadio").innerHTML=ispis;
    $(".nastupi").change(filterNastup);
}

//ispis sheckboxova za lokale
function ispisLokala(data){
    var ispis = "";
    var nizLokala = [];

    data.forEach(element =>{
        if(!nizLokala.includes(element.nazivLokala)){
            nizLokala.push(element.nazivLokala);
        }
    })
    nizLokala.forEach(element => {
        ispis+=`<p><input type="checkbox" name="lokali" class="lokaliFilter" value="${element}"/>${element}</p>`
    })
    document.getElementById("lokali").innerHTML=ispis;
    $(".lokaliFilter").change(filterLokala);
}

//ispis checkboxova za tip svirke
function ispisTipa(data){
    var ispis = "";
    var nizTipva = [];
    data.forEach(element =>{
        if(!nizTipva.includes(element.tip)){
            nizTipva.push(element.tip);
        }
    })
    nizTipva.forEach(element => {
        ispis+=`<p><input type="checkbox" name="tip" class="tipFilter" value="${element}"/>${element}</p>`
    })
    document.getElementById("tipSvirke").innerHTML=ispis;
    $(".tipFilter").change(filterTipova);
}

//funkcija da se prikaze inicijalno sakriven text
function infoToggle(){
    if($(this).val() == "više informacija"){
        $(this).val("skloni informacije");
    }
    else{
        $(this).val("više informacija");
    }
    $(this).next().slideToggle();
    
}

//funkcija za pretvaranje datuma u timesptamp
function datumToUTC(datum){
    return Date.UTC(datum.getFullYear(),datum.getMonth(),datum.getDate())
}

//funkcija za pretragu po nazivu lokala
function pretraga(){
    var uneto = this.value.toLowerCase();
    $.ajax({
        url:"assets/data/performs.json",
        method: "GET",
        dataType: "JSON",
        success: function(data){
            const pretrazeno = data.filter(function (p){
                if(p.nazivLokala.toLowerCase().indexOf(uneto) !=-1 || p.naslov.toLowerCase().indexOf(uneto) !=-1 ){
                    return true;
                }
            })
            ispisNastupa(pretrazeno);
        },
        error: function(error, status){
            console.log(status);
        }
    })
    $(".tipFilter").prop('checked', false);
    $(".lokaliFilter").prop('checked', false);
    $(".nastupi").prop('checked', false);
}

function sortDatum(){
    var izabrano = this.value;
    var filtrirano = JSON.parse(localStorage.getItem("filtrirano"));
    if(filtrirano.length != []){
        sortPoDatumu(izabrano,filtrirano);
    }
    else{
        ajaxNastupi(function(data){
            sortPoDatumu(izabrano,data);
        })
    }
}

//sortiranje po datumu
function sortPoDatumu(izabrano,filtriraj){
    if(izabrano == 1){
        filtriraj.sort(function(a,b){
            let datum1 = new Date(a.datum);
            let datum2 = new Date(b.datum);
            return datumToUTC(datum1) - datumToUTC(datum2);
        });
    }
    else if(izabrano == 2){
        filtriraj.sort(function(a,b){
            let datum1 = new Date(a.datum);
            let datum2 = new Date(b.datum);
            return datumToUTC(datum2) - datumToUTC(datum1);
        });
    }
    ispisNastupa(filtriraj);
}


function nemaNastupa(){
    ispis=`
    <div id="nemaNastupa" class="col-12 text-center">
        <h2> Žao nam je, ali trenutno nema takvih nastupa </h2>
    </div>
    `
    document.getElementById("contentNastup").innerHTML=ispis;
}

var filtriraniNastupi = [];
//funkcija za filtriranje nastupa u odnosu na datum
function filterNastup(){
    var izabrano = this.value;
    var danasnjiDatum = new Date();
    danasnjiDatum = datumToUTC(danasnjiDatum);
    var datumProsli = new Date();
    datumProsli = Date.UTC(datumProsli.getFullYear(),datumProsli.getMonth(),datumProsli.getDate()-1);


    function sacuvajFiltriraneNastupe(data){
        if(izabrano == danasnjiDatum){
            const filtriraniNastupiBuducnost = data.filter( function (f) {
                f.datum = new Date(f.datum);
                f.datum = datumToUTC(f.datum)
                if(f.datum >= izabrano){
                    return true
                }
            })
            filtriraniNastupi = filtriraniNastupiBuducnost;
        }
        else{
            var filtriraniNastupiProslost = data.filter( f => {
                f.datum = new Date(f.datum);
                f.datum = datumToUTC(f.datum)
                if(f.datum < izabrano){
                    return true
                }
            })
            filtriraniNastupi = filtriraniNastupiProslost;
        }
    }
    //funckije za filter po nastupima
    function filtrirajNastupBuducnost(filtriraj){
        const filtriraniNastupiBuducnost = filtriraj.filter( function (f) {
            f.datum = new Date(f.datum);
            f.datum = datumToUTC(f.datum)
            if(f.datum >= izabrano){
                return true
            }
        })
        if(filtriraniNastupiBuducnost.length == 0){
            nemaNastupa();
        }
        else{
            ispisNastupa(filtriraniNastupiBuducnost);
        }
        localStorage.setItem("filtrirano",JSON.stringify(filtriraniNastupiBuducnost));
    }
    function filtrirajNastupProslost(filtriraj){
        var filtriraniNastupiProslost = filtriraj.filter( f => {
            f.datum = new Date(f.datum);
            f.datum = datumToUTC(f.datum)
            if(f.datum < izabrano){
                return true
            }
        })
        if(filtriraniNastupiProslost.length == 0){
            nemaNastupa();
        }
        else{
            ispisNastupa(filtriraniNastupiProslost);
        }
        
        localStorage.setItem("filtrirano",JSON.stringify(filtriraniNastupiProslost))

        // console.log(filtriraniNastupiProslost);
    }
    function filterNastupaKonacan(data){
        if(izabrano == danasnjiDatum){
            filtrirajNastupBuducnost(data);
        }
        else{
            filtrirajNastupProslost(data);
        }
    }
    //proverava se sta je filtirano pre 
    if(filtriraniTipovi.length == 0 && filtrianiLokali.length == 0){
        ajaxNastupi(function(data){
            filterNastupaKonacan(data);
        });
        ajaxNastupi(function(data){
            sacuvajFiltriraneNastupe(data);
        });
    }
    else if(filtriraniTipovi.length != 0 && filtrianiLokali.length == 0){
        filterNastupaKonacan(filtriraniTipovi);
        ajaxNastupi(function(data){
            sacuvajFiltriraneNastupe(data);
        });
    }
    else if(filtriraniTipovi.length == 0 && filtrianiLokali.length != 0){
        filterNastupaKonacan(filtrianiLokali)
        ajaxNastupi(function(data){
            sacuvajFiltriraneNastupe(data);
        });
    }
    else{
        const filtrirano = filtrianiLokali.filter(f=>{
            for(let filter of filtriraniTipovi){
                if(f.id == filter.id){
                    return true;
                }
            }
        })
        filterNastupaKonacan(filtrirano);
        ajaxNastupi(function(data){
            sacuvajFiltriraneNastupe(data);
        });
    }    
}
//funkcija za filter po lokalima
var izabraniLokali = [];
var filtrianiLokali = [];
function filterLokala(){
    var izabrano = this.value;
    if(!izabraniLokali.includes(izabrano)){
        izabraniLokali.push(izabrano);
    }
    else{
        const noviNiz = izabraniLokali.filter(odcekirano => {
            if(izabrano != odcekirano){
                return true;
            }
        })
        izabraniLokali = noviNiz
    }

    function sacuvajFiltriraneLokale(data){
        if(izabraniLokali.length!=0){
            const filtrirano = data.filter(f=>{
                for(let i of izabraniLokali){
                    if(f.nazivLokala == i){
                        return true;
                    }
                }
            })
            filtrianiLokali= filtrirano;
        }
        else{
            filtrianiLokali=[];
        } 
    }
    function filtrirajLokale(lokali){
        if(izabraniLokali.length!=0){
            const filtrirano = lokali.filter(f=>{
                for(let i of izabraniLokali){
                    if(f.nazivLokala == i){
                        return true;
                    }
                }
            })
            if(filtrirano.length == 0){
                nemaNastupa()
            }
            else{
                ispisNastupa(filtrirano);
            }
            
            localStorage.setItem("filtrirano",JSON.stringify(filtrirano))
        }
        else{
            ispisNastupa(lokali)
            localStorage.setItem("filtrirano",JSON.stringify(lokali))
        }
    }
    if(filtriraniTipovi.length == 0 && filtriraniNastupi.length == 0){
        ajaxNastupi(function(data){
            filtrirajLokale(data);
        })
        ajaxNastupi(function(data){
            sacuvajFiltriraneLokale(data);
        })
    }
    else if(filtriraniTipovi.length != 0 && filtriraniNastupi.length == 0){
        filtrirajLokale(filtriraniTipovi);
        ajaxNastupi(function(data){
            sacuvajFiltriraneLokale(data);
        })
    }
    else if(filtriraniTipovi.length == 0 && filtriraniNastupi.length != 0){
        filtrirajLokale(filtriraniNastupi);
        ajaxNastupi(function(data){
            sacuvajFiltriraneLokale(data);
        })
    }
    else{
        const filtrirano = filtriraniNastupi.filter(f=>{
            for(let filter of filtriraniTipovi){
                if(f.id == filter.id){
                    return true;
                }
            }
        })
        filtrirajLokale(filtrirano);
        ajaxNastupi(function(data){
            sacuvajFiltriraneLokale(data);
        })
    }

    
}

//funkcija za filter po tipu svirke
var izabraniTipovi = [];
var filtriraniTipovi = [];
function filterTipova(){
    var izabrano = this.value;
    if(!izabraniTipovi.includes(izabrano)){
        izabraniTipovi.push(izabrano);
    }
    else{
        const noviNiz = izabraniTipovi.filter(odcekirano => {
            if(izabrano != odcekirano){
                return true;
            }
        })
        izabraniTipovi = noviNiz
    }
    function sacuvajFiltriraneTipove(data){
        if(izabraniTipovi.length!=0){
            const filtrirano = data.filter(f=>{
                for(let i of izabraniTipovi){
                    if(f.tip == i){
                        return true;
                    }
                }
            })
            filtriraniTipovi= filtrirano;
        }
        else{
            filtriraniTipovi=[];
        }
    }
    
    function filtrirajTipove(tipovi){
        if(izabraniTipovi.length!=0){
            const filtrirano = tipovi.filter(f=>{
                for(let i of izabraniTipovi){
                    if(f.tip == i){
                        return true;
                    }
                }
            })
            if(filtrirano.length == 0){
                nemaNastupa();
            }
            else{
                ispisNastupa(filtrirano);
            }
            localStorage.setItem("filtrirano",JSON.stringify(filtrirano))
        }
        else{
            ispisNastupa(tipovi)
            localStorage.setItem("filtrirano",JSON.stringify(tipovi));
        }
    }
    if(filtrianiLokali.length == 0 && filtriraniNastupi.length == 0){
        ajaxNastupi(function(data){
            filtrirajTipove(data);
        })
        ajaxNastupi(function(data){
            sacuvajFiltriraneTipove(data);
        })
    }
    else if(filtrianiLokali.length != 0 && filtriraniNastupi.length == 0){
        filtrirajTipove(filtrianiLokali);
        ajaxNastupi(function(data){
            sacuvajFiltriraneTipove(data);
        })
    }
    else if(filtrianiLokali.length == 0 && filtriraniNastupi.length != 0){
        filtrirajTipove(filtriraniNastupi);
        ajaxNastupi(function(data){
            sacuvajFiltriraneTipove(data);
        })
    }
    else{
        const filtrirano = filtriraniNastupi.filter(f=>{
            for(let filter of filtrianiLokali){
                if(f.id == filter.id){
                    return true;
                }
            }
        })
        filtrirajTipove(filtrirano);
        ajaxNastupi(function(data){
            sacuvajFiltriraneTipove(data);
        })
    }
}

//funkcija za prikazivanje pop-up prozora za izbor broja osoba
function sacuvajRezervaciju(){
    $(this).prev().show();
    console.log(this);
    console.log($(this).prev());
}

//funkcija za sklanjanje pop-up prozora ako se klikne van njega
$(document).click(function(event) {
    if (!$(event.target).closest(".izabratiBroj,.prestojeciDogadjaj").length) {
      $("body").find(".izabratiBroj").fadeOut(300);
    }
});

//funkcija za dodavanje rezervacija
function dodajRezervaciju(){
    var izabraniTag= $(this).prev().prev();
    var izabraniId = $(this).prev().prev().data("idrez");
    console.log(izabraniId)
    var izabraniBroj = $(this).prev().prev().val();
    console.log(izabraniTag)
    if(izabraniBroj == ""){
        izabraniTag.addClass("is-invalid");
        izabraniTag.removeClass("is-valid");
        izabraniTag.next().text("Morate izabrati neki broj.");
    }
    else if(izabraniBroj <= 0){
        izabraniTag.addClass("is-invalid");
        izabraniTag.removeClass("is-valid");
        izabraniTag.next().text("Ne mozete izabrati vrednost ispod 1.");
    }
    else{
        izabraniTag.removeClass("is-invalid");
        izabraniTag.addClass("is-valid");
    
        var rezervacije = JSON.parse(localStorage.getItem("rezervacije"));

        if(rezervacije) {
            if(imaRezervacija()) {
                alert("Rezervisali ste vec")
            } else {
                dodajRezervaciju();
            }
        }else{
            dodajPrvuRezervaciju();
        }
        function imaRezervacija() {
            return rezervacije.filter(r => r.id == izabraniId).length;
        }

        function dodajRezervaciju() {
            let rezervacije = JSON.parse(localStorage.getItem("rezervacije"));
            rezervacije.push({
                id : izabraniId,
                brojOsoba : izabraniBroj
            });
            localStorage.setItem("rezervacije", JSON.stringify(rezervacije));
            $(".informacija").show();
        }

        function dodajPrvuRezervaciju(){
            let rezervacije = [];
            rezervacije[0]={
                id : izabraniId,
                brojOsoba : izabraniBroj
            }
            localStorage.setItem("rezervacije", JSON.stringify(rezervacije));
            alert("Uspesno dodata prva");
            $(".informacija").show();
        }
        izabraniTag.parent().parent().hide();
    }
    console.log(izabraniBroj);
}