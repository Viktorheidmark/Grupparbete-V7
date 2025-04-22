addMdToPage("# Här är en lista över databasen valresultat i SQLite ")

dbQuery.use('valresultat');
let valdata = await dbQuery('SELECT * FROM rostning LIMIT 18');

tableFromData({ data: valdata });