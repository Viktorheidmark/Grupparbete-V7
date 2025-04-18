
let data = await dbQuery("SELECT * FROM rostning"); // eller vad du använder

console.log("Data till tableFromData:", data);

tableFromData({ data });