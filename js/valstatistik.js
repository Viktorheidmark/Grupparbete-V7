
let bajen = await dbQuery("SELECT * FROM rostning")
tableFromData({ data: bajen })