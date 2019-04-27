const dweetClient = require('node-dweetio');
const five = require('johnny-five');

const board = new five.Board();
const dweetio = new dweetClient();

board.on('ready', () => {
    const soilTempPin = new five.Sensor({
        pin: 'A0',
        threshold: 4
    });
    const soilMoisturePin = new five.Sensor({
        pin: 'A1',
        threshold: 4
    });
    const sunLightPin = new five.Sensor({
        pin: 'A2',
        threshold: 4
    });
    const wateringThreshold = 15;
    soilTempPin.on('change', (value) => {
        const soilTempValue = 'node-temperature-monitor';
        let Vo = value;
        let T;
        T = (75.006 * Vo * (3.3 / 1024)) - 42;
        const soilTempMessage = {
            temperature: +T.toFixed(2)
        };

        dweetio.dweet_for(soilTempValue, soilTempMessage, (err, dweet) => {
            if (err) {
                console.log('[Error]: ', err);
            }
            if (dweet) {
                console.log(dweet.content);
            }
        });
    });
    soilMoisturePin.on('change', (value) => {
        const soilMoistureValue = 'node-moisture-monitor';
        let V1 = value;
        let soilMoistureRaw;
        soilMoistureRaw = V1 * (3.3 / 1024);
        const soilMoistureMessage = {
            soilMoisture: +soilMoistureRaw.toFixed(2)
        };
        dweetio.dweet_for(soilMoistureValue, soilMoistureMessage, (err, dweet) => {
            if (err) {
                console.log('[Error]: ', err);
            }
            if (dweet) {
                console.log(dweet.content);
            }
        });
        if ((soilMoisture < wateringThreshold) && (now.hour() > 19) && (now.hour() < 22) && (wateredToday = false)) {
            //water the garden
            board.digitalWrite(solenoidPin, HIGH);
            board.delay(wateringTime);
            board.digitalWrite(solenoidPin, LOW);
        }
        wateredToday = true;
    }
});
sunLightPin.on('change', (value) => {
    const sunLightValue = 'node-sunlight-monitor';
    let V2 = value;
    let sunLightRaw;
    sunLightRaw = Math.pow(((((150 * 3.3) / (V2 * (3.3 / 1024))) - 150) / 70000), -1.25);
    const sunLightMessage = {
        sunLight: +sunLightRaw.toFixed(2)
    };
    dweetio.dweet_for(sunLightValue, sunLightMessage, (err, dweet) => {
        if (err) {
            console.log('[Error]', err);
        }
        if (dweet) {
            console.log(dweet.content);
        }
    });
});

})
;
