dbQuery.use('counties-sqlite');
let countyInfo = await dbQuery('SELECT * FROM riksdag');

tableFromData({ data: income })