'use strict';

const minRes = 0.00003165120288457081; // geodetic degrees
const maxRes = 33.04687231063843; // geodetic degrees
const logMin = Math.log(minRes);
const logMax = Math.log(maxRes);
const steps = 20;
const logStep = (logMax - logMin) / (steps - 1);
for (let i = 0; i < steps; i++) {
    console.log('S' + i, Math.exp(logMin + logStep * i));
}
