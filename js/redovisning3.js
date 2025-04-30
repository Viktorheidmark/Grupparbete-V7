

addMdToPage("### Detta visar ett histogram över de 10 kommuner i Sverige som hade högst arbetslöshet år 2022 med personer mellan 16-64")

dbQuery.use('arbetsloshet');

let county = await dbQuery("SELECT Region, Arbetsloshet_2022 FROM arbetsloshet");

// Sortera efter högst arbetslöshet
county.sort((a, b) => b.Arbetsloshet_2022 - a.Arbetsloshet_2022);

// Välj de 10 med högst arbetslöshet
county = county.slice(0, 10);

// Rita diagrammet
drawGoogleChart({
  type: 'ColumnChart',
  data: makeChartFriendly(county, "Region", "Arbetsloshet_2022"),
  options: {
    title: 'Topp 10 kommuner med högst arbetslöshet',
    height: 800,
    chartArea: { left: "10%" }
  }
});



addMdToPage("### Detta visar ett histogram över de 10 kommuner i Sverige som hade lägst arbetslöshet år 2022 med personer mellan 16-64")

dbQuery.use('arbetsloshet');

let bajen = await dbQuery("SELECT Region, Arbetsloshet_2022 FROM arbetsloshet");

// Sortera efter lägst arbetslöshet (minst till störst)
bajen.sort((a, b) => a.Arbetsloshet_2022 - b.Arbetsloshet_2022);

// Välj de 10 med lägst arbetslöshet
bajen = bajen.slice(0, 10);
 
// Rita diagrammet
drawGoogleChart({
  type: 'ColumnChart',
  data: makeChartFriendly(bajen, "Region", "Arbetsloshet_2022"),
  options: {
    title: 'Topp 10 kommuner med lägst arbetslöshet',
    height: 800,
    chartArea: { left: "10%" }
  }
});