'use strict';

'use strict';

const minRes = 0.00003165120288457081; // geodetic degrees
const maxRes = 33.04687231063843; // geodetic degrees
const logMin = Math.log2(minRes);
const logMax = Math.log2(maxRes);
const steps = 100;
const logStep = (logMax - logMin) / (steps - 1);
for (let i = 0; i < steps; i++) {
    console.log('S' + i, Math.pow(2, logMin + logStep * i));
}
