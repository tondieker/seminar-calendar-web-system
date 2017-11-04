/*
    "API" for the interface with Google calendar

    The "calendarquery" function:

    Arguments:
    - databaseID; this is a string from Google that identifies the calendar from which the data is pulled
    - start date: Date object that determines the start date and time of the events to be listed
    - end date: Date object that determines the end date and time of the events to be listed
    - direction: string equal to either 'ascending' or 'descending'.

    Returns: a promise for an array of events, each of which has the following fields:
    - speaker: string with speaker name plus affiliation
    - date: string with the date
    - starttime: string with the start time of the talk
    - endtime: string with the end time of the talk
    - location: string with the location of the talk
    - title: string with the title of the talk
    - abstract: string with the abstract of the talk
    - bio: string with the bio of the speaker
    - unformatted: string of text associated to the talk but which could not be classified as abstract or bio

    Some of these fields may be undefined if they are not defined in the calender entry.
    For instance, if the calendar entry contains both "Abstract:" and "Bio:", then unformatted is undefined.
*/



var API_KEY = 'AIzaSyDQWtAjCgeSxLEd19-h5lRRok2cIladzHI';
var timeZone = 'America/New_York';


function parseEvent(event) {
    var description = parseDescription(event.description);
    var is_all_day = (typeof event.start.date !== "undefined");
    var date = (new Date(event.start.dateTime)).toLocaleDateString([], {
        timeZone: timeZone
    });
    var end_date = date;
    if (is_all_day) {
        // These are in the time zone of the calendar
        date = event.start.date;
	    end_date = event.end.date;
    }
    return {
        speaker: event.summary,
        location: event.location,
        date: date,
        end_date: end_date,
        starttime: (new Date(event.start.dateTime)).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            timeZone: timeZone
        }),
        endtime: (new Date(event.end.dateTime)).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            timeZone: timeZone
        }),
        title: description.title,
        abstract: description.abstract,
        bio: description.bio,
        unformatted: description.unformatted,
        is_all_day: is_all_day
    }
}

//several formats are allowable:
//Title: ..., then rest text which is is copied unformatted
//Title: ..., Abstract: ..., Bio: ...
function parseDescription(message) {
    if (typeof message === "undefined") {
        return {
            title: "TBA"
        };
    }

    var titleIndex = message.trim().indexOf("Title:");
    var abstractIndex = message.indexOf("Abstract:");
    var bioIndex = message.indexOf("Bio:");

    var titleString;
    var abstractString;
    var bioString;

    // first see if there is a title, abstract, and bio
    if (titleIndex === 0 && abstractIndex >= 0 && bioIndex >= 0) {
        titleString = message.substring(titleIndex, abstractIndex).replace("Title:", "");
        abstractString = message.substring(abstractIndex, bioIndex).replace("Abstract:", "");
        bioString = message.substring(bioIndex).replace("Bio:", "");

        return {
            title: titleString.trim(),
            abstract: abstractString.trim().replace(/(?:\r\n|\r|\n)/g, '<br />'),
            bio: bioString.trim().replace(/(?:\r\n|\r|\n)/g, '<br />')
        };
    }

    // next try if there is a title and abstract but no bio
    if (titleIndex === 0 && abstractIndex >= 0) {
        titleString = message.substring(titleIndex, abstractIndex).replace("Title:", "");
        abstractString = message.substring(abstractIndex).replace("Abstract:", "");

        return {
            title: titleString.trim(),
            abstract: abstractString.trim().replace(/(?:\r\n|\r|\n)/g, '<br />')
        };
    }

    // default: interpret the first line as the title (remove "Title:" if necessary)
    var splittedMessage = message.trim().split('\n');
    titleString = splittedMessage[0];
    if (titleIndex >= 0) {
        titleString = titleString.replace("Title:", "");
    }
    abstractString = splittedMessage.slice(1).join('\n').trim();
    if (abstractString.indexOf("Abstract:") === 0) {
        abstractString = abstractString.replace("Abstract:", "");
        var abstractPresent = true;
    }
    if (abstractPresent) {
        return {
            title: titleString.trim(),
            abstract: abstractString.trim().replace(/(?:\r\n|\r|\n)/g, '<br />'),
        };
    } else {
        return {
            title: titleString.trim(),
            unformatted: abstractString.trim().replace(/(?:\r\n|\r|\n)/g, '<br />'),
        };
    }
}


function calendarquery(databaseID, dateStart, dateEnd, order) {
    return gapi.client.calendar.events.list({
        'calendarId': databaseID,
        'timeMin': dateStart.toISOString(),
        'timeMax': dateEnd.toISOString(),
        'timeZone': timeZone,
        'showDeleted': false,
        'singleEvents': true,
        'orderBy': 'startTime'
    }).then(function (response) {
        var events = response.result.items;
        var res = [];
        if (order === 'descending') {
            for (i = events.length - 1; i >= 0; i--) {
                res.push(parseEvent(events[i]));
            }
        } else {
            for (i = 0; i < events.length; i++) {
                res.push(parseEvent(events[i]));
            }
        }
        return res;
    });
}

