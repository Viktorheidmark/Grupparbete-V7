// Imports from libs
import * as s from './libs/simple-statistics.js';
import stdLib from './libs/stdLib.js';
import addMdToPage from './libs/addMdToPage.js';
import addDropdown from './libs/addDropdown.js';
import drawGoogleChart from './libs/drawGoogleChart.js';
import makeChartFriendly from './libs/makeChartFriendly.js';

// Imports our own helper functions and groupings
import * as helpers from './helpers.js'
import { groups } from './load-data-and-make-groups.js';
import tableFromData from './libs/tableFromData.js';

addMdToPage('## Tvåsidigt T-test');
let showExplanation = addDropdown('Visa förklaring', ['Ja', 'Nej'], 'Nej');

if (showExplanation === 'Ja') {
    addMdToPage(` 
  Ett [tvåsidigt T-test](https://sv.wikipedia.org/wiki/T-test) (**two-sample t-test**) jämför om medelvärdet på en variabel mätt i två olika populationer (eller i vårt fall om två olika strata/grupper från ett stickprov) är lika. 
  * Vår **nollhypotes** är att de är lika, dvs. *ingen statistiskt säkerställd skillnad* existerar mellan grupperna.
  * Vår **alternativhypotes** är att det finns en skillnad mellan grupperna.
  * Om **p-värdet** från T-testet är mindre än [signifikansnivån](https://www.statistiskordbok.se/ord/signifikansniva) (som vi valt att sätta till  α = 0.05), så förkastar vi nollhypotesen. (**p < α**) 
  * Har vi förkastat **nollhypotesen** är alternativhypotesen sann, dvs. vi har en **statistiskt signifikant skillnad**!
  
  I detta fall kan vi uttrycka våra två hypoteser så här:
  * *Nollhypotes* - det finns ingen statistiskt säkerställd skillnad i självskattad allmänhälsa mellan grupperna.
  * *Alternativhypotes* - nollhypotesen är falsk, dvs. det finns en statistiskt säkerställd skillnad mellan självskattad allmänhälsa i de två grupperna.
  * Vi kan också gå längre och ha en alternativhypotes där vi förutspår åt vilket håll skillnaden ska ligga (t.ex. anta att medelvärdet för självskattad hälsa ska vara högre hos icke-rökare). I så fall måste vi kolla att riktningen stämmer!
  
  **Notera**: För att T-test ska vara tillförlitliga behöver de utföras på normalfördelat material!
`);
}

// Dropdowns for choice of group + filtering of outliers
addMdToPage('### Välj två grupper att jämföra:');
let filtered1 = helpers.chooseGroupPlusOutlierFiltering(
    'Grupp 1', groups, 'rökare (för närvarande)', 'Nej, ta bort mer än ± 3 x standardavvikelse'
);
let filtered2 = helpers.chooseGroupPlusOutlierFiltering(
    'Grupp 2', groups, 'icke-rökare (aldrig rökt)', 'Nej, ta bort mer än ± 3 x standardavvikelse'
);
let nonNormalDist = (filtered1.normalDist ? 0 : 1) + (filtered2.normalDist ? 0 : 1);
let healthGroup1 = filtered1.data;
let healthGroup2 = filtered2.data;

// Perform T-test
let result = stdLib.stats.ttest2(healthGroup1, healthGroup2);

// Calculate some additional meauserements
let stdDev1 = s.sampleStandardDeviation(healthGroup1);
let stdDev2 = s.sampleStandardDeviation(healthGroup2);
let jointMean = s.mean([...healthGroup1, ...healthGroup2]);
let jointStdDev = s.sampleStandardDeviation([...healthGroup1, ...healthGroup2]);

// Create a table showing comparison data
tableFromData({
    data: [{
        'T-värde': result.statistic,
        'p-värde': result.pValue,
        'Signifikant skillnad': result.rejected ? `Ja, grupp ${result.xmean > result.ymean ? 1 : 2} mår lite bättre.` : 'Nej',
        'Normalfördelat?': nonNormalDist == 0 ? 'Ja' : 'Nej, bör ej T-testas.',
        'Grupp&nbsp;1, medel': result.xmean.toFixed(1) + ' ± ' + stdDev1.toFixed(1),
        'Grupp&nbsp;2, medel': result.ymean.toFixed(1) + ' ± ' + stdDev2.toFixed(1)
    }]
});

console.log(nonNormalDist == 0 ? '' : nonNormalDist + ' ej normalfördelade urval')

// Min & max for gauges, the joint mean for the two groups +/i 2 * stdDev, 
// covers 95% of respondents
let min = Math.round(jointMean - jointStdDev * 2);
let max = Math.round(jointMean + jointStdDev * 2);

drawGoogleChart({
    type: 'Gauge',
    data: makeChartFriendly(
        [{ x: result.xmean, y: result.ymean }], 'Grupp 1', 'Grupp 2'
    ),
    options: {
        height: 300,
        min,
        max,
        redFrom: min, redTo: min + jointStdDev,
        yellowFrom: min + jointStdDev, yellowTo: jointMean - 0.1 * jointStdDev,
        greenFrom: jointMean - 0.1 * jointStdDev, greenTo: max
    }
});