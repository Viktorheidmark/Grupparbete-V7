addMdToPage("# Normalfördelning av röster för Moderaterna över olika områden");

// Hämta röster för Moderaterna (M) från databasen för alla områden
let data = await dbQuery(`SELECT Omrade, M FROM roster_2018 WHERE M IS NOT NULL`);

// Kontrollera om data är en array
if (Array.isArray(data)) {
  // Omvandla rösterna till en array av tal (röster för Moderaterna)
  let mVotes = data.map(row => Number(row.M));

  // Kontrollera om vi har några röster
  if (mVotes.length > 0) {
    // Beräkna Skewness och Kurtosis för att avgöra om fördelningen är normal
    let skewness = s.sampleSkewness(mVotes);
    let kurtosis = s.sampleKurtosis(mVotes);

    // Kontrollera om rösterna är normalfördelade
    let normal = Math.abs(skewness) < 0.5 && Math.abs(kurtosis) < 1;

    // Visa analysen av normalfördelning
    addMdToPage(`
      ### Normalfördelningsanalys (Röster för Moderaterna)
      - **Skewness (symmetri)**: ${skewness.toFixed(3)}
      - **Kurtosis (toppighet)**: ${kurtosis.toFixed(3)}
      - Rösterna för Moderaterna verkar ${normal ? 'vara normalfördelade' : 'inte vara normalfördelade'}
    `);
  } else {
    addMdToPage("Det finns inga röster för Moderaterna i den här datan.");
  }
} else {
  addMdToPage("Det verkar som att data inte är i rätt format. Försök igen.");
}

// Om du vill visa fördelningen av rösterna som histogram (valfritt)
drawGoogleChart({
  type: "ColumnChart",
  data: [
    ['Område', 'Röster för Moderaterna'],
    ...data.map(row => [row.Omrade, Number(row.M)])
  ],
  options: {
    title: 'Röster för Moderaterna över olika områden',
    hAxis: { title: 'Område' },
    vAxis: { title: 'Antal röster' },
    legend: 'none',
    chartArea: { width: '80%', height: '70%' }
  }
});