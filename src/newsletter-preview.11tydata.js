const { DateTime } = require("luxon");

module.exports = {
    eleventyComputed: {
        todayUnix: () => Math.floor(DateTime.now().toSeconds()),
        lastWeekUnix: () =>
            Math.floor(DateTime.now().minus({ days: 7 }).toSeconds()),
        lastSunday: () => {
            let now = DateTime.now().startOf("day");
            let lastS = now.minus({ days: now.weekday % 7 }).startOf("day")
            //console.log(`lastS = ${lastS}`)
            return lastS
        },
        nextSunday: () => {
            let now = DateTime.now().startOf("day");
            return now.plus({ days: 7 - (now.weekday % 7) }).startOf("day");
        }
    }
};
