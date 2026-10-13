var eszkozok = eszkozokBetoltese()
var szerkesztettAzonosito = null
var nezet = "kartya"
var grafikon = null

var tipusok = ["Okosizzó", "Termosztát", "Biztonsági kamera", "Okoskonnektor", "Okoszár", "Mozgásérzékelő", "Okostévé", "Egyéb"]
var ikonok = {
    "Okosizzó": "bi-lightbulb",
    "Termosztát": "bi-thermometer-half",
    "Biztonsági kamera": "bi-camera-video",
    "Okoskonnektor": "bi-plug",
    "Okoszár": "bi-lock",
    "Mozgásérzékelő": "bi-broadcast",
    "Okostévé": "bi-tv",
    "Egyéb": "bi-cpu"
}
var alapHelyisegek = ["Nappali", "Konyha", "Hálószoba", "Fürdőszoba", "Előszoba", "Kert", "Garázs", "Dolgozószoba"]
var szinek = ["#5eead4", "#a5b4fc", "#fcd34d", "#86efac", "#f9a8d4", "#67e8f9", "#c4b5fd", "#fca5a5"]

function osszFogyasztas(lista) {
    var ossz = 0
    for (let i = 0; i < lista.length; i++) {
        if (lista[i].getAktiv()) {
            ossz += lista[i].getFogyasztas()
        }
    }
    return ossz
}

function aktivDarab(lista) {
    var db = 0
    for (let i = 0; i < lista.length; i++) {
        if (lista[i].getAktiv()) {
            db++
        }
    }
    return db
}

function helyisegek(lista) {
    var nevek = []
    for (let i = 0; i < lista.length; i++) {
        if (nevek.indexOf(lista[i].getHelyiseg()) == -1) {
            nevek.push(lista[i].getHelyiseg())
        }
    }
    nevek.sort()
    return nevek
}

function helyisegFogyasztas(lista, helyiseg) {
    var ossz = 0
    for (let i = 0; i < lista.length; i++) {
        if (lista[i].getHelyiseg() == helyiseg && lista[i].getAktiv()) {
            ossz += lista[i].getFogyasztas()
        }
    }
    return ossz
}

function helyisegEszkozei(lista, helyiseg) {
    var talalt = []
    for (let i = 0; i < lista.length; i++) {
        if (lista[i].getHelyiseg() == helyiseg) {
            talalt.push(lista[i])
        }
    }
    return talalt
}

function szurtLista(lista, szoveg, helyiseg, allapot) {
    var szurt = []
    for (let i = 0; i < lista.length; i++) {
        var e = lista[i]
        var joNev = (e.getNev() + " " + e.getTipus() + " " + e.getHelyiseg()).toLowerCase().indexOf(szoveg.toLowerCase()) != -1
        var joHelyiseg = (helyiseg == "osszes" || e.getHelyiseg() == helyiseg)
        var joAllapot = (allapot == "osszes" || (allapot == "be" && e.getAktiv()) || (allapot == "ki" && !e.getAktiv()))
        if (joNev && joHelyiseg && joAllapot) {
            szurt.push(e)
        }
    }
    return szurt
}

function hibaUzenet(nev, fogyasztas, helyiseg) {
    if (nev.trim() == "") {
        return "Az eszköz neve kötelező!"
    }
    if (helyiseg.trim() == "") {
        return "A helyiség megadása kötelező!"
    }
    if (fogyasztas == "" || fogyasztas < 0) {
        return "A fogyasztás 0 vagy annál nagyobb szám legyen!"
    }
    return ""
}

function eszkozKeres(azon) {
    for (let i = 0; i < eszkozok.length; i++) {
        if (eszkozok[i].getAzonosito() == azon) {
            return eszkozok[i]
        }
    }
    return null
}

function hasznalat(tipus, ora) {
    if (tipus == "Okosizzó") {
        if (ora >= 6 && ora < 8) return 0.7
        if (ora >= 17) return 1
        if (ora < 1) return 0.4
        return 0.05
    }
    if (tipus == "Okostévé") {
        if (ora >= 18) return 1
        if (ora >= 12 && ora < 14) return 0.4
        return 0.05
    }
    if (tipus == "Okoskonnektor") {
        if (ora >= 6 && ora < 9) return 1
        if (ora >= 18 && ora < 20) return 0.8
        return 0.1
    }
    if (tipus == "Termosztát") {
        if (ora >= 6 && ora < 9) return 1
        if (ora >= 17 && ora < 23) return 0.9
        return 0.5
    }
    if (tipus == "Biztonsági kamera" || tipus == "Okoszár" || tipus == "Mozgásérzékelő") {
        return 1
    }
    return 0.5
}

