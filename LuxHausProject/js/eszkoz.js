class Eszkoz{
    #nev
    #fogyasztas
    #aktiv
    #azonosito
    #helyiseg

    constructor(nev,fogyasztas,aktiv,azonosito,helyiseg){
        this.setNev(nev)
        this.setFogyasztas(fogyasztas)
        this.isAktiv(aktiv)
        this.setAzonosito(azonosito)
        this.setHelyiseg(helyiseg)
    }

    setNev(nev){
        this.#nev = nev
    }

    setFogyasztas(fogyasztas){
        this.#fogyasztas = fogyasztas
    }

    isAktiv(aktiv){
        this.#aktiv = aktiv
    }

    setAzonosito(azonosito){
        this.#azonosito = azonosito
    }

    setHelyiseg(helyiseg){
        this.#helyiseg = helyiseg
    }
    
    getNev(){
        return this.#nev
    }

    getFogyasztas(){
        return this.#fogyasztas
    }
    
    getAktiv(){
        return this.#aktiv
    }

    getAzonosito(){
        return this.#azonosito
    }

    getHelyiseg(){
        return this.#helyiseg
    }
}