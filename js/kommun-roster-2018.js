// Denna fil innehåller JavaScript-kod för att hämta och visa resultat från valet 2018 i olika kommuner.

// Laddar in Google Charts och anger att vi använder 'corechart'-paketet (för diagram)
google.charts.load('current', { packages: ['corechart'] });

/**
 * Funktion som skickar en förfrågan till backend för att köra en Cypher-query i Neo4j.
 * @param {string} query - Cypher-query att köra
 * @param {string} dbName - Namn på databasen (default: "neo4j")
 * @param {object} parameters - Parameterobjekt att skicka med i queryn
 * @returns {Promise<object>} - JSON-svar med data eller fel
 */
async function dbQuery(query, dbName = "neo4j", parameters = {}) {
    const res = await fetch("/api/dbquery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, dbName, parameters })
    });
    return await res.json();
}

// Väntar tills hela HTML-dokumentet är laddat
document.addEventListener("DOMContentLoaded", () => {
    // Hämtar HTML-element för kommun-väljaren och resultat-container
    const select = document.getElementById("kommunSelector");
    const container = document.getElementById("resultat-container");

    // När användaren väljer en kommun i dropdown-menyn
    select.addEventListener("change", async function () {
        const kommun = this.value;

        // Cypher-query för att hämta partier och antal röster i den valda kommunen
        const query = `
      MATCH (p:Partiresultat)
      WHERE p.roster2018 IS NOT NULL AND p.kommun = $kommun
      RETURN p.parti AS parti, p.roster2018 AS roster
      ORDER BY p.roster2018 DESC
    `;

        try {
            // Kör frågan mot databasen och hämta resultat
            const data = await dbQuery(query, "neo4j", { kommun });
            if (data.error) throw new Error(data.error);

            // Extrahera resultatet ur svaret
            const rows = data.result || data.data || [];

            // Om inget resultat hittades, visa varningsmeddelande
            if (rows.length === 0) {
                container.innerHTML = "<p class='text-warning'>Inga resultat hittades för denna kommun.</p>";
                return;
            }

            // Bygg HTML-tabellen med resultatet
            const tabellHTML = `
        <h3 class="mt-4">Röster per parti – ${kommun}</h3>
        <table class="table table-bordered table-striped">
          <thead><tr><th>Parti</th><th>Antal röster</th></tr></thead>
          <tbody>
            ${rows.map(row => `<tr><td>${row.parti}</td><td>${row.roster}</td></tr>`).join("")}
          </tbody>
        </table>
        <div id="chart_div"></div>
      `;

            // Lägg in tabellen i sidan
            container.innerHTML = tabellHTML;

            // Rita diagrammet med Google Charts
            google.charts.setOnLoadCallback(() => drawChart(rows, kommun));
        } catch (err) {
            // Visa felmeddelande om något går snett
            console.error(err);
            container.innerHTML = `<p class="text-danger">Fel: ${err.message}</p>`;
        }
    });
});

/**
 * Funktion för att rita ett horisontellt stapeldiagram med röster per parti.
 * @param {Array} dataRows - Array med partier och röster
 * @param {string} kommun - Kommunens namn (för rubriken)
 */
function drawChart(dataRows, kommun) {
    // Skapa en ny Google DataTable och lägg till kolumner för parti och röster
    const chartData = new google.visualization.DataTable();
    chartData.addColumn('string', 'Parti');
    chartData.addColumn('number', 'Röster');

    // Lägg till varje rad i datatabellen
    dataRows.forEach(row => {
        chartData.addRow([row.parti, parseInt(row.roster)]);
    });

    // Inställningar för diagrammet
    const options = {
        title: `Röster per parti – ${kommun}`,
        legend: { position: 'none' },
        hAxis: { title: 'Antal röster' },
        vAxis: { title: 'Parti' },
        bars: 'horizontal' // Horisontella staplar
    };

    // Rita diagrammet i <div id="chart_div">
    const chart = new google.visualization.BarChart(document.getElementById('chart_div'));
    chart.draw(chartData, options);
}
