function uzenetKuld() {
    var nev = document.querySelector(".kapcsolat-nev").value.trim()
    var email = document.querySelector(".kapcsolat-email").value.trim()
    var uzenet = document.querySelector(".kapcsolat-uzenet").value.trim()
    if (nev == "" || email == "" || uzenet == "") {
        alert("Minden mező kitöltése kötelező!")
        return
    }
    if (email.indexOf("@") == -1) {
        alert("Érvénytelen e-mail cím!")
        return
    }
    document.querySelector(".kapcsolat-nev").value = ""
    document.querySelector(".kapcsolat-email").value = ""
    document.querySelector(".kapcsolat-uzenet").value = ""
    document.querySelector(".uzenet").innerHTML = "Köszönjük, " + nev + "! Az üzenetedet megkaptuk."
}
