
createMenu('En berättelse om Sverige och de senaste riksdagsval', [
  { name: 'Intro', script: 'new-in-v8.js' },
  {
    name: 'Counties', sub: [
      { name: 'Counties_tabell', script: 'counties.js' },
      { name: 'histogram_counties', script: 'histogram_counties.js' },
    ]
  },
  {
    name: 'Undersökning med län', sub: [
      { name: 'Tabell_2018', script: 'tabell_2018.js' },
      { name: 'Tabell_2022', script: 'tabell_2022.js' },
      { name: 'valstatistik_tabell', script: 'valstatistik.js' },
      { name: 'Histogram överpartier med dropdown år 2018_2022', script: 'histogram_2018_2022.js' },
      { name: 'piechart andel', script: 'piechart_andel.js' },
      { name: 'histogram_valstatiskik', script: 'histogram_valstatistik.js' },
      { name: 'diagram_valstatiskik', script: 'diagram_valstatistik.js' },
      { name: 'diagram_2_valstatiskik', script: 'diagram_2_valstatistik.js' },
      { name: 'diagram_3_valstatiskik', script: 'diagram_3_valstatistik.js' }

    ]
  },


  {
    name: 'arbetsloshet', sub: [
      { name: 'arbetsloshet_tabell', script: 'arbetsloshet.js' },
      { name: 'arbetsloshet_histogram_top_10', script: 'arbetsloshet_histogram.js' },
      { name: 'arbetsloshet_län_histogram', script: 'arbetsloshet3.js' },
      { name: 'arbetsloshet_jämförelse_sista_10', script: 'arbetsloshet4.js' }
    ]
  },


  {
    name: "Normalfördelning och t-test", sub: [
      {
        name: 'Fördelning av röster per parti', script: 'fordelning.js'
      },
      { name: "Jämförelse av valet", script: "jamforelse-av-tva-ar.js" },

      { name: " Hur kmmuner roster i 2018", script: "visualisering.js" },

    ]
  },

  {
    name: "MongoDB", sub: [
      { name: 'Här visar vi tabell', script: 'tabell_tannaz.js' },
      { name: 'Här visar vi topp 10 kommuner', script: 'arbetsloshetT.js' },
      { name: 'Medelinkomst', script: 'testT.js' },
    ]
  },

  {
    name: "neo4j", sub: [
      { name: 'diagram', script: 'Miladiagram.js' },
      { name: 'Tabeller jämförelse-2018-2022', script: 'Tabell.js' }
    ]
  }
]);