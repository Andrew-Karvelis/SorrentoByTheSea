/*creating an array for the months available in the calendar and the array will start at 0 (January)*/
var dateIndex = 0;
var monthsNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/*placeholder for when you click the dates that adds the bookings together*/
let bookingDates = [];

function navigateCalendar(x){
	deleteCalendar(dateIndex);
	sortDates();
	getDates(dateIndex += x);
}

/* x will reset to 0 if it is greater than 11
   x will reset to 11 if it is less than 0
   0 is January and 11 is December in the array */
function getDates(x){
	sortDates();
	if(x > 11){
	  x=0;
	}

	if(x < 0){
	  x=11;
	}

/* declaring date variables by setting a new date. (Year: 2020, Month: x + 1, Day: 0) The x in month is the variable stored in the getDates(x) function */
    var month = new Date(2020, x + 1, 0).getMonth();
    var days = new Date(2020, x + 1, 0).getDate();
    var dayValue = new Date(2020, x + 1, 0).getDay();

    var table = document.getElementById("calendar");
    document.getElementById("dateCaption").innerHTML = monthsNames[x];

    let j = 0;
    let k = 0;
    for(let i = 0; i < days; i++){

	/*each row in the calendar has 7 days so we are using modulo 7 to determine at what point will 7 be divisible by 1
        while it still equals 0, the dates will continue to add along the row*/
        if(i % 7 == 0){
            row = table.insertRow(j);
            j++
            k = 0;
        }

        let cell = row.insertCell(k);
        cell.setAttribute("id", `${i + 1}_${month + 1}`);
        cell.setAttribute("onclick", "selectDate(this.id)");
        document.getElementById(cell.id).style.backgroundColor = "white";
        cell.innerHTML = i + 1;
        k++;    

        dateIndex = x;
    } 

    findSelected(days);

    return document.getElementById("calendar").rows.length;
}

/*When a date is selected, the value of dateindex will increase, which will tell the boolean datatype that selected = true*/
function selectDate(dateValue){
    let selected = false;
    sortDates();
    
    let dateIndex = binarySearch(dateValue, true);

    if(dateIndex > -1){
        selected = true;
    }

    if(!selected){
        addDate(dateValue);
    }
    else{
        bookingDates.splice(dateIndex, 1);
        document.getElementById(dateValue).style.backgroundColor = "white";
    }

    sortDates();
    addPrice();
    
}

/* Calculating the prices */
function addDate(dateValue){
    let dates = dateValue.split("_");     
    /*from June to december 18th, the price will be 200*/
    /*from December 19th to January, the price will be 250*/
    /*All other dates, the price will be 220*/
    if(dates[1] == 6 || dates[1] == 7 || dates[1] == 8 || dates[1] == 9 || dates[1] == 10 
    || dates[1] == 11 || (dates[1] == 12 && dates[0] <= 18)){
        bookingDates.push(new bookingDate(dates[1], dates[0], 200));
    }
    else if((dates[1] == 12 && dates[0] >=19) || dates[1] == 1){
        bookingDates.push(new bookingDate(dates[1], dates[0], 250));
    }
    else{
        bookingDates.push(new bookingDate(dates[1], dates[0], 220));
    }
    /*highlights selected dates*/
    document.getElementById(dateValue).style.backgroundColor = "lightblue";
}
/*whenever the user click to move on to the next or previous month, it will delete the calendar from view and load up the next month*/
function deleteCalendar(dateIndex){
    let table = document.getElementById('calendar');
    var days = new Date(2020, dateIndex + 1, 0).getDate(); 

    for(let i = 0; i < days; i++){
        console.log(`${i + 1}_${dateIndex + 1}`);
        if(document.getElementById(`${i + 1}_${dateIndex + 1}`).getAttribute("onclick") != null){
            document.getElementById(`${i + 1}_${dateIndex + 1}`).removeAttribute("onclick");
        }
        
    }

    for(let i = 4; i >= 0; i--){
        table.deleteRow(i);
    }
    return document.getElementById("calendar").rows.length;
}

function sortDates(){
    bookingDates.sort(function(x, y) {
        let xdays = parseInt(x.day);
        let ydays = parseInt(y.day);
        let xmonth = parseInt(x.month);
        let ymonth = parseInt(y.month);

        if(xmonth == ymonth)
        {
            return (xdays < ydays) ? -1 : (xdays > ydays) ? 1 : 0;
        }
        else
        {
            return (xmonth < ymonth) ? -1 : 1;
        }
    });
}

/*function adds and holds the dates together*/
function bookingDate(month, day, price){
    this.month = month;
    this.day = day;
    this.price = price;
}


/*dateValue is a string and needsSort is a boolean*/
function binarySearch(dateValue, needsSort){
    if(needsSort){
        sortDates(); 
    }
    
    let dates = dateValue.split("_");
/*parsing the dates variable as an integer so that it can be access by the binary search*/
    dates[0] = parseInt(dates[0]);
    dates[1] = parseInt(dates[1]);
    let first = 0;
    let last = bookingDates.length - 1;
    
    while(first <= last){
        let mid = Math.floor((first + last) / 2);

        if(bookingDates[mid].day == dates[0] && bookingDates[mid].month == dates[1]){
            console.log(`${bookingDates[mid].day}, ${bookingDates[mid].month} `)
            return mid;
        }
        else if(bookingDates[mid].day < dates[0] || bookingDates[mid].month < dates[1]){
            first = mid + 1;
        }
        else if(bookingDates[mid].day < dates[0] || bookingDates[mid].month > dates[1]){
            last = mid - 1;
        }
        else if(bookingDates[mid].day > dates[0] || bookingDates[mid].month < dates[1]){
            first = mid + 1;
        }
        else if(bookingDates[mid].day > dates[0] || bookingDates[mid].month > dates[1]){
            last = mid - 1;
        }
    }
    return - 1;
    
}


/*Uses binary search to highlight dates selected by the user*/
function findSelected(days){

    for(let i = 0; i < days; i++){
        let dateCell = binarySearch(`${i + 1}_${dateIndex + 1}`, true);

        if(dateCell > -1){
        document.getElementById(`${i + 1}_${dateIndex + 1}`).style.backgroundColor = "lightblue";
        }
    }
    
}

/*Sums all dates selected and displays the total price*/
function addPrice(){
    let total = 0;
    for(let i = 0; i < bookingDates.length; i++){
        total += bookingDates[i].price;
    }

    document.getElementById("totalPrice").innerHTML = `Total Price = $${total}`;

    return total;
}