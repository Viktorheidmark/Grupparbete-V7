
addMdToPage("Intro")

let county = await dbQuery("SELECT lan, folkmangd2024 FROM countyinfo")
tableFromData({ data: county })



// Draw a Google Charts
drawGoogleChart({
  type: 'ColumnChart',
  data: makeChartFriendly(county, "lan", "folkmangd2024"),
  options: {
    title: 'kolumn',
    height: 800,
    chartArea: { left: "10%" }
  }
});


