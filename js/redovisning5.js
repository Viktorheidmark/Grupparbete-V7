document.addEventListener("DOMContentLoaded", () => {
    const text = `# Datakällor som vi använt oss av
Benereta del om normalfördelning
 
📊 Statistisk analys – valresultat 2022 i utvalda kommuner
Efter att ha hämtat och filtrerat valdata för 2018 och 2022, har vi genomfört en rad statistiska analyser för att förstå hur partistödet är fördelat geografiskt, hur stabilt det är över tid, och om det finns samband med inkomstnivåer.
🔴 Socialdemokraterna(S) – ett jämnt och brett stöd
Medianandel per kommun: 39, 5 %
    Högsta andel: 52, 0 %
        Lägsta andel: 25, 5 %
            p - värde: 0, 9772 → normalfördelat stöd
Korrelation med inkomst: ingen tydlig
📌 Tolkning:
Socialdemokraternas röstandelar följer en normalfördelning, vilket betyder att partiets stöd är stabilt och jämt spritt över kommunerna.Den höga p - värdesindikationen visar att det inte finns några extrema avvikelser i röstandelarna – det är många kommuner i mitten, färre i kanterna, precis som en typisk klockkurva.
Det faktum att ingen tydlig korrelation finns mellan inkomstnivå och röststöd tyder på att Socialdemokraternas väljarbas är bred och tvärs igenom inkomstgrupper.Det bekräftar bilden av partiet som ett brett folkparti med både arbetarklass - och medelklassväljare, både i urbana och mindre kommuner.
🟡 Sverigedemokraterna(SD) – geografisk koncentration och variation
Medianandel per kommun: 30, 3 %
    Högsta andel: 47, 8 %
        Lägsta andel: 21, 6 %
            p - värde: 0,0047 → icke - normalfördelat stöd
Korrelation med inkomst: ingen tydlig
📌 Tolkning:
Till skillnad från S visar SD:s röstandelar en icke - normalfördelad kurva, vilket betyder att stödet varierar kraftigt mellan kommunerna.Histogrammet visar att vissa kommuner ger SD mycket höga resultat, medan andra ger lägre – det blir alltså en ojämn fördelning, inte som den jämna "klockkurvan" hos S.
Att SD:s stöd inte korrelerar tydligt med inkomstnivåer är intressant – det pekar på att det inte nödvändigtvis är ekonomisk status som styr väljarnas val, utan snarare andra faktorer som:
upplevd otrygghet
misstro mot etablissemanget
regional identitet och samhällsförändringar
Mönstret tyder på att SD har lokalt starka fästen, snarare än ett jämnt nationellt stöd.Det kan tolkas som ett uttryck för polarisering, där vissa områden är betydligt mer benägna att rösta på SD än andra.
Förskjutning och maktbalans
När vi jämför blockens röster över tid:
Vänsterblocket 2018: ~50 %
    Högerblocket 2018: ~50 %

        Vänsterblocket 2022: ~47 % har tappat röster
Högerblocket 2022: ~53 %
📌 Detta visar på en tydlig förskjutning till höger mellan valen.Analysen av partibyten per kommun och per län bekräftar detta: flera kommuner bytte från ett S - ledarskap till SD eller M, särskilt i socioekonomiskt pressade län som Blekinge och Kalmar.
🗺️ Geografisk fördelning: regionala maktförskjutningar
Genom att koppla kommuner till deras län kunde vi identifiera vilka regioner som haft flest partibyten mellan 2018 och 2022. Detta visar inte bara politisk rörelse, utan även regional oro eller missnöje.
    Exempel:
Blekinge och Gävleborg sticker ut med flera byten.
Kommuner med hög arbetslöshet och lägre inkomst var ofta bland dem som bytte från S till SD.
🧠 Övergripande slutsatser från den statistiska analysen
Socialdemokraterna har ett jämnt, nationellt spritt stöd utan stark koppling till inkomst – en klassisk bredd.
Sverigedemokraterna har ett ojämnt, geografiskt koncentrerat stöd – vilket pekar på att deras framgångar är lokalt drivna.

Inkomst har inte ett tydligt samband med partistöd – men i kombination med arbetslöshet, geografi och samhällsförtroende kan starka skillnader uppstå.
Blockpolitiken har förskjutits högerut – en trend som är statistiskt och visuellt tydlig.`;

    document.getElementById("content").innerText = text;
});
