createMenu('Statistics Template JS', [
  { name: 'Instuktioner', script: 'instruktions.js' },
  {
    name: "Röster per kommun", sub: [
      { name: 'Start page', script: 'startpage.js' },
      {
        name: 'Fördelning av röster per parti', script: 'fördelning-av röster-per-parti.js'
      },
      { name: "Jämförelse av valet", script: "jamforelse-av-tva-ar.js" },
      { name: "Map med ", script: "kommun-roster-2018.js" },
      { name: " Hur kmmuner roster i 2018", script: "visualisering.js" },


    ]
  }
]);
