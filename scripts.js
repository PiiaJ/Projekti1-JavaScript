// lisätään kuuntelija lähetys- ja poistonappeihin, tuotteiden lisäys, poisto ja localstoragen muokkaus
document.getElementById('sendData').addEventListener('click', sendToList);
document.getElementById('sendData').addEventListener('click', storeItems);
document.getElementById('removeData').addEventListener('click', removeFromList);
document.getElementById('removeData').addEventListener('click', storeItems);
document.getElementById('script').addEventListener('load', loadStorage);

// funktio, joka lisää kirjoitetun asian listaan
function sendToList() {
    // luodaan taulukko-muuttuja hakemalla se id:n mukaan 
    var taulukko = document.getElementById('listaus');

    // lisätään taulukkoon uusi rivi viimeiseksi
    var rivi = taulukko.insertRow(-1);

    // lisätään riville 2 uutta solua
    var solu = rivi.insertCell(0);
    var solu2 = rivi.insertCell(1);

    // haetaan lisäys-kenttä ja siihen syötetty arvo muuttujiin
    var ruutu = document.getElementById('addThis');
    var lisatty = ruutu.value;

    // tarkistetaan, onko arvoa syötetty ja onko se riittävän pitkä
    if (lisatty == "") {
        ruutu.style = "border: 3px solid red";
        alert("Listalle lisättävä puuttuu.");
    }
    else if (lisatty.length < 3) {
        ruutu.style = "border: 3px solid red";
        alert("Yrität lisätä liian lyhyttä sanaa.")
    }
    else {
    // lisätään soluihin arvot ja kuuntelija. Taulukkoon ja syöttöruutuun reunat normaaleiksi
        solu.innerHTML = '<input type = "checkbox" onchange = "didIt(this.id)" name = "box" id = "box" visibility = "visible"/>';
        solu2.innerHTML = lisatty;
        ruutu.style = 'border: 1px solid black';
        taulukko.style = 'border: 3px solid gray';

        // nimetään solun id uudelleen käyttäen hyväksi listan pituutta
        // vähennetään listan pituudesta yksi, jolloin id on sama kuin uuden sisällön indeksi
        var pituus = document.getElementById('listaus').rows.length;
        document.getElementById('box').id = pituus -1;
        // tyhjennetään syöttökenttä
        document.getElementById('addThis').value = '';
        // lisätään käyttäjälle ohjeistus
        document.getElementById('ohje').innerHTML = '<i>Ruksi merkitsee muistettavan hoidetuksi.</i>'
    }
    countListItems();
}

// funktio laskee montako asiaa listalla
function countListItems() {
    var taulukko = document.getElementById('listaus');
    var rivit = taulukko.getElementsByTagName('tr');

    // asetetaan muuttujat tehtävämäärille
    var tehtaviaYht = 0;
    var tekematta = 0;
    var tehdyt = 0;

    // käydään taulukko riveittäin läpi ja tarkistetaan, millä monellako rivillä on kirjattu tehtävä
    for (var i = 0; i < rivit.length; i++) {
        if (rivit[i].lastChild.innerHTML.length > 2) {
            tehtaviaYht++;
        } 
        // jos tehtäviä löytyy, katsotaan, onko checkbox-ruutu näkyvä vai ei ja lisätään sen mukaan tehtäviä oikealle listalle
        if (rivit[i].lastChild.innerHTML.length > 2 && rivit[i].firstChild.style.visibility == "hidden") {
            tehdyt++;
        } 
        if (rivit[i].lastChild.innerHTML.length > 2 && rivit[i].firstChild.style.visibility != "hidden") {
            tekematta++;
        }
    }
    // tulostetaan tehtävämäärät näytölle
    document.getElementById('doneOrNot1').innerHTML = "Listalla yhteensä: " + tehtaviaYht + ", ";
    document.getElementById('doneOrNot2').innerHTML = "tehdyt: " + tehdyt + ", ";
    document.getElementById('doneOrNot3').innerHTML = "jäljellä: " + tekematta;

    // tarkistetaan onko tehtävämäärän näyttämiselle tarvetta, määrät eivät näy, jos listalla ei näy mitään
    if (tehtaviaYht == 0 && tehdyt == 0 && tekematta == 0) {
        document.getElementById('doneOrNot1').style.display = "none";
        document.getElementById('doneOrNot2').style.display = "none";
        document.getElementById('doneOrNot3').style.display = "none";
    } else {
        document.getElementById('doneOrNot1').style.display = "inline";
        document.getElementById('doneOrNot2').style.display = "inline";
        document.getElementById('doneOrNot3').style.display = "inline";
    }
}

