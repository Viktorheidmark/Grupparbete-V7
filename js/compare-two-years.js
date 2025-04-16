
addMdToPage("Intro")

let county = await dbQuery("SELECT * FROM countyinfo")
tableFromData({ data: county })

