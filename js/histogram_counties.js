addMdToPage("# Här är ett histogram över antalet personer som bor i olika län ")



let county = await dbQuery("SELECT lan, folkmangd2024 FROM countyinfo")

county.sort((a, b) => b.folkmangd2024 - a.folkmangd2024);




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