function napiAdatok(lista) {
    var cimkek = []
    for (let ora = 0; ora < 24; ora++) {
        cimkek.push((ora < 10 ? "0" + ora : ora) + ":00")
    }
    var nevek = helyisegek(lista)
    var adatok = {}
    for (let i = 0; i < nevek.length; i++) {
        var sor = []
        for (let ora = 0; ora < 24; ora++) {
            var ossz = 0
            for (let j = 0; j < lista.length; j++) {
                if (lista[j].getHelyiseg() == nevek[i]) {
                    ossz += lista[j].getFogyasztas() * hasznalat(lista[j].getTipus(), ora)
                }
            }
            sor.push(Math.round(ossz))
        }
        adatok[nevek[i]] = sor
    }
    return { cimkek: cimkek, helyisegek: adatok }
}

function mentes() {
    var nev = document.querySelector(".nev").value.trim()
    var tipus = document.querySelector(".tipus").value
    var helyiseg = document.querySelector(".helyiseg").value.trim()
    var fogyasztas = document.querySelector(".fogyasztas").value
    var aktiv = document.querySelector("#aktivKapcsolo").checked
    var beIdo = document.querySelector(".beIdo").value
    var kiIdo = document.querySelector(".kiIdo").value

    var hiba = hibaUzenet(nev, fogyasztas, helyiseg)
    if (hiba != "") {
        alert(hiba)
        return
    }

    if (szerkesztettAzonosito == null) {
        eszkozok.push(new Eszkoz(nev, fogyasztas, aktiv, kovetkezoAzonosito(), helyiseg, tipus, beIdo, kiIdo))
        document.querySelector(".uzenet").innerHTML = "Eszköz hozzáadva: " + nev
    } else {
        var e = eszkozKeres(szerkesztettAzonosito)
        e.setNev(nev)
        e.setTipus(tipus)
        e.setHelyiseg(helyiseg)
        e.setFogyasztas(fogyasztas)
        e.setAktiv(aktiv)
        e.setBeIdo(beIdo)
        e.setKiIdo(kiIdo)
        document.querySelector(".uzenet").innerHTML = "Eszköz módosítva: " + nev
    }
    urlapTorles()
    frissit()
    oldalValt("eszkozok")
}

function urlapTorles() {
    szerkesztettAzonosito = null
    document.querySelector(".nev").value = ""
    document.querySelector(".tipus").value = tipusok[0]
    document.querySelector(".helyiseg").value = ""
    document.querySelector(".fogyasztas").value = ""
    document.querySelector("#aktivKapcsolo").checked = false
    document.querySelector(".beIdo").value = ""
    document.querySelector(".kiIdo").value = ""
    document.querySelector(".urlap-cim").innerHTML = "<i class='bi bi-plus-circle'></i> Új eszköz hozzáadása"
    document.querySelector(".mentes-gomb").innerHTML = "Hozzáadás"
    document.querySelector(".megse-gomb").classList.add("d-none")
}

function szerkeszt(azon) {
    var e = eszkozKeres(azon)
    if (e == null) {
        return
    }
    szerkesztettAzonosito = azon
    document.querySelector(".nev").value = e.getNev()
    document.querySelector(".tipus").value = e.getTipus()
    document.querySelector(".helyiseg").value = e.getHelyiseg()
    document.querySelector(".fogyasztas").value = e.getFogyasztas()
    document.querySelector("#aktivKapcsolo").checked = e.getAktiv()
    document.querySelector(".beIdo").value = e.getBeIdo()
    document.querySelector(".kiIdo").value = e.getKiIdo()
    document.querySelector(".urlap-cim").innerHTML = "<i class='bi bi-pencil'></i> Eszköz szerkesztése (" + azon + ")"
    document.querySelector(".mentes-gomb").innerHTML = "Mentés"
    document.querySelector(".megse-gomb").classList.remove("d-none")
    oldalValt("uj")
}

