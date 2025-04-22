createMenu('Statistics Template JS', [
  { name: 'Nytt i version 7', script: 'new-in-v7.js' },
  { name: 'Visa ett år', script: 'one-year.js' },
  { name: "Trender", script: "trends.js" },
  {
    name: "Röster per kommun", sub: [
      { name: " Hur kmmuner roster i 2018", script: "kommun-roster-2018.js" },
      { name: "Jämförelse av två år", script: "jamforelse-av-tva-ar.js" },
      { name: 'test', script: 'test.js' },
    ]
  }
]);