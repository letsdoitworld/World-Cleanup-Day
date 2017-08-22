'use strict';
const memory = require('./index');
const cache = require('./cache');

memory.READY.then(async () => {
    const f = (min, max) => Math.round(min + Math.random() * (max - min));

    // // rough bbox of Romania
    const xMin = 20.36865234375;
    const xMax = 29.64111328125;
    const yMin = 43.73935207915;
    const yMax = 48.25394114463;

    // const xMin = -90;
    // const xMax = 90;
    // const yMin = -90;
    // const yMax = 90;

    for (let i = 0; i < 5000; i++) {
        await memory.getAreasForLocation(
            // 26.6748046875, 48.180738507303836
            f(xMin, xMax), f(yMin, yMax)
        );
    }
    console.log(cache.size());
});

// 60 possible values
// 10 item cache limit -> 18s   ******************
// 20 item cache limit -> 13s   *************
// 30 item cache limit -> 10s   **********
// 40 item cache limit -> 6s    ******
// 50 item cache limit -> 2.5s  **
// 60 item cache limit -> 1.75s *
