addMdToPage("# Här är en lista över databasen undersokning_2018 i SQLite ")


dbQuery.use('undersokning_2022');

let under = await dbQuery('SELECT * FROM roster_2022')

tableFromData({ data: under })

addMdToPage("Källa: https://resultat.val.se/val2022/RD?r=S")
