dbQuery.use("arbetsloshet")

let county = await dbQuery("SELECT * FROM arbetsloshet")

tableFromData({ data: county })