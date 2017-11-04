/* In order to classify the seminars according to their semester,
 * the semesters have to be defined. This is what semesterutils is for.
 */

var semesterutils = {
    semesterArray: [],
    semesterNameArray: [],
    yearinfinity: 2100,

    /* Upon giving the start year, allAndPastSemesters populates two arrays:
       - semesterArray: array of objects with three fields:
          + name: string of semester name
          + start: Date object with semester start date
          + end: Date object with semester end date
       - semesterNameArray: array of strings with semester names
       In both arrays, index 0 is special and corresponds to all past events.
       The past semesters are ordered from most recent to oldest.
    */
    allAndPastSemesters: function (yearzero) {
        var currentDate = new Date();
        var semesterArray = [];
        for (var t = yearzero; t < this.yearinfinity; t++) {
            var springSemester = {
                name: "Spring " + t,
                start: new Date("1/1/" + t),
                end: new Date("6/30/" + t)
            };
            if (springSemester.end > currentDate) {
                // current semester is spring
                break;
            }
            semesterArray.push(springSemester);
            var fallSemester = {
                name: "Fall " + t,
                start: new Date("7/1/" + t),
                end: new Date("12/31/" + t)
            };
            if (fallSemester.end > currentDate) {
                // current semester is fall
                break;
            }
            semesterArray.push(fallSemester);
        }
        semesterArray.push({
            name: "all",
            start: new Date("1/1/" + yearzero),
            end: new Date()
        });
        this.semesterArray  = semesterArray.reverse();
        for (var i = 0; i < semesterArray.length; i++) {
            this.semesterNameArray.push(semesterArray[i].name);
        }
    },

    /* Upon giving the start year, currentAndPastSemesters populates two arrays:
       - semesterArray: array of objects with three fields:
          + name: string of semester name
          + start: Date object with semester start date
          + end: Date object with semester end date
       - semesterNameArray: array of strings with semester names
       In both arrays, index 0 corresponds to the current semester.
       The past semesters are ordered from most recent to oldest.
    */
    currentAndPastSemesters: function (yearzero) {
        var currentDate = new Date();
        var semesterArray = [];
        for (var t = yearzero; t < this.yearinfinity; t++) {
            var springSemester = {
                name: "Spring " + t,
                start: new Date("1/1/" + t),
                end: new Date("6/30/" + t)
            };
            semesterArray.push(springSemester);
            if (springSemester.end > currentDate) {
                // current semester is spring
                break;
            }
            var fallSemester = {
                name: "Fall " + t,
                start: new Date("7/1/" + t),
                end: new Date("12/31/" + t)
            };
            semesterArray.push(fallSemester);
            if (fallSemester.end > currentDate) {
                // current semester is fall
                break;
            }
        }
        this.semesterArray  = semesterArray.reverse();
        for (var i = 0; i < semesterArray.length; i++) {
            this.semesterNameArray.push(semesterArray[i].name);
        }
    }
};



/* In order to display all the events for the past/current/next week,
 * these weeks have to be defined.
 */
var weekutils = {
    lastWeek: undefined,
    currentWeek: undefined,
    nextWeek: undefined,

    // From: https://stackoverflow.com/questions/8381427/get-start-date-and-end-date-of-current-week-week-start-from-monday-and-end-with?rq=1
    startAndEndOfWeek: function () {
        var now = new Date();

        // set time to some convenient value
        now.setHours(0, 0, 0, 0);

        // Get the previous Monday
        var monday = new Date(now);
        monday.setDate(monday.getDate() - monday.getDay() + 1);

        // Get next Sunday
        var sunday = new Date(now);
        sunday.setDate(sunday.getDate() - sunday.getDay() + 7);

        // Return array of date objects
        return {start: monday, end: sunday};
    },

    /*  Upon giving the start year, populate initializes lastWeek, currentWeek, and nextWeek.
     *  Each of these has the following fields:
     *  + start: Date object with week start date
     *  + end: Date object with week end date
     */
    populate: function () {
        this.currentWeek = this.startAndEndOfWeek();
        this.lastWeek = {start: new Date(this.currentWeek.start), end: new Date(this.currentWeek.end)};
        this.nextWeek = {start: new Date(this.currentWeek.start), end: new Date(this.currentWeek.end)};
        this.lastWeek.start.setDate(this.lastWeek.start.getDate() - 7);
        this.lastWeek.end.setDate(this.lastWeek.end.getDate() - 7);
        this.nextWeek.start.setDate(this.nextWeek.start.getDate() + 7);
        this.nextWeek.end.setDate(this.nextWeek.end.getDate() + 7);

    }


};