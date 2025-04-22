dbQuery.use('kommun-info-mongodb');

// Hämta data
let votes = await dbQuery.collection('votesByKommun').find({}).limit(25);

// Kontrollera att data inte är tom eller null
if (!votes || votes.length === 0) {
  console.error("Ingen data tillgänglig.");
} else {
  // Sortera efter antal röster 2022 (om den finns)
  votes.sort((a, b) => (b.roster2022 || 0) - (a.roster2022 || 0));

  // Kontrollera att varje element har rätt struktur
  votes.forEach(vote => {
    if (!vote.kommun || vote.roster2022 === undefined || vote.roster2022 === null) {
      console.error("Felkod: Värde saknas i något objekt: ", vote);
    }
  });

  // Gör datan "chart friendly" om den är korrekt formaterad
  let chartData = makeChartFriendly(votes, "kommun", "roster2022");

  // Rita ut stapeldiagram
  drawGoogleChart({
    type: 'ColumnChart',
    data: chartData,
    options: {
      title: "Röster 2022 per kommun (topp 25)",
      height: 600,
      chartArea: { left: "15%", top: "10%" },
      hAxis: { title: 'Kommun' },
      vAxis: { title: 'Antal röster' },
      legend: { position: 'none' },
      bar: { groupWidth: '80%' },
    }
  });
}