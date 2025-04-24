createMenu('SQLITE UNDERSÖKNING', [
  { name: 'Nytt i version 7', script: 'new-in-v7.js' },
  { name: 'Counties', sub: [
      { name: 'Counties_tabell', script: 'counties.js' },
      { name: 'histogram_counties', script: 'histogram_counties.js' },
  ]
  },
  { name: 'valstatistik', sub: [
      { name: 'valstatistik_tabell', script: 'valstatistik.js' },
      { name: 'histogram_valstatiskik', script: 'histogram_valstatistik.js' },
      { name: 'diagram_valstatiskik', script: 'diagram_valstatistik.js' },
      { name: 'diagram_2_valstatiskik', script: 'diagram_2_valstatistik.js' },
  ]
  },
  {
    name: 'valresultat?', sub: [
      { name: 'valresultat_tabell', script: 'valresultat.js' },
      { name: 'diagram_3_valstatiskik', script: 'diagram_3_valstatistik.js' },
      { name: 'test', script: 'test.js' },
  ]
  },
  {
    name: 'Undersökning med kommuner', sub: [
      { name: 'Tabell_2018', script: 'tabell_2018.js' },
      { name: 'Tabell_2022', script: 'tabell_2022.js'},
      { name: 'Histogram överpartier med dropdown år 2018_2022', script: 'histogram_2018_2022.js' },
      { name: 'piechart andel', script: 'piechart_andel.js' },
      { name: 'histogram med kommuner och årval', script: 'histogram_kommuner_arval.js' },
      { name: 'totala röster', script: 'totala_roster.js' },
      { name: 't-test', script: 't-test.js' }


  ]},
 
]);