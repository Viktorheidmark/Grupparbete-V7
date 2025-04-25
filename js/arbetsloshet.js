let result = await dbQuery("SELECT * FROM arbetsloshet LIMIT 10");
console.log(result);  // Lägg till denna för att debugga resultatet
tableFromData({ data: result });