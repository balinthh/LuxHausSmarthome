function navFrissit() {
    var elem = document.querySelector(".nav-profil")
    if (elem == null) {
        return
    }
    var profil = profilBetoltese()
    if (profil != null && bejelentkezve()) {
        elem.innerHTML = "<i class='bi bi-person-check-fill'></i> " + profil.getNev()
    } else {
        elem.innerHTML = "<i class='bi bi-person'></i>"
    }
}

navFrissit()
