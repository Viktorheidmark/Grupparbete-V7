createMenu('Statistics Template JS', [
  { name: 'Nytt i version 8', script: 'new-in-v8.js' },
  { name: 'Visa ett år', script: 'valet-2022.js' },
  { name: 'Jämför två år', script: 'compare-two-years.js' },
  { name: 'test', script: 'test.js' },
  { name: 'Hitta trender', script: 'trends.js' },
  {
    name: "Mila", sub: [
      { name: 'diagram', script: 'Miladiagram.js' },
      { name: 'Tabeller jämförelse-2018-2022', script: 'Tabell.js' }
    ]
  }

]);