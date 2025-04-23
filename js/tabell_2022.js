dbQuery.use('undersokning_2022');

let under = await dbQuery('SELECT * FROM roster_2022')

tableFromData({ data: under })
