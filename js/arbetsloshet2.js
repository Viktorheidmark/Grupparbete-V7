// Kommuner i Stockholm län
const stockholmKommuner = [
  "Botkyrka", "Danderyd", "Ekerö", "Haninge", "Huddinge", "Järfälla",
  "Lidingö", "Nacka", "Norrtälje", "Nykvarn", "Nynäshamn", "Salem",
  "Sigtuna", "Sollentuna", "Solna", "Stockholm", "Sundbyberg",
  "Södertälje", "Täby", "Tyresö", "Upplands-Bro", "Upplands Väsby",
  "Vallentuna", "Vaxholm", "Värmdö", "Österåker"
];

// Kommuner i Blekinge län
const blekingeKommuner = [
  "Karlshamn", "Karlskrona", "Olofström", "Ronneby", "Sölvesborg"
];

// Hämta arbetslöshet för bara de kommunerna
dbQuery.use("arbetsloshet");

let data = await dbQuery(`
  SELECT Region, Arbetsloshet_2022
  FROM arbetsloshet
  WHERE Region IN (${[...stockholmKommuner, ...blekingeKommuner]
    .map(name => `'${name}'`).join(", ")})
`);

// Dela upp resultatet
const stockholmData = data.filter(d => stockholmKommuner.includes(d.Region));
const blekingeData = data.filter(d => blekingeKommuner.includes(d.Region));

// Exempel: Rita stapeldiagram för båda grupperna
drawGoogleChart({
  type: "ColumnChart",
  data: makeChartFriendly(stockholmData, "Region", "Arbetsloshet_2022"),
  options: {
    title: "Arbetslöshet i Stockholm kommuner",
    height: 500
  }
});

drawGoogleChart({
  type: "ColumnChart",
  data: makeChartFriendly(blekingeData, "Region", "Arbetsloshet_2022"),
  options: {
    title: "Arbetslöshet i Blekinge kommuner",
    height: 500
  }
});