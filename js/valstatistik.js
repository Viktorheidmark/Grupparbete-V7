addMdToPage("# Här är en lista över databasen valstatistik i SQLite ")


dbQuery.use('valdata');
let valdata = await dbQuery('SELECT * FROM valresultat');

tableFromData({ data: valdata });

addMdToPage("Källhänvisning: https://www.val.se/valresultat/riksdag-region-och-kommun/2022/radata-och-statistik.html")
