const { DateTime } = require("luxon");

module.exports = {
    eleventyComputed: {
        todayUnix: () => Math.floor(DateTime.now().toSeconds()),
        lastWeekUnix: () =>
            Math.floor(DateTime.now().minus({ days: 7 }).toSeconds()),
        lastSundayNoon: () => {
           // let now = DateTime.now().startOf("day");
            let now = DateTime.now();
            console.log(`now = ${now}`)

            var prevWeek = DateTime.now().minus( {days: 7} );
            console.log(`prevWeek = ${prevWeek}`)
           // let retVal = now.minus({ days: now.weekday % 7 }).set({ hour: 12, minute: 0, second: 0, millisecond: 0 });
          //  console.debug(retVal);
            return prevWeek;

        },
        nextSunday: () => {
            let now = DateTime.now().startOf("day");
            return now.plus({ days: 7 - (now.weekday % 7) }).startOf("day");
        }
    }
};
