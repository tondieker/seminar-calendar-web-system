/* The writerutils variable contains all functions that are needed to write to the page.
*  If a webmaster wants to use his/her own formatting, this file can be used as a template. */

var writerutils = {
    // adds links to the input text
    // see https://stackoverflow.com/questions/1500260/detect-urls-in-text-with-javascript
    linkify: function (text) {
        var urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
        return text.replace(urlRegex, function (url) {
            return '<a href="' + url + '">' + url + '</a>';
        });
    },


    printEventArray_plain: function (eventArray, div) {
        function appendHeader(message, headertag, div) {
            var header = document.createElement(headertag);
            header.innerHTML = message;
            div.appendChild(header);
        }

        function appendText(message, div) {
            var newDiv = document.createElement("div");
            newDiv.id = 'myDiv';
            newDiv.innerHTML = message;
            div.appendChild(newDiv);
        }

        for (i = 0; i < eventArray.length; i++) {
            var event = eventArray[i];

            appendHeader(event.speaker + ': <i>' + this.linkify(event.title) + '</i>', 'h3', div);
            if (!event.is_all_day) {
                appendText('<b>Time: ' + event.date + ', ' + event.starttime + ' - ' + event.endtime + '</b>', div);
            }
            if (typeof event.location === "undefined") {
                appendText('<b>Location: </b>TBA', div);
            } else {
                appendText('<b>Location: ' + event.location + '</b>', div);
            }
            appendText('<br>', div);
            if (typeof event.unformatted !== "undefined") {
                appendText(this.linkify(event.unformatted), div);
                appendText('<br>', div);
            }
            if (typeof event.abstract !== "undefined") {
                appendText('<b>Abstract:</b> ' + this.linkify(event.abstract), div);
                appendText('<br>', div);
            }
            if (typeof event.bio !== "undefined") {
                appendText('<b>Bio:</b> ' + this.linkify(event.bio), div);
                appendText('<br>', div);
            }
        }
    },


    printEventArray_table1: function (eventArray, tbl) {
        if (eventArray.length) {
            var tblHeader = document.createElement('thead');
            var th1 = document.createElement('th');
            var text1 = document.createTextNode('Date, time, location');
            th1.setAttribute("width", "13%");
            var th2 = document.createElement('th');
            var text2 = document.createTextNode('Speaker, title, bio, abstract');
            th2.setAttribute("width", "87%");
            tblHeader.appendChild(th1).appendChild(text1);
            tblHeader.appendChild(th2).appendChild(text2);
            tbl.appendChild(tblHeader);
        }

        var tblBody = document.createElement('tbody');
        for (i = 0; i < eventArray.length; i++) {
            var event = eventArray[i];

            var column1 = document.createElement('td');
            var column2 = document.createElement('td');

            var date = document.createElement('p');
            date.innerHTML = event.date;
            column1.appendChild(date);

            if (!event.is_all_day) {
                var time = document.createElement('p');
                time.innerHTML = event.starttime + ' - ' + event.endtime;
                column1.appendChild(time);
            }

            var room = document.createElement('p');
            if (typeof event.location !== "undefined") {
                room.innerHTML = 'Room: ' + event.location;
            } else {
                room.innerHTML = 'Room: TBA';
            }
            column1.appendChild(room);

            var speaker = document.createElement('p');
            speaker.innerHTML = "<b>Speaker:</b> " + event.speaker;
            column2.appendChild(speaker);

            var title = document.createElement('p');
            if (typeof event.title !== "undefined") {
                title.innerHTML = "<b>Title:</b> " + this.linkify(event.title);
            } else {
                title.innerHTML = "<b>Title:</b> TBA";
            }
            column2.appendChild(title);

            var abstract = document.createElement('p');
            if (typeof event.abstract !== "undefined") {
                abstract.innerHTML = "<b>Abstract:</b> " + this.linkify(event.abstract);
                column2.appendChild(abstract);
            }

            var bio = document.createElement('p');
            if (typeof event.bio !== "undefined") {
                bio.innerHTML = "<b>Bio:</b> " + this.linkify(event.bio);
                column2.appendChild(bio);
            }

            var unformatted = document.createElement('p');
            if (typeof event.unformatted !== "undefined") {
                unformatted.innerHTML = this.linkify(event.unformatted);
                column2.appendChild(unformatted);
            }

            var tr = document.createElement('tr');
            tr.appendChild(column1);
            tr.appendChild(column2);

            tblBody.appendChild(tr);
        }
        tbl.appendChild(tblBody);
        tbl.setAttribute("border", "2");
    },


    printEventArray_table2: function (eventArray, tbl) {
        date_array = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
        month_array = ["January", "February", "March", "April", "May", "June", "July",
            "August", "September", "October", "November", "December"];
        default_location = "520 Math";

        if (eventArray.length) {
            var tblHeader = document.createElement('thead');
            var th1 = document.createElement('th');
            var text1 = document.createTextNode('Date and Time');
            th1.setAttribute("width", "18%");
            var th2 = document.createElement('th');
            var text2 = document.createTextNode('Speaker');
            th2.setAttribute("width", "25%");
            var th3 = document.createElement('th');
            var text3 = document.createTextNode('Title');
            th3.setAttribute("width", "57%");

            tblHeader.appendChild(th1).appendChild(text1);
            tblHeader.appendChild(th2).appendChild(text2);
            tblHeader.appendChild(th3).appendChild(text3);
            tbl.appendChild(tblHeader);
        }

        var tblBody = document.createElement('tbody');
        for (i = 0; i < eventArray.length; i++) {
            var event = eventArray[i];

            var col1 = document.createElement('td');
            var col2 = document.createElement('td');
            var col3 = document.createElement('td');

            date_tmp = new Date(event.date);
            date_str = date_array[date_tmp.getDay()] + ', ' + month_array[date_tmp.getMonth()] + ' ' + date_tmp.getDate();
            str = date_str;
            if (!event.is_all_day) {
                str = str + '<br/>';
                str = str + event.starttime + ' to ' + event.endtime;
            }
            if (typeof event.location !== "undefined" && event.location && event.location != default_location) {
                str = str + '<br/>' + event.location;
            }

            col1.innerHTML = str;

            col2.innerHTML = event.speaker;

            var title = document.createElement('p');
            if (typeof event.title !== "undefined" && event.title) {
                tstr = '<b>' + this.linkify(event.title) + '</b><br/>';
            } else {
                tstr = '<b>TBA</b><br/>';
            }
            if (typeof event.unformatted !== "undefined" && event.unformatted) {
                tstr = tstr + this.linkify(event.unformatted);
                tstr = tstr + '<br/>';
            }
            if (typeof event.abstract !== "undefined" && event.abstract) {
                tstr = tstr + this.linkify(event.abstract);
            }
            col3.innerHTML = tstr;

            var tr = document.createElement('tr');
            tr.appendChild(col1);
            tr.appendChild(col2);
            tr.appendChild(col3);
            tblBody.appendChild(tr);
        }
        tbl.appendChild(tblBody);
    }
};
