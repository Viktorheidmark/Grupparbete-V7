createMenu('Statistics Template JS', [
  { name: 'Alla tabeller från 4 olika data', script: 'startpage.js' },
  { name: 'Instuktioner', script: 'instruktions.js' },
  {
    name: "Benereta", sub: [

      {
        name: 'Fördelning av röster per parti', script: 'fordelning.js'
      },
      { name: "Jämförelse av valet", script: "jamforelse-av-tva-ar.js" },

      { name: " Hur kmmuner roster i 2018", script: "visualisering.js" },



    ]
  }
]);
