dbQuery.use('riksdagsval-neo4j');

let electionResults = await dbQuery(`
  MATCH (n:Partiresultat)
  WHERE n.roster2018 IS NOT NULL
  RETURN n
  LIMIT 25
`);

tableFromData({ data: electionResults });

// Draw a Google Charts
drawGoogleChart({
  type: 'ColumnChart',
  data: makeChartFriendly(electionResults, "parti", "roster2018"),
  options: {
    title: 'kolumn',
    height: 800,
    chartArea: { left: "10%" }
  }
});