window.onload=function(){
    //dohvatanje podataka iz json fajla zbog cene
    $.ajax({
        url:"assets/data/cenovnik.json",
        method: "GET",
        dataType: "JSON",
        success: function(data){
            ispisCenovnika(data);
            ispisListe(data);
        },
        error: function(xhr, error, status){
            console.log(status);
        }
    })

    $("[name='isto']").click(proveraCheck);

    //dohvatanje elemenate iz forme i dodavanje dogadjaja
    var ime = document.getElementById("ime");
    var imeRez= document.getElementById("imeRez");
    var prezime = document.getElementById("prezime");
    var prezimeRez = document.getElementById("prezimeRez");
    var email = document.getElementById("email");
    var emailRez = document.getElementById("emailRez");
    var poruka = document.getElementById("poruka");
    var datumRezervacije = document.getElementById("date");
    var tipSvirke = document.getElementById("tipSvirkeLista");
    
    ime.addEventListener("keyup",prIme);
    imeRez.addEventListener("keyup",prImeRez);
    prezime.addEventListener("keyup",prPrezime);
    prezimeRez.addEventListener("keyup",prPrezimeRez);
    email.addEventListener("keyup",prEmail);
    emailRez.addEventListener("keyup",prEmailRez);
    poruka.addEventListener("keyup",prPoruka);
    datumRezervacije.addEventListener("change",prDatum);
    tipSvirke.addEventListener("change",prTip);
    document.getElementById("posaljiRez").addEventListener("click", prRezervacija);
    document.getElementById("posaljiKon").addEventListener("click",prKontakt);

    $(".rezervisi").click(function(){
        $(this).parent().parent().hide();
    })

}

//funckija za ispis cenovnika
function ispisCenovnika(data){
    let ispis = "<thead><tr>";
    data.forEach(el => {
        ispis+=`
            <th class="pr-3">${el.naziv}</th>
        `
    });
    ispis+="</tr></thead><tbody><tr>"
    data.forEach(el => {
        ispis+=`
            <td class="pr-3">${el.cena}</td>
        `
    });
    ispis+="</tr></tbody>"
    document.getElementById("cenovnik").innerHTML=ispis;
}

//ispis padajuce liste u meniju jer se cena donamicki unoci
function ispisListe(data){
    let ispis = `<option value="0" class="optTip">Izaberite...</option>`;
    data.forEach(el => {
        ispis+=`
        <option value="${el.id}" class="optTip">${el.naziv}</option>
        `
    })
    document.getElementById("tipSvirkeLista").innerHTML=ispis;
}

//regularni izrazi za proveru podataka u formi
var regExIme = /^[A-Z][a-z]{2,10}$/;
var regExPrezime = /^[A-Z][a-z]{2,10}(\s[A-Z][a-z]{2,10})*$/;
var regExEmail = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/

//provera polja za koje je potreban regEx
function proveraPolja(polje, regex, greska1, greska2, nizGresaka){
    if(polje.value == ""){
        polje.classList.add("is-invalid");
        polje.classList.remove("is-valid");
        polje.nextElementSibling.innerHTML=greska1;
        nizGresaka.push(greska1);
    }
    else{
        if(!regex.test(polje.value)){
            polje.classList.add("is-invalid");
            polje.classList.remove("is-valid");
            polje.nextElementSibling.innerHTML=greska2;
            nizGresaka.push(greska1);
        }
        else{
            polje.classList.remove("is-invalid");
            polje.classList.add("is-valid");
            polje.nextElementSibling.innerHTML="";
        }
    }
};

//funckija za ispis iste poruke za obavezne parametre
function obavezniParametri(parametar){
    return parametar+"je obavezan parametar."
}

//funckija za proveru imena iz forme
function prIme(){
    proveraPolja(ime,regExIme,obavezniParametri('Ime'),"Ime mora imati bar 3 slova i početno mora biti veliko.",[])
};

//funckija za proveru imena iz rezervacije
function prImeRez(){
    proveraPolja(imeRez,regExIme,obavezniParametri('Ime'),"Ime mora imati bar 3 slova i početno mora biti veliko.",[])
};

//funckija za proveru prezimena iz forme
function prPrezime(){
    proveraPolja(prezime,regExPrezime,obavezniParametri('Prezime'),'Prezime mora imati bar 3 slova i početno mora biti veliko.',[])
}

//funckija za proveru prezimena iz rezervacije
function prPrezimeRez(){
    proveraPolja(prezimeRez,regExPrezime,obavezniParametri('Prezime'),'Prezime mora imati bar 3 slova i početno mora biti veliko.',[])
}