function megse() {
    urlapTorles()
    oldalValt("eszkozok")
}

function torol(azon) {
    var e = eszkozKeres(azon)
    if (!confirm("Biztosan törlöd: " + e.getNev() + "?")) {
        return
    }
    var uj = []
    for (let i = 0; i < eszkozok.length; i++) {
        if (eszkozok[i].getAzonosito() != azon) {
            uj.push(eszkozok[i])
        }
    }
    eszkozok = uj
    document.querySelector(".uzenet").innerHTML = "Eszköz törölve: " + e.getNev()
    frissit()
}

function kapcsol(azon) {
    var e = eszkozKeres(azon)
    e.kapcsol()
    frissit()
}

function nezetValt(uj) {
    nezet = uj
    document.querySelector(".nezet-kartya").classList.toggle("aktiv", uj == "kartya")
    document.querySelector(".nezet-tabla").classList.toggle("aktiv", uj == "tabla")
    szures()
}

function szures() {
    var szoveg = document.querySelector(".kereso").value
    var helyiseg = document.querySelector(".helyiseg-szuro").value
    var allapot = document.querySelector(".allapot-szuro").value
    var szurt = szurtLista(eszkozok, szoveg, helyiseg, allapot)
    document.querySelector(".talalat").innerHTML = szurt.length + " eszköz megjelenítve, szűrt fogyasztás: " + osszFogyasztas(szurt) + " W"
    kiir(szurt)
}

function utemezesSzoveg(e) {
    if (!e.vanUtemezes()) {
        return ""
    }
    return "<span class='cimke'><i class='bi bi-clock-history'></i> " + (e.getBeIdo() || "--:--") + " – " + (e.getKiIdo() || "--:--") + "</span>"
}

function kiir(lista) {
    var tartalom = ""
    if (lista.length == 0) {
        tartalom = "<div class='col-12'><div class='panel text-center p-5'><i class='bi bi-inbox fs-1'></i><p class='mb-0 mt-2'>Nincs a szűrésnek megfelelő eszköz.</p></div></div>"
        document.querySelector(".eszkozok").innerHTML = tartalom
        document.querySelector(".tablazat").classList.add("d-none")
        document.querySelector(".eszkozok").classList.remove("d-none")
        return
    }
    if (nezet == "kartya") {
        for (let i = 0; i < lista.length; i++) {
            var e = lista[i]
            var allapot = e.getAktiv() ? "<span class='allapot be'>BE</span>" : "<span class='allapot ki'>KI</span>"
            tartalom +=
                "<div class='col-md-6 col-xl-4 mb-4'>" +
                "<div class='panel eszkoz-kartya " + (e.getAktiv() ? "bekapcsolt" : "") + "'>" +
                "<div class='d-flex justify-content-between align-items-start'>" +
                "<div class='d-flex gap-3'>" +
                "<span class='ikon'><i class='bi " + ikonok[e.getTipus()] + "'></i></span>" +
                "<div><h5 class='mb-0'>" + e.getNev() + "</h5><small>" + e.getTipus() + " · " + e.getAzonosito() + "</small></div>" +
                "</div>" + allapot +
                "</div>" +
                "<div class='d-flex justify-content-between align-items-center mt-3'>" +
                "<span class='cimke'><i class='bi bi-geo-alt'></i> " + e.getHelyiseg() + "</span>" +
                "<span class='watt'>" + e.getFogyasztas() + " W</span>" +
                "</div>" +
                (e.vanUtemezes() ? "<div class='mt-2'>" + utemezesSzoveg(e) + "</div>" : "") +
                "<div class='d-flex justify-content-between align-items-center mt-3'>" +
                "<div class='form-check form-switch m-0'>" +
                "<input class='form-check-input' type='checkbox' " + (e.getAktiv() ? "checked" : "") + " onclick=\"kapcsol('" + e.getAzonosito() + "')\">" +
                "<label class='form-check-label small'>" + (e.getAktiv() ? "Bekapcsolva" : "Kikapcsolva") + "</label>" +
                "</div>" +
                "<div>" +
                "<button class='kis-gomb' onclick=\"szerkeszt('" + e.getAzonosito() + "')\" title='Szerkesztés'><i class='bi bi-pencil'></i></button> " +
                "<button class='kis-gomb torol' onclick=\"torol('" + e.getAzonosito() + "')\" title='Törlés'><i class='bi bi-trash3'></i></button>" +
                "</div>" +
                "</div>" +
                "</div>" +
                "</div>"
        }
        document.querySelector(".eszkozok").innerHTML = tartalom
        document.querySelector(".eszkozok").classList.remove("d-none")
        document.querySelector(".tablazat").classList.add("d-none")
    } else {
        for (let i = 0; i < lista.length; i++) {
            var e = lista[i]
            tartalom +=
                "<tr>" +
                "<td><i class='bi " + ikonok[e.getTipus()] + " me-2'></i>" + e.getNev() + "</td>" +
                "<td>" + e.getAzonosito() + "</td>" +
                "<td>" + e.getTipus() + "</td>" +
                "<td>" + e.getHelyiseg() + "</td>" +
                "<td class='text-end'>" + e.getFogyasztas() + " W</td>" +
                "<td class='text-center'>" + (e.vanUtemezes() ? utemezesSzoveg(e) : "—") + "</td>" +
                "<td class='text-center'><input class='form-check-input' type='checkbox' " + (e.getAktiv() ? "checked" : "") + " onclick=\"kapcsol('" + e.getAzonosito() + "')\"></td>" +
                "<td class='text-end'>" +
                "<button class='kis-gomb' onclick=\"szerkeszt('" + e.getAzonosito() + "')\"><i class='bi bi-pencil'></i></button> " +
                "<button class='kis-gomb torol' onclick=\"torol('" + e.getAzonosito() + "')\"><i class='bi bi-trash3'></i></button>" +
                "</td>" +
                "</tr>"
        }
        document.querySelector(".tablazat tbody").innerHTML = tartalom
        document.querySelector(".tablazat").classList.remove("d-none")
        document.querySelector(".eszkozok").classList.add("d-none")
    }
}