// funktio listalta poistamiseen, listan ensimmäinen samanniminen poistuu
function removeFromList() {
    // luetaan syöttöruudun sisältö
    var ruutu = document.getElementById('addThis').value; 

    // luodaan muuttuja taulukon riveille  
    var taulukko = document.getElementById('listaus');
    var rivit = taulukko.getElementsByTagName('tr');

    // luodaan muuttuja taulukon soluille
    var solut = taulukko.getElementsByTagName('td');
    
    // jos syöttökenttään kirjoitettu arvo on lyhyempi kuin 3 merkkiä, annetaan virheilmoitus
    if (ruutu.length < 3) {
        alert("Tämä ei voi olla listalla.");
    } 
    else {

        // käydään läpi rivit ja solut, listalta poistettu asetetaan näkymättömäksi ja sisällöksi laitetaan tyhjä
        for (var i = 0; i < rivit.length; i++) {
            if (rivit[i].lastChild.innerHTML == ruutu) {
                rivit[i].style.display = "none";
                rivit[i].lastChild.innerHTML = "";

                // tyhjennetään syöttökenttä
                document.getElementById('addThis').value = '';
    
        
                // kutsutaan funktiota, joka tarkistaa, onko taulukossa muistettavia asioita
                // jos taulukko on tyhjä, ohje ja taulukon reunat eivät näy
                if (onkoTaulukkoTyhja() == true) {
                    taulukko.style.borderWidth = 0;
                    document.getElementById('ohje').innerHTML = '';
                    for (var i = rivit.length-1; i >= 0; i--) {
                        taulukko.deleteRow(i);
                    }
                } 
            break;
            } 
            // jos haettava ei ole listalla, tulee virheilmoitus   
            else if ((rivit[i].lastChild.innerHTML != ruutu || rivit[i].lastChild.innerHTML != "-" + ruutu + "-") && rivit[i] == rivit[rivit.length-1]) {
                alert("Tämä ei ole listalla.");
            }
        }
    } 
    // päivitetään tehtävämäärät
    countListItems();
}

// funktio tarkistaa onko taulukossa enää muistettavia asioita
function onkoTaulukkoTyhja() {
    var taulukko = document.getElementById('listaus');
    var rivit = taulukko.getElementsByTagName('tr');

// käydään taulukon sisältö läpi riveittäin ja tarkistetaan sisältääkö se sanoja, joissa on vähintään 3 kirjainta
    for (var i = 0; i < rivit.length; i++){
        if (rivit[i].lastChild.innerHTML.length >= 3) {
            return false; // jos sisältää sanoja, palauttaa false
        } 
        // jos löytyy tyhjä ja ollaan viimeisessä indeksissä, palautuu true
        if (rivit[i].lastChild.innerHTML.length < 3 && rivit[i] == rivit[rivit.length-1]) {
            return true; 
        }
    }
}

// funktio, joka muuttaa tehtävän tehdyksi, parametrinä ruksin id
function didIt(boxId) {
    // haetaan tehtävän sisältävä solu taulukosta, oikea solu löytyy riviltä ruksin sisältävän solun id:n avulla
    var taulukko = document.getElementById('listaus');
    var rivi = taulukko.getElementsByTagName('tr')[boxId];
    var solu2 = rivi.getElementsByTagName('td')[1];

    // muokataan tehdyn ulkonäkö viivaamalla se yli ja muuttamalla väri harmaaksi
    solu2.style = "color: gray; text-decoration: line-through";

    // piilotetaan ruksitettu ruutu näkyvistä, ettei hämää käyttäjää
    var solu = rivi.getElementsByTagName('td')[0];
    solu.style.visibility = "hidden";

    // päivitetään tehtävämäärät ja päivitetään localstorage 
    countListItems(); 
    storeItems();

}

// funktio tallentaa listalle kirjatut tiedot localstorageen
function storeItems() {
    if(typeof(Storage) !== "undefined") {
        var taulukko = document.getElementById('listaus');
        var rivit = taulukko.getElementsByTagName('tr');
        // lisätään muistilistan sisältö lista-muotoiseen muuttujaan
        var talteen = [];
        for (i = 0; i < rivit.length; i++) {
        talteen.push(rivit[i].innerHTML);
        }
        localStorage.setItem('listed', JSON.stringify(talteen));        
    } else {
        alert("localStorage-ominaisuus ei ole tuettu tässä selaimessa.")
    }
}

// funktio localstoragen sisällön lataamiseen, mikäli localstoragessa on sisältöä
function loadStorage() {
    if (localStorage.listed && localStorage.getItem('listed') != "[]") {
        var storagesta = JSON.parse(localStorage.getItem('listed'));
            var taulukko = document.getElementById('listaus');
            taulukko.insertRow(-1);
            var rivit = taulukko.getElementsByTagName('tr');
            for (var i = 0; i < storagesta.length; i++) {
                rivit[i].innerHTML = storagesta[i];
                if(storagesta.length > rivit.length) {
                    taulukko.insertRow(-1);
                }
            } countListItems();
            taulukko.style = 'border: 3px solid gray';
            document.getElementById('ohje').innerHTML = '<i>Ruksi merkitsee muistettavan hoidetuksi.</i>';
    }
}