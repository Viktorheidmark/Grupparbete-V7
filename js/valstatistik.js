
addMdToPage("Intro")

let bajen = await dbQuery("SELECT * FROM roster")
tableFromData({ data: bajen })