//funckija za proveru emaila iz forme
function prEmail(){
    proveraPolja(email,regExEmail,obavezniParametri("Email"), "Email mora biti u ispravnom foratu",[]);
}

//funckija za proveru emaila iz rezervacije
function prEmailRez(){
    proveraPolja(emailRez,regExEmail,obavezniParametri("Email"), "Email mora biti u ispravnom foratu",[]);
}

//funckija za proveru da li uneta poruka
function porukaPr(polje,nizGresakaKontakt){
    var poruka = polje;
    if(poruka.value == ""){
        poruka.classList.add("is-invalid");
        poruka.classList.remove("is-valid");
        poruka.nextElementSibling.innerHTML=obavezniParametri("Poruka");
        nizGresakaKontakt.push(obavezniParametri("Poruka"));
    }
    else{
        poruka.classList.remove("is-invalid");
        poruka.classList.add("is-valid");
        poruka.nextElementSibling.innerHTML="";
    }
}
function prPoruka(){
    var poruka = this;
    porukaPr(poruka,[]);
}

function datumUtimestamp(datum){
    return Date.UTC(datum.getFullYear(),datum.getMonth(),datum.getDate());
}

//funkcija zaproveru datuma
var vrednostDatuma = $("#date").val();
console.log(vrednostDatuma);
function prDatumGlobal(poljeDatum,vrednost,nizGresakaNaKlik){
    var datum = poljeDatum;
    var izabraniDatum = poljeDatum.value;

    if(izabraniDatum == vrednostDatuma){
        date.classList.add("is-invalid");
        date.classList.remove("is-valid");
        date.nextElementSibling.innerHTML="Datum je obavezan parametar";
        return;
    }

    izabraniDatum = new Date(izabraniDatum);
    var danasnjiDatum = new Date();
    izabraniDatum = datumUtimestamp(izabraniDatum);
    danasnjiDatum = datumUtimestamp(danasnjiDatum);

    var rezervisaniDatumi = [];
    var validnost = true;
    if(localStorage.getItem("rezervacijeMoj")){
        var datumiSacuvni = JSON.parse(localStorage.getItem("rezervacijeMoj"));
        for(let datumRez of datumiSacuvni){
            if(datumRez.datum == izabraniDatum){
                validnost = false;
            }
            else{
                validnost = true;
            }
        }
    };

    if(validnost){
        if(izabraniDatum <= danasnjiDatum){
            date.classList.add("is-invalid");
            date.classList.remove("is-valid");
            date.nextElementSibling.innerHTML="Ne možete izabrati datum koji je prošao.";
        }
        else{
            $.ajax({
                url:"assets/data/performs.json",
                method:"GET",
                dataType:"JSON",
                success: function(data){
                    data.forEach(element => {
                        element.datum = new Date(element.datum)
                        rezervisaniDatumi.push(datumUtimestamp(element.datum));
                        for(let i=0; i<rezervisaniDatumi.length; i++){
                            if(rezervisaniDatumi[i] == izabraniDatum){
                                date.classList.add("is-invalid");
                                date.classList.remove("is-valid");
                                date.nextElementSibling.innerHTML="Datum je rezervisan";
                                break;
                            }
                            else{
                                date.classList.remove("is-invalid");
                                date.classList.add("is-valid");
                                date.nextElementSibling.innerHTML="";
                                vrednost.datum = izabraniDatum;
                            }
                        }
                    });
                },
                error: function(error, status){
                    console.log(status);
                }
            });        
        }
    }
    else{
        date.classList.add("is-invalid");
        date.classList.remove("is-valid");
        date.nextElementSibling.innerHTML="Datum ste vec rezervisali";
        nizGresakaNaKlik.push("Datum je vec rezervisan");
    }  
}

function prDatum(){
    var datum = this;
    prDatumGlobal(datum,{},[]);
}
//funkcija za proveru tipa svirke 
function tip(izabraniTip){
    if(izabraniTip.value == 0){
        izabraniTip.classList.add("is-invalid");
        izabraniTip.classList.remove("is-valid");
        izabraniTip.nextElementSibling.innerHTML="Morate izabrati tip svirke";
    }
    else{
        izabraniTip.classList.remove("is-invalid");
        izabraniTip.classList.add("is-valid");
    }
}

function prTip(){
    var izabraniTip = this;
    tip(izabraniTip);
}

