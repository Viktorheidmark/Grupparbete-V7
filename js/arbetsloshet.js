dbQuery.use("arbetsloshet")



addMdToPage("##  Detta är en lista över datakällan som används")

let county = await dbQuery("SELECT * FROM arbetsloshet LIMIT 10")

tableFromData({ data: county })

addMdToPage("Källa: https://www.statistikdatabasen.scb.se/pxweb/sv/ssd/START__AM__AM0210__AM0210D/ArRegArbStatus/sortedtable/tableViewSorted/")