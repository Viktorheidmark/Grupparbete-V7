<<<<<<< HEAD
createMenu('Statistics Template JS', [
  { name: 'Nytt i version 7', script: 'new-in-v7.js' },
  { name: 'Visa ett år', script: 'one-year.js' },
  { name: 'Histogram', script: 'compare-two-years.js' },
  { name: 'Hitta trender', script: 'trends.js' },
  { name: 'test', script: 'test.js' },
  { name: 'mongoDB', script: 'kommun-query.mongodb' },
  { name: "Jämförelse av två år", script: "jamforelse-av-tva-ar.js" },
]);
=======
createMenu('SQLITE UNDERSÖKNING', [
  { name: 'Nytt i version 7', script: 'new-in-v7.js' },
  { name: 'Counties', sub: [
      { name: 'Counties_tabell', script: 'counties.js' },
      { name: 'histogram_counties', script: 'histogram_counties.js' },
  ]
  },
  {
    name: 'Undersökning med kommuner', sub: [
      { name: 'Tabell_2018', script: 'tabell_2018.js' },
      { name: 'Tabell_2022', script: 'tabell_2022.js' },
      { name: 'valstatistik_tabell', script: 'valstatistik.js' },
      { name: 'Histogram överpartier med dropdown år 2018_2022', script: 'histogram_2018_2022.js' },
      { name: 'piechart andel', script: 'piechart_andel.js' },
      { name: 'histogram_valstatiskik', script: 'histogram_valstatistik.js' },
      { name: 'diagram_valstatiskik', script: 'diagram_valstatistik.js' },
      { name: 'diagram_2_valstatiskik', script: 'diagram_2_valstatistik.js' },
  ]
  },
  

  {
    name: 'arbetsloshet', sub: [
      { name: 'arbetsloshet_tabell', script: 'arbetsloshet.js' },
      { name: 'arbetsloshet_histogram_top_10', script: 'arbetsloshet_histogram.js' },
      { name: 'arbetsloshet_län_histogram', script: 'arbetsloshet3.js' },
      { name: 'arbetsloshet_jämförelse_sista_10', script:'arbetsloshet4.js'}
  ]
  }
 
]);
>>>>>>> 67044f228e4f910efd38c1ac603a4431989baf6e
