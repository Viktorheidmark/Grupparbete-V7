dbQuery.use('valresultat');
let valdata = await dbQuery('SELECT * FROM rostning LIMIT 10');

tableFromData({ data: valdata });