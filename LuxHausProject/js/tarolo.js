function profilMentese(profil) {
    localStorage.setItem("profilNev", profil.getNev())
    localStorage.setItem("profilJelszo", profil.getJelszo())
}

function profilBetoltese() {
    var nev = localStorage.getItem("profilNev")
    var jelszo = localStorage.getItem("profilJelszo")
    if (nev == null) {
        return null
    }
    return new Profil(nev, jelszo)
}

function profilTorlese() {
    localStorage.removeItem("profilNev")
    localStorage.removeItem("profilJelszo")
    localStorage.removeItem("bejelentkezve")
}

function bejelentkezes() {
    localStorage.setItem("bejelentkezve", "igen")
}

function kijelentkezes() {
    localStorage.removeItem("bejelentkezve")
}

function bejelentkezve() {
    return localStorage.getItem("bejelentkezve") == "igen"
}

function kovetkezoAzonosito() {
    var szam = Number(localStorage.getItem("utolsoAzonosito") || 0) + 1
    localStorage.setItem("utolsoAzonosito", szam)
    return "LH-" + szam
}

function eszkozAdatokbol(adat) {
    return new Eszkoz(adat.nev, adat.fogyasztas, adat.aktiv, adat.azonosito, adat.helyiseg, adat.tipus, adat.beIdo, adat.kiIdo)
}

function eszkozokMentese(eszkozok) {
    var lista = []
    for (let i = 0; i < eszkozok.length; i++) {
        lista.push(eszkozok[i].adatok())
    }
    localStorage.setItem("eszkozok", JSON.stringify(lista))
}

function eszkozokBetoltese() {
    var szoveg = localStorage.getItem("eszkozok")
    if (szoveg == null) {
        var alap = alapEszkozok()
        eszkozokMentese(alap)
        return alap
    }
    var lista = JSON.parse(szoveg)
    var eszkozok = []
    for (let i = 0; i < lista.length; i++) {
        eszkozok.push(eszkozAdatokbol(lista[i]))
    }
    return eszkozok
}

function alapEszkozok() {
    return [
        new Eszkoz("Nappali főlámpa", 60, true, kovetkezoAzonosito(), "Nappali", "Okosizzó", "17:30", "23:00"),
        new Eszkoz("Nappali termosztát", 25, true, kovetkezoAzonosito(), "Nappali", "Termosztát", "", ""),
        new Eszkoz("Bejárati kamera", 12, true, kovetkezoAzonosito(), "Előszoba", "Biztonsági kamera", "", ""),
        new Eszkoz("Kávéfőző konnektor", 900, false, kovetkezoAzonosito(), "Konyha", "Okoskonnektor", "06:30", "08:00"),
        new Eszkoz("Háló hangulatfény", 15, false, kovetkezoAzonosito(), "Hálószoba", "Okosizzó", "21:00", "23:30"),
        new Eszkoz("Bejárati zár", 5, true, kovetkezoAzonosito(), "Előszoba", "Okoszár", "", ""),
        new Eszkoz("Kerti mozgásérzékelő", 3, true, kovetkezoAzonosito(), "Kert", "Mozgásérzékelő", "18:00", "06:00"),
        new Eszkoz("Nappali okostévé", 120, false, kovetkezoAzonosito(), "Nappali", "Okostévé", "19:00", "22:30")
    ]
}
