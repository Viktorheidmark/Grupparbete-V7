let result = await dbQuery("SELECT * FROM inget_jobb LIMIT 10");

if (result && result.length > 0) {
  tableFromData({ data: result });
} else {
  addMdToPage("⚠️ Tabellen `inget_jobb` finns, men innehåller inga rader.");
}