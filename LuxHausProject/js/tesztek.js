var tesztEszkoz = new Eszkoz("  Lámpa ", "60", true, "T-1", " Nappali ", "Okos-izzó", "17:00", "23:00")
console.assert(tesztEszkoz.getNev() == "Lámpa", "Eszkoz: a név trimmelve")
console.assert(tesztEszkoz.getHelyiseg() == "Nappali", "Eszkoz: a helyiség trimmelve")
console.assert(tesztEszkoz.getFogyasztas() === 60, "Eszkoz: a fogyasztás számmá alakul")
console.assert(tesztEszkoz.getAktiv() === true, "Eszkoz: aktív igaz")
console.assert(tesztEszkoz.getAzonosito() == "T-1", "Eszkoz: azonosító megmarad")
console.assert(tesztEszkoz.getTipus() == "Okos-izzó", "Eszkoz: típus megmarad")
console.assert(tesztEszkoz.vanUtemezes() === true, "Eszkoz: van ütemezés")
console.assert(new Eszkoz("A", 1, false, "T-2", "X", "Egyéb", "", "").vanUtemezes() === false, "Eszkoz: nincs ütemezés")
console.assert(new Eszkoz("A", 1, false, "T-3", "X", "", "", "").getTipus() == "Egyéb", "Eszkoz: üres típus -> Egyéb")
tesztEszkoz.kapcsol()
console.assert(tesztEszkoz.getAktiv() === false, "Eszkoz.kapcsol: be -> ki")
tesztEszkoz.kapcsol()
console.assert(tesztEszkoz.getAktiv() === true, "Eszkoz.kapcsol: ki -> be")

var tesztProfil = new Profil("  anna ", "titok123")
console.assert(tesztProfil.getNev() == "anna", "Profil: név trimmelve")
console.assert(tesztProfil.getJelszo() == "titok123", "Profil: jelszó eltárolva")
console.assert(tesztProfil.jelszoHelyes("titok123") === true, "Profil.jelszoHelyes: jó jelszó")
console.assert(tesztProfil.jelszoHelyes("rossz") === false, "Profil.jelszoHelyes: rossz jelszó")
console.assert(tesztProfil.monogram() == "A", "Profil.monogram: nagybetű")
tesztProfil.setJelszo("uj1234")
console.assert(tesztProfil.jelszoHelyes("uj1234") === true, "Profil.setJelszo: módosítva")

var minta = [
    new Eszkoz("A", 60, true, "M-1", "Nappali", "Okos-izzó", "", ""),
    new Eszkoz("B", 25, false, "M-2", "Nappali", "Termosztát", "", ""),
    new Eszkoz("C", 100, true, "M-3", "Konyha", "Okos-konnektor", "", "")
]
console.assert(osszFogyasztas(minta) == 160, "osszFogyasztas: csak a bekapcsoltak (160)")
console.assert(osszFogyasztas([]) == 0, "osszFogyasztas: üres lista -> 0")
console.assert(aktivDarab(minta) == 2, "aktivDarab: 2 aktív")
console.assert(helyisegek(minta).length == 2 && helyisegek(minta)[0] == "Konyha", "helyisegek: egyedi, rendezett")
console.assert(helyisegFogyasztas(minta, "Nappali") == 60, "helyisegFogyasztas: Nappali = 60")
console.assert(helyisegFogyasztas(minta, "Konyha") == 100, "helyisegFogyasztas: Konyha = 100")
console.assert(helyisegEszkozei(minta, "Nappali").length == 2, "helyisegEszkozei: Nappali 2 eszköz")
console.assert(szurtLista(minta, "", "osszes", "osszes").length == 3, "szurtLista: nincs szűrő -> 3")
console.assert(szurtLista(minta, "", "Nappali", "osszes").length == 2, "szurtLista: helyiség szűrő -> 2")
console.assert(szurtLista(minta, "", "osszes", "be").length == 2, "szurtLista: bekapcsoltak -> 2")
console.assert(szurtLista(minta, "", "osszes", "ki").length == 1, "szurtLista: kikapcsoltak -> 1")
console.assert(szurtLista(minta, "konnektor", "osszes", "osszes").length == 1, "szurtLista: keresés típusra -> 1")
console.assert(szurtLista(minta, "", "Nappali", "be").length == 1, "szurtLista: kombinált -> 1")
console.assert(hibaUzenet("Lámpa", "60", "Nappali") == "", "hibaUzenet: érvényes -> nincs hiba")
console.assert(hibaUzenet("", "60", "Nappali") != "", "hibaUzenet: üres név hiba")
console.assert(hibaUzenet("Lámpa", "60", "") != "", "hibaUzenet: üres helyiség hiba")
console.assert(hibaUzenet("Lámpa", "-5", "Nappali") != "", "hibaUzenet: negatív fogyasztás hiba")
console.assert(hibaUzenet("Lámpa", "abc", "Nappali") != "", "hibaUzenet: nem szám fogyasztás hiba")
console.assert(hibaUzenet("Lámpa", "", "Nappali") != "", "hibaUzenet: üres fogyasztás hiba")
console.assert(hasznalat("Okos-zár", 3) == 1, "hasznalat: zár mindig 1")
console.assert(hasznalat("Okos-izzó", 20) == 1, "hasznalat: izzó este 1")
console.assert(hasznalat("Okos-izzó", 12) == 0.05, "hasznalat: izzó délben 0.05")
var napi = napiAdatok(minta)
console.assert(napi.cimkek.length == 24, "napiAdatok: 24 címke")
console.assert(napi.cimkek[0] == "00:00", "napiAdatok: első címke 00:00")
console.assert(napi.helyisegek["Nappali"].length == 24 && napi.helyisegek["Konyha"].length == 24, "napiAdatok: minden helyiséghez 24 érték")
var mindNemNegativ = true
for (let i = 0; i < 24; i++) {
    if (napi.helyisegek["Nappali"][i] < 0) {
        mindNemNegativ = false
    }
}
console.assert(mindNemNegativ, "napiAdatok: nem-negatív értékek")