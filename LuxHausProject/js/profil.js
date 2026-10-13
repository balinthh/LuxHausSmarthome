class Profil{
    #nev
    #jelszo

    constructor(nev,jelszo){
        this.setNev(nev)
        this.setJelszo(jelszo)
    }

    setNev(nev){
        this.#nev = String(nev).trim()
    }

    setJelszo(jelszo){
        this.#jelszo = String(jelszo)
    }

    getJelszo(){
        return this.#jelszo
    }

    getNev(){
        return this.#nev
    }

    jelszoHelyes(jelszo){
        return this.#jelszo == jelszo
    }

    monogram(){
        if (this.#nev == "") {
            return "?"
        }
        return this.#nev.charAt(0).toUpperCase()
    }
}
