addMdToPage("# Här är en lista över databasen valresultat i SQLite ")

dbQuery.use('valresultat');
let valdata = await dbQuery('SELECT * FROM rostning LIMIT 18');

tableFromData({ data: valdata });


addMdToPage("Källa: https://www.statistikdatabasen.scb.se/pxweb/sv/ssd/START__ME__ME0104__ME0104C/ME0104T24/")