dbQuery.use('valdata');
let valdata = await dbQuery('SELECT * FROM valresultat');

tableFromData({ data: valdata });
