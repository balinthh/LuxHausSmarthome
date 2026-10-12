class Profil{
    #nev
    #jelszo

    constructor(nev,jelszo){
        this.setNev(nev)
        this.setJelszo(jelszo)
    }

    setNev(nev){
        this.#nev = nev
    }

    setJelszo(jelszo){
        this.#jelszo = jelszo
    }

    getJelszo(){
        return this.#jelszo
    }
    
    getNev(){
        return this.#nev
    }
}