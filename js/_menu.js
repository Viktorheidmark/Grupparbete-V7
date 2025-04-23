createMenu('Statistics Template JS', [
  { name: 'Nytt i version 7', script: 'new-in-v7.js' },
  { name: 'Visa ett år', script: 'one-year.js' },
  { name: "Trender", script: "trends.js" },
  {
    name: 'Hur vi byger upp en sida', sub: [
      { name: 'Exempel på hur vi bygger upp en sida', script: 'instruktion.js' },
      { name: 'Data bas info', script: 'dbinfoOK.js' },
      { name: 'Terster', script: 'testerna.js' },
    ],
  },
  {
    name: "Röster per kommun", sub: [
      { name: 'Start page', script: 'startpage.js' },
      { name: "Jämförelse av två år", script: "jamforelse-av-tva-ar.js" },
      { name: " Hur kmmuner roster i 2018", script: "kommun-roster-2018.js" },
      { name: " Visualisering av komuner", script: "visualisering.js" },
      { name: 'test', script: 'test.js' },
    ]
  }
]);
