addMdToPage("# Här är ett histogram över arbetslösheten i olika kommuner (2022)");

// Hämta data från databasen
let result = await dbQuery(`
  SELECT Region, [2022] 
  FROM arbetsloshet
`);

console.log("SQL-resultat:", result);  // 👈 Lägg till detta för att debugga

let kommunData = Array.isArray(result) ? result : result?.rows ?? [];

if (!Array.isArray(kommunData) || kommunData.length === 0) {
  console.error("kommunData är tomt eller ogiltigt:", kommunData);
} else {
  kommunData.sort((a, b) => b["2022"] - a["2022"]);

  drawGoogleChart({
    type: 'ColumnChart',
    data: makeChartFriendly(kommunData, "Region", "2022"),
    options: {
      title: 'Arbetslöshet per kommun (2022)',
      height: 800,
      chartArea: { left: "15%" },
      hAxis: {
        slantedText: true,
        slantedTextAngle: 45,
        textStyle: { fontSize: 10 }
      }
    }
  });
}