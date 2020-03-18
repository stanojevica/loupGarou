window.onload=function(){
    let rezervacije =JSON.parse(localStorage.getItem("rezervacije"));
    let rezervacijeKontak = JSON.parse(localStorage.getItem("rezervacijeMoj"));

    //provera ima li rezervacija iz nastupa
    if((!rezervacije || rezervacije.length==0) && (!rezervacijeKontak || rezervacijeKontak.length ==0)){
        $("#imaRezervacija").hide();
        $("#nemaRezervacija").show();
    }
    else if((!rezervacije || rezervacije.length==0) && (rezervacijeKontak || rezervacijeKontak.length > 0))
    {
        $("#imaRezervacija").show();
        $("#nemaRezervacija").hide();
        ispisRezervacijaIzForme();
    }
    else if((rezervacije || rezervacije.length>=0) && (!rezervacijeKontak || rezervacijeKontak.length ==0))
    {
        $("#imaRezervacija").show();
        $("#nemaRezervacija").hide();
        dohvatanjeRezervacija();
    }
    else{
        $("#imaRezervacija").show();
        $("#nemaRezervacija").hide();
        ispisRezervacijaIzForme();
        dohvatanjeRezervacija();
    }
};

function dohvatanjeRezervacija(rezervacija){
    let rezervacije = JSON.parse(localStorage.getItem("rezervacije"));
    $.ajax({
        url:"assets/data/performs.json",
        method: "GET",
        dataType: "JSON",
        success: function(data){
            const rezervisno = data.filter(el => {
                for(let lokal of rezervacije){
                    if(el.id == lokal.id){
                        return true;
                    }
                }
                return false;
            })
            for(let i=0; i<rezervacije.length;i++){
                if(rezervisno[i].id == rezervacije[i].id){
                    for(let i=0;i<rezervisno.length;i++){
                        rezervisno[i].brojOsoba=rezervacije[i].brojOsoba;
                    }
                }
            }
            ispisRezervacija(rezervisno);
            console.log(rezervisno);
        },
        error: function(error, status){
            console.log(status);
        }
    })
}

function dobitiDatum(rez){
    rez = new Date(rez)
    var mesec = rez.getMonth()+1;
    var dan = rez.getDate();
    var godina = rez.getFullYear();

    return dan+"/"+mesec+"/"+godina;
}

function ispisRezervacijaIzForme(){
    let rezervacije = JSON.parse(localStorage.getItem("rezervacijeMoj"));
    var ispis="";
    rezervacije.forEach(el=>{
        ispis+=`
        <div class="d-flex justify-content-between rezervisani row mb-4">
            <div class="d-flex col-12 col-md-7"> 
                <div class="row rezervacijeInfo"> 
                    <div class="col-12 col-md-5 text-center text-md-left">
                        <img src="assets/img/logo (3).png" alt="logo" class="img-fluid"/>
                    </div>
                    <div class="text-center text-md-left col-12 col-md-5">
                        <h2>Tip svirke: ${el.naziv}</h2>
                        <p>Ocekujte nezaboravnu atmosferu</p>
                    </div>
                </div>
            </div>
            <div class="col-12 col-md-4 text-center text-md-right">
                <p><i class="fas fa-calendar-alt textBroj"></i> ${dobitiDatum(el.datum)}</p>
                <p>Cena iznosi: ${el.cena} &euro;</br>
                <input type="button" class="otkaziRezervacijuKontakt mt-5" data-otkaziKon="${el.id}" value="otkazi"/>
            </div>
        </div>
        `
    });
    $("#rezKontakt").html(ispis);
    $(".otkaziRezervacijuKontakt").click(izbrsiRezervacijuKontakt);
}

function ispisRezervacija(data){
    var ispis = "" ;
    data.forEach(element => {
        ispis+=`
        <div class="d-flex justify-content-between rezervisani row mb-4">
            <div class="d-flex col-12 col-md-7"> 
                <div class="row rezervacijeInfo"> 
                    <div class="col-12 col-md-5 text-center text-md-left">
                        <img src="${element.slika.rezervacija}" alt="${element.nazivLokala}" class="img-fluid"/>
                    </div>
                    <div class="text-center text-md-left col-12 col-md-5">
                        <h2>${element.nazivLokala}</h2>
                        <p class="black"><i class="fas fa-map-marker-alt"></i> ${element.lokacija}</p>
                        <h4>${element.naslov}</h4>
                    </div>
                </div>
            </div>
            <div class="col-12 col-md-4 text-center text-md-right">
                <p><i class="fas fa-calendar-alt textBroj"></i> ${dobitiDatum(element.datum)}</p>
                <p>Broj osoba: ${element.brojOsoba}</br>
                <input type="button" class="otkaziRezervaciju mt-5" data-otkazi="${element.id}" value="otkazi"/>
            </div>
        </div>
        `
    });
    $("#rez").html(ispis);
    $(".otkaziRezervaciju").click(izbrsiRezervaciju);

}

function otkaziRezervacije(rezervacijaKojaSeOtkazuje,rezervacije,drugerezervacije,funckija){
    var otkazanaRezervacija = rezervacijaKojaSeOtkazuje;
    console.log(otkazanaRezervacija);
    let rezervacije1 =  JSON.parse(localStorage.getItem(rezervacije));
    let rezervacije2 = JSON.parse(localStorage.getItem(drugerezervacije))
    let filtrirano = rezervacije1.filter(r => r.id != otkazanaRezervacija);

    localStorage.setItem(rezervacije, JSON.stringify(filtrirano));

    rezervacije1 =  JSON.parse(localStorage.getItem(rezervacije));

    if((!rezervacije1 || rezervacije1.length==0) && (!rezervacije2 || rezervacije2.length==0)){
        $("#imaRezervacija").hide();
        $("#nemaRezervacija").show();
    }
    else{
        $("#imaRezervacija").show();
        $("#nemaRezervacija").hide();
        funckija();
    }
}

function izbrsiRezervaciju() {
    var otkazi = this.dataset.otkazi;
    otkaziRezervacije(otkazi,"rezervacije","rezervacijeMoj",dohvatanjeRezervacija)
}

function izbrsiRezervacijuKontakt() {
    var otkazi = this.dataset.otkazikon;
    console.log(otkazi);
    otkaziRezervacije(otkazi,"rezervacijeMoj","rezervacije",ispisRezervacijaIzForme);
}