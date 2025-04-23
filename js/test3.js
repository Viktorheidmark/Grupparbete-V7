dbQuery.use('riksdagsval-neo4j');
let electionResults =
  await dbQuery('MATCH (n:Partiresultat) RETURN n');
console.log('electionResults from neo4j', electionResults);

tableFromData({ data: electionResults})