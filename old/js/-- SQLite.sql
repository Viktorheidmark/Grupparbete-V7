-- SQLite


-- bara info om skåne
SELECT * FROM countyInfo WHERE lan = "Skåne län"; 


-- allt från tabellen
SELECT * FROM countyInfo;


-- län jämfört med folkmängd
SELECT lan, folkmangd2024
FROM countyInfo
ORDER BY folkmangd2024 DESC;


-- mer än 500 000 invånare
SELECT lan, folkmangd2024
FROM countyInfo
WHERE folkmangd2024 > 500000;

--minst invånare
SELECT lan, folkmangd2024
FROM countyInfo
ORDER BY folkmangd2024 ASC
LIMIT 1;

-- Visa län grundade före ett visst år och jämför folkmängd
SELECT lan, grundat, folkmangd2024
FROM countyInfo
WHERE grundat < 500
ORDER BY folkmangd2024 DESC;

--top 5 tätaste län (högst invånare per km²)
SELECT lan, invanarePerKm2
FROM countyInfo
ORDER BY invanarePerKm2 DESC
LIMIT 5;

--jämföra två län
SELECT lan, folkmangd2024, invanarePerKm2
FROM countyInfo
WHERE lan IN ('Stockholms län', 'Skåne län');