function statisztika() {
    document.querySelector(".stat-osszes").innerHTML = eszkozok.length
    document.querySelector(".stat-aktiv").innerHTML = aktivDarab(eszkozok)
    document.querySelector(".stat-fogyasztas").innerHTML = osszFogyasztas(eszkozok)
    document.querySelector(".stat-helyisegek").innerHTML = helyisegek(eszkozok).length
}

function listakFeltolt() {
    var szuro = document.querySelector(".helyiseg-szuro")
    var elozo = szuro.value
    var nevek = helyisegek(eszkozok)
    var tartalom = "<option value='osszes'>Minden helyiség</option>"
    for (let i = 0; i < nevek.length; i++) {
        tartalom += "<option value='" + nevek[i] + "'>" + nevek[i] + "</option>"
    }
    szuro.innerHTML = tartalom
    szuro.value = nevek.indexOf(elozo) != -1 ? elozo : "osszes"

    var osszes = alapHelyisegek.slice()
    for (let i = 0; i < nevek.length; i++) {
        if (osszes.indexOf(nevek[i]) == -1) {
            osszes.push(nevek[i])
        }
    }
    var lista = ""
    for (let i = 0; i < osszes.length; i++) {
        lista += "<option value='" + osszes[i] + "'>"
    }
    document.querySelector("#helyisegLista").innerHTML = lista

    var tipusLista = ""
    for (let i = 0; i < tipusok.length; i++) {
        tipusLista += "<option value='" + tipusok[i] + "'>" + tipusok[i] + "</option>"
    }
    var kivalasztott = document.querySelector(".tipus").value
    document.querySelector(".tipus").innerHTML = tipusLista
    if (kivalasztott != "") {
        document.querySelector(".tipus").value = kivalasztott
    }
}

