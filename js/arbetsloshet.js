let result = await dbQuery("SELECT * FROM inget_jobb LIMIT 10");

tableFromData({ data: result });