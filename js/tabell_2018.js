dbQuery.use('undersokning_2018');

let under = await dbQuery('SELECT * FROM roster_2018')

tableFromData({ data: under })