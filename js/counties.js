
addMdToPage("# Här är en lista över databasen counties i SQLite ")

let county = await dbQuery("SELECT * FROM countyinfo")
tableFromData({ data: county })

