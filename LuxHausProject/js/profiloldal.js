function profilKiir() {
    var profil = profilBetoltese()
    document.querySelector(".regisztracio").classList.add("d-none")
    document.querySelector(".belepes").classList.add("d-none")
    document.querySelector(".profiladatok").classList.add("d-none")
    if (profil == null) {
        document.querySelector(".regisztracio").classList.remove("d-none")
    } else if (!bejelentkezve()) {
        document.querySelector(".belepes").classList.remove("d-none")
        document.querySelector(".belepes-nev").innerHTML = profil.getNev()
    } else {
        document.querySelector(".profiladatok").classList.remove("d-none")
        var nevek = document.querySelectorAll(".profil-nev")
        for (let i = 0; i < nevek.length; i++) {
            nevek[i].innerHTML = profil.getNev()
        }
        document.querySelector(".profil-monogram").innerHTML = profil.monogram()
        document.querySelector(".profil-eszkozok").innerHTML = eszkozokBetoltese().length + " db"
    }
    navFrissit()
}

function profilHiba(nev, jelszo) {
    if (nev.trim().length < 3) {
        return "A felhasználónév legalább 3 karakter legyen!"
    }
    if (jelszo.length < 4) {
        return "A jelszó legalább 4 karakter legyen!"
    }
    return ""
}

function regisztral() {
    var nev = document.querySelector(".reg-nev").value.trim()
    var jelszo = document.querySelector(".reg-jelszo").value
    var jelszo2 = document.querySelector(".reg-jelszo2").value
    var hiba = profilHiba(nev, jelszo)
    if (hiba != "") {
        alert(hiba)
        return
    }
    if (jelszo != jelszo2) {
        alert("A két jelszó nem egyezik!")
        return
    }
    profilMentese(new Profil(nev, jelszo))
    bejelentkezes()
    document.querySelector(".reg-nev").value = ""
    document.querySelector(".reg-jelszo").value = ""
    document.querySelector(".reg-jelszo2").value = ""
    document.querySelector(".uzenet").innerHTML = "Sikeres regisztráció, üdv " + nev + "!"
    profilKiir()
}

function belep() {
    var nev = document.querySelector(".be-nev").value.trim()
    var jelszo = document.querySelector(".be-jelszo").value
    var profil = profilBetoltese()
    if (profil.getNev() != nev || !profil.jelszoHelyes(jelszo)) {
        alert("Hibás felhasználónév vagy jelszó!")
        return
    }
    bejelentkezes()
    document.querySelector(".be-nev").value = ""
    document.querySelector(".be-jelszo").value = ""
    document.querySelector(".uzenet").innerHTML = "Sikeres bejelentkezés: " + nev
    profilKiir()
}

function kilep() {
    kijelentkezes()
    document.querySelector(".uzenet").innerHTML = "Kijelentkeztél."
    profilKiir()
}

function jelszoModosit() {
    var regi = document.querySelector(".regi-jelszo").value
    var uj = document.querySelector(".uj-jelszo").value
    var uj2 = document.querySelector(".uj-jelszo2").value
    var profil = profilBetoltese()
    if (!profil.jelszoHelyes(regi)) {
        alert("A jelenlegi jelszó nem megfelelő!")
        return
    }
    var hiba = profilHiba(profil.getNev(), uj)
    if (hiba != "") {
        alert(hiba)
        return
    }
    if (uj != uj2) {
        alert("A két új jelszó nem egyezik!")
        return
    }
    profil.setJelszo(uj)
    profilMentese(profil)
    document.querySelector(".regi-jelszo").value = ""
    document.querySelector(".uj-jelszo").value = ""
    document.querySelector(".uj-jelszo2").value = ""
    document.querySelector(".uzenet").innerHTML = "Jelszó sikeresen módosítva."
}

function profilTorol() {
    if (!confirm("Biztosan törlöd a profilt?")) {
        return
    }
    profilTorlese()
    document.querySelector(".uzenet").innerHTML = "Profil törölve."
    profilKiir()
}

profilKiir()
