addMdToPage("### Detta visar ett histogram över de 10 kommuner i Sverige som hade lägst arbetslöshet år 2022")

dbQuery.use('arbetsloshet');

let county = await dbQuery("SELECT Region, Arbetsloshet_2022 FROM arbetsloshet");

// Sortera efter lägst arbetslöshet (minst till störst)
county.sort((a, b) => a.Arbetsloshet_2022 - b.Arbetsloshet_2022);

// Välj de 10 med lägst arbetslöshet
county = county.slice(0, 10);

// Rita diagrammet
drawGoogleChart({
  type: 'ColumnChart',
  data: makeChartFriendly(county, "Region", "Arbetsloshet_2022"),
  options: {
    title: 'Topp 10 kommuner med lägst arbetslöshet',
    height: 800,
    chartArea: { left: "10%" }
  }
});