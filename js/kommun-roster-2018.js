// Ladda Google Charts
google.charts.load('current', { packages: ['corechart'] });

async function dbQuery(query, dbName = "neo4j", parameters = {}) {
    const res = await fetch("/api/dbquery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, dbName, parameters })
    });
    return await res.json();
}

document.addEventListener("DOMContentLoaded", () => {
    const select = document.getElementById("kommunSelector");
    const container = document.getElementById("resultat-container");

    select.addEventListener("change", async function () {
        const kommun = this.value;
        const query = `
      MATCH (p:Partiresultat)
      WHERE p.roster2018 IS NOT NULL AND p.kommun = $kommun
      RETURN p.parti AS parti, p.roster2018 AS roster
      ORDER BY p.roster2018 DESC
    `;

        try {
            const data = await dbQuery(query, "neo4j", { kommun });
            if (data.error) throw new Error(data.error);

            const rows = data.result || data.data || [];
            if (rows.length === 0) {
                container.innerHTML = "<p class='text-warning'>Inga resultat hittades för denna kommun.</p>";
                return;
            }

            // Bygg tabell
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
            container.innerHTML = tabellHTML;

            google.charts.setOnLoadCallback(() => drawChart(rows, kommun));
        } catch (err) {
            console.error(err);
            container.innerHTML = `<p class="text-danger">Fel: ${err.message}</p>`;
        }
    });
});

function drawChart(dataRows, kommun) {
    const chartData = new google.visualization.DataTable();
    chartData.addColumn('string', 'Parti');
    chartData.addColumn('number', 'Röster');

    dataRows.forEach(row => {
        chartData.addRow([row.parti, parseInt(row.roster)]);
    });

    const options = {
        title: `Röster per parti – ${kommun}`,
        legend: { position: 'none' },
        hAxis: { title: 'Antal röster' },
        vAxis: { title: 'Parti' },
        bars: 'horizontal'
    };

    const chart = new google.visualization.BarChart(document.getElementById('chart_div'));
    chart.draw(chartData, options);
}