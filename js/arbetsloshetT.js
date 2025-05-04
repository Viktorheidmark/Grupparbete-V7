dbQuery.use('kommun-info-mongodb');
addMdToPage(`
  ### Jämförelse av medelinkomst i procent (2022) - Hög och Låg arbetslöshet.
`);
 
 
let income = await dbQuery.collection('incomeByKommun').find({});
 
 
const selectedCommunerHÖG = ['Flen', 'Perstorp', 'Eskilstuna', 'Malmö', 'Fagersta', 'Sandviken', 'Ronneby', 'Filipstad', 'Södertälje', 'Söderhamn'];
const selectedCommunerLÅG = ['Pajala', 'Kiruna', 'Kungsbacka', 'Tjörn', 'Öckerö', 'Krokom', 'Sotenäs', 'Gällivare', 'Habo', 'Mörbylånga'];
 
 
// --- FÖR HÖG MED INKOMST ---
 
let maxIncomeHÖG = 0;
selectedCommunerHÖG.forEach(kommun => {
  let kommunData = income.find(x => x.kommun === kommun);
  if (kommunData) {
    let inkomst = parseFloat(kommunData['medelInkomst2022']) || 0;
    if (inkomst > maxIncomeHÖG) {
      maxIncomeHÖG = inkomst;
    }
  }
});
 
//hög medelinkomst
let chartDataHÖG = [['Kommun', 'Medelinkomst (%)', { role: 'tooltip', type: 'string', p: { html: true } }]];
selectedCommunerHÖG.forEach(kommun => {
  let kommunData = income.find(x => x.kommun === kommun);
  if (kommunData) {
    let inkomst = parseFloat(kommunData['medelInkomst2022']) || 0;
    let procent = maxIncomeHÖG ? (inkomst / maxIncomeHÖG) * 100 : 0;
    const tooltip = `<b>${kommun}</b><br>Medelinkomst: ${inkomst.toLocaleString('sv-SE')} kr`;
    chartDataHÖG.push([kommun, procent, tooltip]);
  }
});
 
// Rita diagram , hög medelinkomst
drawGoogleChart({
  type: 'ColumnChart',
  data: chartDataHÖG,
  options: {
    title: `Medelinkomst i kommuner med hög arbetslöshet (2022)`,
    height: 500,
    width: 1000,
    chartArea: { left: "15%", top: "10%" },
    hAxis: { title: 'Kommun', slantedText: true, slantedTextAngle: 45 },
    vAxis: { title: 'Procent av högsta medelinkomst', minValue: 0, maxValue: 100 },
    legend: { position: 'none' },
    tooltip: { isHtml: true },
    colors: ['#2ecc71'] // Grön färg för hög inkomst
  }
});
 
// --- FÖR LÅG MED INKOMST ---
 
//högsta inkomsten bland kommuner med låg medelinkomst
let maxIncomeLÅG = 0;
selectedCommunerLÅG.forEach(kommun => {
  let kommunData = income.find(x => x.kommun === kommun);
  if (kommunData) {
    let inkomst = parseFloat(kommunData['medelInkomst2022']) || 0;
    if (inkomst > maxIncomeLÅG) {
      maxIncomeLÅG = inkomst;
    }
  }
});
 
// Skapa chartData, låg medelinkomst
let chartDataLÅG = [['Kommun', 'Medelinkomst (%)', { role: 'tooltip', type: 'string', p: { html: true } }]];
selectedCommunerLÅG.forEach(kommun => {
  let kommunData = income.find(x => x.kommun === kommun);
  if (kommunData) {
    let inkomst = parseFloat(kommunData['medelInkomst2022']) || 0;
    let procent = maxIncomeLÅG ? (inkomst / maxIncomeLÅG) * 100 : 0;
    const tooltip = `<b>${kommun}</b><br>Medelinkomst: ${inkomst.toLocaleString('sv-SE')} kr`;
    chartDataLÅG.push([kommun, procent, tooltip]);
  }
});
 
//låg medelinkomst
drawGoogleChart({
  type: 'ColumnChart',
  data: chartDataLÅG,
  options: {
    title: `Medelinkomst i kommuner med låg arbetslöshet (2022)`,
    height: 500,
    width: 1000,
    chartArea: { left: "15%", top: "10%" },
    hAxis: { title: 'Kommun', slantedText: true, slantedTextAngle: 45 },
    vAxis: { title: 'Procent av högsta medelinkomst', minValue: 0, maxValue: 100 },
    legend: { position: 'none' },
    tooltip: { isHtml: true },
    colors: ['#e74c3c'] // Röd färg för låg inkomst
  }
});
 