function helyisegekKiir() {
    var nevek = helyisegek(eszkozok)
    var ossz = osszFogyasztas(eszkozok)
    var tartalom = ""
    if (nevek.length == 0) {
        tartalom = "<div class='col-12'><div class='panel text-center p-5'><i class='bi bi-diagram-3 fs-1'></i><p class='mb-0 mt-2'>Még nincs egyetlen helyiség sem.</p></div></div>"
    }
    for (let i = 0; i < nevek.length; i++) {
        var benne = helyisegEszkozei(eszkozok, nevek[i])
        var watt = helyisegFogyasztas(eszkozok, nevek[i])
        var szazalek = ossz == 0 ? 0 : Math.round(watt / ossz * 100)
        tartalom +=
            "<div class='col-md-6 col-lg-4 mb-4'>" +
            "<div class='panel'>" +
            "<div class='d-flex justify-content-between align-items-center'>" +
            "<h5 class='mb-0'><i class='bi bi-geo-alt me-2'></i>" + nevek[i] + "</h5>" +
            "<span class='watt'>" + watt + " W</span>" +
            "</div>" +
            "<p class='small mt-2 mb-2'>" + benne.length + " eszköz · " + aktivDarab(benne) + " aktív</p>" +
            "<div class='progress'><div class='progress-bar' style='width:" + szazalek + "%'></div></div>" +
            "<small>" + szazalek + "% az össz fogyasztásból</small>" +
            "</div>" +
            "</div>"
    }
    document.querySelector(".helyisegek").innerHTML = tartalom
}

function rajzolGrafikon() {
    var vaszon = document.querySelector("#grafikon")
    var adat = napiAdatok(eszkozok)
    var nevek = Object.keys(adat.helyisegek)
    var csucs = 0
    for (let ora = 0; ora < 24; ora++) {
        var ossz = 0
        for (let i = 0; i < nevek.length; i++) {
            ossz += adat.helyisegek[nevek[i]][ora]
        }
        if (ossz > csucs) {
            csucs = ossz
        }
    }
    document.querySelector(".csucs").innerHTML = csucs + " W"

    var sorok = []
    for (let i = 0; i < nevek.length; i++) {
        sorok.push({
            label: nevek[i],
            data: adat.helyisegek[nevek[i]],
            borderColor: szinek[i % szinek.length],
            backgroundColor: szinek[i % szinek.length] + "33",
            borderWidth: 2,
            tension: 0.4,
            fill: true,
            pointRadius: 0
        })
    }

    grafikon = new Chart(vaszon, {
        type: "line",
        data: { labels: adat.cimkek, datasets: sorok },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: "index", intersect: false },
            plugins: {
                legend: { position: "bottom", labels: { color: "#c5c5c5", usePointStyle: true, pointStyle: "circle" } }
            },
            scales: {
                x: { grid: { color: "rgba(255,255,255,0.08)" }, ticks: { color: "#c5c5c5", maxTicksLimit: 12 } },
                y: { beginAtZero: true, grid: { color: "rgba(255,255,255,0.08)" }, ticks: { color: "#c5c5c5" } }
            }
        }
    })
}

function oldalValt(nev) {
    var oldalak = document.querySelectorAll(".oldal")
    for (let i = 0; i < oldalak.length; i++) {
        oldalak[i].classList.add("d-none")
    }
    document.querySelector(".oldal-" + nev).classList.remove("d-none")
    var gombok = document.querySelectorAll(".fulek button")
    for (let i = 0; i < gombok.length; i++) {
        gombok[i].classList.toggle("aktiv", gombok[i].getAttribute("data-oldal") == nev)
    }
    if (nev == "grafikon") {
        rajzolGrafikon()
    }
}

function utemezesFut() {
    var most = new Date()
    var ora = most.getHours() < 10 ? "0" + most.getHours() : most.getHours()
    var perc = most.getMinutes() < 10 ? "0" + most.getMinutes() : most.getMinutes()
    var ido = ora + ":" + perc
    var valtozott = false
    for (let i = 0; i < eszkozok.length; i++) {
        if (eszkozok[i].getBeIdo() == ido && !eszkozok[i].getAktiv()) {
            eszkozok[i].setAktiv(true)
            valtozott = true
        }
        if (eszkozok[i].getKiIdo() == ido && eszkozok[i].getAktiv()) {
            eszkozok[i].setAktiv(false)
            valtozott = true
        }
    }
    if (valtozott) {
        document.querySelector(".uzenet").innerHTML = "Ütemezés végrehajtva (" + ido + ")"
        frissit()
    }
}

function frissit() {
    eszkozokMentese(eszkozok)
    statisztika()
    listakFeltolt()
    szures()
    helyisegekKiir()
    if (!document.querySelector(".oldal-grafikon").classList.contains("d-none")) {
        rajzolGrafikon()
    }
}

function indit() {
    listakFeltolt()
    urlapTorles()
    frissit()
}

indit()
    