//funcija za biranje forme za kontakt ili rezervaciju
function proveraCheck(){
    console.log(this.value);
    if(this.value == "rezervacija"){
        document.getElementById("formRezervacija").classList.remove("info-toggle");
        document.getElementById("formKontakt").classList.add("info-toggle");
    }
    else{
        document.getElementById("formRezervacija").classList.add("info-toggle");
        document.getElementById("formKontakt").classList.remove("info-toggle");
    }
}

function prRezervacija(){
    var nizGresakaNaKlik = [];
    var nizVrednosti = [];
    var vrednost = {};

    //pozivanje funkcija za proveru podataka za ime, prezime i email ponovo
    proveraPolja(imeRez,regExIme,obavezniParametri("Ime"), "Ime mora imati minimum 3 slova i prvo mora biti pocetno",nizGresakaNaKlik);
    proveraPolja(prezimeRez,regExPrezime,obavezniParametri("Przime"), "Prezime mora imati minimum 3 slova i prvo mora biti pocetno",nizGresakaNaKlik);
    proveraPolja(emailRez,regExEmail,obavezniParametri("Email."), "Email mora biti u ispravnom formatu",nizGresakaNaKlik);


    //pozivanje funkcije za proveru datuma ponovo
    var datum = document.getElementById("date");
    console.log(datum.value)
    prDatumGlobal(datum,vrednost,nizGresakaNaKlik);

    
    //pozivanje funkcije za proveru liste ponovo
    var izabraniTIp = document.getElementById("tipSvirkeLista");
    tip(izabraniTIp);

    //provera da li su podaci dobro uneti
    if(nizGresakaNaKlik.length>0){
        $("#popUp").show();
        $("#porukaPopUp").html("Niste dobro uneli podatke.");
    }
    else{
        $.ajax({
        url:"assets/data/cenovnik.json",
        method:"GET",
        dataType:"JSON",
        success: function(data){
        const cena = data.filter(f=>{
            if(f.id==izabraniTIp.value){
                return true;
            }
        })
        vrednost.cena=cena[0].cena;
        vrednost.naziv=cena[0].naziv;
        var rezervacije = JSON.parse(localStorage.getItem("rezervacijeMoj"));

        if(rezervacije){
            dodajRezervaciju();
        }else{
            dodajPrvuRezervaciju();
        }
        function dodajRezervaciju() {
            let rezervacije = JSON.parse(localStorage.getItem("rezervacijeMoj"));
            var id = rezervacije.length+1;
            rezervacije.push({
                id: id,
                naziv : vrednost.naziv,
                datum : vrednost.datum,
                cena : vrednost.cena
            });
            localStorage.setItem("rezervacijeMoj", JSON.stringify(rezervacije));
            $(".informacija").show();
            $("#popUp").show();
            $("#porukaPopUp").html("Uspešno ste rezervisali svirku.");
        }
        function dodajPrvuRezervaciju(){
            let rezervacije = [];
            rezervacije[0]={
                id : 1,
                naziv : vrednost.naziv,
                datum : vrednost.datum,
                cena : vrednost.cena
            }
            localStorage.setItem("rezervacijeMoj", JSON.stringify(rezervacije));
            $(".informacija").show();
            $("#popUp").show();
            $("#porukaPopUp").html("Uspešno ste rezervisali svirku.");
        }
        },
        error: function(xhr, error, status){
            console.log(status);
        }
    })
    }
}

//provera da li su podaci u formi za kontakt u ispravnom formatu
function prKontakt(){
    var nizGresakaKontakt = [];

    proveraPolja(ime,regExIme,obavezniParametri("Ime"), "Ime mora imati minimum 3 slova i mora porinjati prvim velikim",nizGresakaKontakt);
    proveraPolja(prezime,regExPrezime,obavezniParametri("Prezime"), "Prezime mora imati minimum 3 slova i mora porinjati prvim velikim",nizGresakaKontakt);
    proveraPolja(email,regExEmail,obavezniParametri("Email"), "Email mora biti u ispravnom formatu",nizGresakaKontakt);

    var poruka=document.getElementById("poruka");;
    porukaPr(poruka,nizGresakaKontakt);
    
    if(nizGresakaKontakt.length>0){
        $("#popUp").show();
        $("#porukaPopUp").html("Niste dobro uneli podatke.");
    }
    else{
        $("#popUp").show();
        $("#porukaPopUp").html("Poruka je poslata, očekujte odgovor na Vaš mail u roku od 2 dana.");
    }
}
