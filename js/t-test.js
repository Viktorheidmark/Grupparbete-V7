// Växla till rätt databas för undersökningen
dbQuery.use('undersokning_2022');

let under = await dbQuery("SELECT * FROM roster_2022 WHERE Omrade = 'Norrbottens län'");
console.log('Resultat från frågan:', under);  // Logga resultatet för att se vad vi får
// Kontrollera om datan inte är tom eller null
if (under && under.length > 0) {
  tableFromData({ data: under });
} else {
  console.log("Ingen data för Blekinge Län.");
  alert("Ingen data för Blekinge Län.");
}