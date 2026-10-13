class Eszkoz{
    #nev
    #fogyasztas
    #aktiv
    #azonosito
    #helyiseg
    #tipus
    #beIdo
    #kiIdo

    constructor(nev,fogyasztas,aktiv,azonosito,helyiseg,tipus,beIdo,kiIdo){
        this.setNev(nev)
        this.setFogyasztas(fogyasztas)
        this.setAktiv(aktiv)
        this.setAzonosito(azonosito)
        this.setHelyiseg(helyiseg)
        this.setTipus(tipus)
        this.setBeIdo(beIdo)
        this.setKiIdo(kiIdo)
    }

    setNev(nev){
        this.#nev = String(nev).trim()
    }

    setFogyasztas(fogyasztas){
        this.#fogyasztas = Number(fogyasztas)
    }

    setAktiv(aktiv){
        this.#aktiv = aktiv == true
    }

    setAzonosito(azonosito){
        this.#azonosito = azonosito
    }

    setHelyiseg(helyiseg){
        this.#helyiseg = String(helyiseg).trim()
    }

    setTipus(tipus){
        this.#tipus = tipus || "Egyéb"
    }

    setBeIdo(beIdo){
        this.#beIdo = beIdo || ""
    }

    setKiIdo(kiIdo){
        this.#kiIdo = kiIdo || ""
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

    getTipus(){
        return this.#tipus
    }

    getBeIdo(){
        return this.#beIdo
    }

    getKiIdo(){
        return this.#kiIdo
    }

    kapcsol(){
        this.#aktiv = !this.#aktiv
    }

    vanUtemezes(){
        return this.#beIdo != "" || this.#kiIdo != ""
    }

    adatok(){
        return {
            nev: this.#nev,
            fogyasztas: this.#fogyasztas,
            aktiv: this.#aktiv,
            azonosito: this.#azonosito,
            helyiseg: this.#helyiseg,
            tipus: this.#tipus,
            beIdo: this.#beIdo,
            kiIdo: this.#kiIdo
        }
    }
}
