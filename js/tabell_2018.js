addMdToPage("# Här är en lista över databasen undersokning_2018 i SQLite ")


dbQuery.use('undersokning_2018');

let under = await dbQuery('SELECT * FROM roster_2018')

tableFromData({ data: under })

addMdToPage("Källa: https://www.val.se/valresultat/riksdag-region-och-kommun/2018/valresultat.html")