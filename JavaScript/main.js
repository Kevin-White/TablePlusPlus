var datalength = 0;
var rowlength = 0;
var headerData;
var formOpen = false;
var rowPerPage = 5;


/*
SearchData breaks down the table into cells that
then can be matched to the search critera given
by the user. It will loop through every cell.

If a match is found on one row it will move to
the next.

if not match is found, it will hide the row.

*/
function searchData() {
  let input, filter, table, tr, td, txtValue, matchFound;

  //Intialising Variables
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  table = document.getElementById("myTable");
  tr = table.getElementsByClassName("body");
  matchFound = false;

  //Searches through all columns of every row for matching data
  for (let i = 0; i < tr.length; i++) {
    let rowMatchFound = false;
    for (let j = 0; j < datalength; j++) {
      td = tr[i].cells[j];
      if (td) {
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          rowMatchFound = true;
          break;  // break out of inner loop if match found
        }
      }
    }
    if (rowMatchFound) {
      tr[i].style.display = "";
      tr[i].setAttribute("class", "body inSearch");
      matchFound = true;
    } else {
      tr[i].style.display = "none";
      tr[i].setAttribute("class", "body notInSearch");
    }
  }

  // If no matching rows were found, display a message
  if (!matchFound) {
    document.getElementById("ifNoMatch").innerHTML = "The object you are looking for is not in this list. You can add it by useing the + next to the search bar.";
  } else {
    document.getElementById("ifNoMatch").innerHTML = "";
    tablePagination();
  }
}


/*
UploadData is a driver function

It calls takes the uploaded file from the user, and
Hands the data over to the make table file. That function
returns a HTML table, which is then handed off to the
displayHTMLTable function, this displays the table
made on the HTML frontend
*/
function uploadData() {
  var fileUpload = document.getElementById("fileUpload");

  if (fileUpload.files.length === 0 || !fileUpload.files[0].name.endsWith(".csv")) {
    alert("Please select a CSV file.");
    return;
  }
  //Changes the title of the document to include the name of the file uploaded
  document.title = fileUpload.files[0].name + ' | Table Plus Plus';


  var reader = new FileReader();

  reader.onload = function (e) {
    var table = makeTable(e.target.result);
    displayHTMLTable(table);
  }
  reader.readAsText(fileUpload.files[0]);
}

/*
makeTabel takes the CSV input and converts it to
an HTML and then returns the tabe when it is done

It also adds tags like head and body, to keep track
of the header data and the actual data. As well as 
extra rows for deleting functionality
*/
function makeTable(input) {
  var table = document.createElement("table");
  table.setAttribute("id", "myTable");
  var rows = input.split("\n");
  var lastTouchedRow = false;
  var LTRAdder = 0;

  rowlength = rows.length - 1;
  for (var i = 0; i < rows.length; i++) {
    var cells = rows[i].split(",");
    if (datalength == 0) {
      datalength = cells.length;
      headerData = cells;
      if (headerData[datalength - 1].trim() == "Last Touched") {
        lastTouchedRow = true;
        LTRAdder++;
      }
    }

    if (cells.length > 1) {
      var row = table.insertRow(-1);
      if (i == 0) {
        row.classList.add("head");
      } else {
        row.classList.add("body");
        row.classList.add("inSearch")
      }

      for (var j = 0; j < cells.length - LTRAdder; j++) {
        var cell = row.insertCell(-1);
        if (i == 0) {
          cell.setAttribute("onclick", "sortTable(" + j + ", this)");
          cell.setAttribute("id", "Normal");
          cell.innerHTML = cells[j].trim();
          cell.innerHTML += "<text class=\"sortDisplay\">&updownarrow;</text>";
        } else {
          cell.innerHTML = cells[j].trim();
        }
      }
      timeStampOrHeader(row, cells, i, lastTouchedRow);
      deleteButtonOrCheck(row, i);
      editButtonOrHeader(row, i);
    }
  }
  if (lastTouchedRow) {
    datalength--;
  }
  return table;
}

/*
displayHTMLTable takes a already made html table and finds
the approprate div on the front end in order to append 
the table to
*/
function displayHTMLTable(table) {
  var TableDiv = document.getElementById("TableDiv");
  TableDiv.innerHTML = "";
  TableDiv.appendChild(table);
  tablePagination();
}

/*
This function will recive weather or not the table already has a timestamp.
If the table does not have a timestamp collum, it will create one and add 
the current date.

If the row already has a timestamp, it will read in that data and add the collum to the class
"TimeStamp" for easyer editing by other code.
*/
function timeStampOrHeader(row, cells, i, lastTouchedRow) {
  if (lastTouchedRow) {
    var cell = row.insertCell(-1);
    if (i > 0) {
      cell.innerHTML = cells[datalength - 1].trim();
      cell.setAttribute("class", "TimeStamp");
    } else {
      cell.setAttribute("onclick", "sortTable(" + (datalength - 1) + ", this)");
      cell.setAttribute("id", "Normal");
      cell.innerHTML = cells[datalength - 1].trim();
      cell.innerHTML += "<text class=\"sortDisplay\">&updownarrow;</text>";
    }
  } else {
    if (i > 0) {
      var cell = row.insertCell(-1);
      cell.setAttribute("class", "TimeStamp");

      let yourDate = new Date();
      const offset = yourDate.getTimezoneOffset();
      yourDate = new Date(yourDate.getTime() - (offset * 60 * 1000));

      cell.innerHTML = yourDate.toISOString().split('T')[0];
    } else {
      var cell = row.insertCell(-1);
      cell.innerHTML = "Last Touched";
      cell.setAttribute("onclick", "sortTable(" + datalength + ", this)");
      cell.setAttribute("id", "Normal");
      cell.innerHTML += "<text class=\"sortDisplay\">&updownarrow;</text>";
    }
  }
}

/*
deleteButtonOrCheck will add a delte button to the first
row of data, or a delete check mark in order to let the
user delete rows of data
*/
function deleteButtonOrCheck(row, i) {
  if (i > 0) {
    var cellDelBox = row.insertCell(-1);
    var delcheck = document.createElement("input");
    delcheck.setAttribute("type", "checkbox");
    delcheck.setAttribute("onclick", "selectToggle(this.id)");
    delcheck.setAttribute("id", "check" + i);
  } else {
    var cellDelBox = row.insertCell(-1);
    var delcheck = document.createElement("input");
    delcheck.setAttribute("type", "button");
    delcheck.setAttribute("onclick", "rowDelete()");
    delcheck.setAttribute("value", "Delete Item(s)");
    delcheck.classList.add("deleteButton");
  }
  cellDelBox.appendChild(delcheck);
}


/*
editButtonOrHeader will add an edit button to all rows
in the tabel exept for the first on. These buttons allow
the user to edit the data within the table.

the first row will have a lable named edit
*/
function editButtonOrHeader(row, i) {
  if (i > 0) {
    var cellEditBox = row.insertCell(-1);
    var editButton = document.createElement("input");
    editButton.setAttribute("type", "button");
    editButton.setAttribute("onclick", "editOrSaveRow(this.id)");
    editButton.setAttribute("value", "Edit");
    editButton.setAttribute("id", "editButton" + i);
    editButton.classList.add("editorsaveButton");
    cellEditBox.appendChild(editButton);
  } else {
    var cellEditBox = row.insertCell(-1);
    cellEditBox.innerHTML = "Edit";
  }

}

/*
MakeInputUI is a driver function

Make UI dynamicly creates a form for the user to type
information into and interact with. Once the user 
selects the "Add Item" Button the new data form the form
is appended to the data uploaded by the user.
*/
function makeInputUI() {
  if (!formOpen) {

    formOpen = true;
    var form = document.createElement("form");
    form.setAttribute("method", "post");


    rowInputForm(form);

    document.getElementById("FormDiv").appendChild(form);
    document.getElementById("AddItem").value = "-";
  } else {
    formOpen = false;
    document.getElementById("FormDiv").innerHTML = "";
    document.getElementById("AddItem").value = "Add Item";
  }
}

/*
RowInputForm creates a dynamic form that uses the 
schama uploaded by the user. so this form is dynamic
and fits to all the different data the user can upload.
*/
function rowInputForm(form) {

  //Creates a submin button
  var formButton = document.createElement("input");
  formButton.setAttribute("type", "button");
  formButton.setAttribute("value", "Add Item");
  formButton.setAttribute("onclick", "addRow()");
  formButton.classList.add("custom-file-upload");
  form.append(formButton);
  
  form.append(document.createElement("br"));
  //This creates a input box for every single header item
  for (let i = 0; i < datalength; i++) {
    var formCreate = document.createElement("input");
    formCreate.setAttribute("type", "text");
    formCreate.setAttribute("placeholder", headerData[i]);
    formCreate.classList.add("dynamicForm");
    form.append(formCreate);
  }

  
}


/*
AddRow is a driver function

AddRow function reads from the dynamic form in order
to add a new row of data. This row is appended to the 
bottom of the preexisting data, and can be downloaded
along with the rest of the data.
*/
function addRow() {

  var formInfo = document.getElementsByClassName("dynamicForm");

  //Takes data from form and adds it to cells
  var table = document.getElementById("myTable");
  var row = table.insertRow(-1);
  row.classList.add("body");
  row.classList.add("inSearch");
  for (var i = 0; i < datalength; i++) {
    var cell = row.insertCell(-1);
    cell.innerHTML = formInfo[i].value;
  }

  //Creates one more cell, with a delete button
  timeStampOrHeader(row, null, rowlength, false);
  deleteButtonOrCheck(row, rowlength);
  editButtonOrHeader(row, rowlength);
  rowlength++;

  //Appends newly created row and cells to the table
  var TableDiv = document.getElementById("TableDiv");
  TableDiv.innerHTML = "";
  TableDiv.appendChild(table);
}

/*
selectToggle Toggles weather or not a row has been selected for
deletion by the user
*/
function selectToggle(id) {
  var check = document.getElementById(id);
  if (check.classList.contains("selected")) {
    check.classList.remove("selected");
  } else {
    check.classList.add("selected");
  }
}

/*
rowDelete recersevlly looks at all items selected for deletion
then deletes the row from the database
*/
function rowDelete() {
  var rows = document.getElementsByClassName("selected");
  rows[0].parentNode.parentNode.remove();
  rowDelete();
}

/*
editOrSave is a driver function 

this allows the user to toggle the edit and save button 
for a row. When the user selects edit, they can now interact
with the text in the row. When the user clicks save the
text within the row, is saved, and can no longer be edited
by the user.

When the save button is clicked is changes the timestamp for the current row
to todays date.
*/
function editOrSaveRow(id) {
  var selectedButton = document.getElementById(id);
  if (selectedButton.value == "Edit") {
    editRow(id);
    editToSave(selectedButton);
  } else {
    saveRow(id);
    saveToEdit(selectedButton);
    var testing = selectedButton.parentNode.parentNode;
    var timeStamp = testing.getElementsByClassName("TimeStamp");
    let yourDate = new Date();
    const offset = yourDate.getTimezoneOffset();
    yourDate = new Date(yourDate.getTime() - (offset * 60 * 1000));
    timeStamp[0].innerHTML = yourDate.toISOString().split('T')[0];
  }
}

/*
The editRow function turns all of the text inside of the
current table cells into text boxes with data you can
change and edit
*/
function editRow(id) {
  var selectedButton = document.getElementById(id);
  var selectedRow = selectedButton.parentNode.parentNode;
  var selectedCells = selectedRow.getElementsByTagName("td");

  for (var i = 0; i < datalength; i++) {
    var temp = selectedCells[i].innerHTML;
    selectedCells[i].innerHTML = "<input type='text' id='" + headerData[i] + "' value='" + temp + "'>";
  }
}

/*
editToSave will change the value of the edit 
button to a save button
*/
function editToSave(selectedButton) {
  selectedButton.setAttribute("value", "Save");
}

/*
The saveRow function will change all fo the editable
text boxes into reguler text, within the cells of the
table.
*/
function saveRow(id) {
  var selectedButton = document.getElementById(id);
  var selectedRow = selectedButton.parentNode.parentNode;
  var selectedInputs = selectedRow.getElementsByTagName("input");
  var selectedCells = selectedRow.getElementsByTagName("td");
  for (var i = 0; i < datalength; i++) {
    var temp = selectedInputs[0].value;
    selectedCells[i].innerHTML = temp;
  }
}

/*
saveToEdit will change the value of the save
button to a edit button
*/
function saveToEdit(selectedButton) {
  selectedButton.setAttribute("value", "Edit");
}


/*
The sortTable page will let he user click the headers of each
collum in order to sort the collum in assending or dessending order.
If the collum is being clicked for the first time is sorts in assending
order. For the second click is the collum is sorted in decsending 
order.

If another colum is areay sorted, the sort functionality is reset. 
As if a sort was never applied to that collum.
*/
function sortTable(rowNumber, header) {
  var table, rows, switching, i, x, y, shouldSwitch, otherHeaders;
  table = document.getElementById("myTable");
  switching = true;

  if (header.id == "Normal" || header.id == "Dessending") {
    while (otherHeaders = document.getElementById("Assending")) {
      otherHeaders.setAttribute("id", "Normal");
      var display = otherHeaders.getElementsByTagName("text");
      display[0].innerHTML = "&updownarrow;";
    }
    while (otherHeaders = document.getElementById("Dessending")) {
      otherHeaders.setAttribute("id", "Normal");
      var display = otherHeaders.getElementsByTagName("text");
      display[0].innerHTML = "&updownarrow;";
    }
    header.setAttribute("id", "Assending");
    var display = header.getElementsByTagName("text");
    display[0].innerHTML = "&ShortUpArrow;";


    while (switching) {
      switching = false;
      rows = table.rows;


      for (i = 1; i < (rows.length - 1); i++) {
        shouldSwitch = false;

        x = rows[i].getElementsByTagName("TD")[rowNumber];
        y = rows[i + 1].getElementsByTagName("TD")[rowNumber];
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          shouldSwitch = true;
          break;
        }
      }
      if (shouldSwitch) {
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
      }
    }
  }
  else if (header.id == "Assending") {
    while (otherHeaders = document.getElementById("Assending")) {
      otherHeaders.setAttribute("id", "Normal");
      var display = otherHeaders.getElementsByTagName("text");
      display[0].innerHTML = "&updownarrow;";
    }
    while (otherHeaders = document.getElementById("Dessending")) {
      otherHeaders.setAttribute("id", "Normal");
      var display = otherHeaders.getElementsByTagName("text");
      display[0].innerHTML = "&updownarrow;";
    }
    header.setAttribute("id", "Dessending");
    var display = header.getElementsByTagName("text");
    display[0].innerHTML = "&ShortDownArrow;";

    while (switching) {
      switching = false;
      rows = table.rows;


      for (i = 1; i < (rows.length - 1); i++) {
        shouldSwitch = false;

        x = rows[i + 1].getElementsByTagName("TD")[rowNumber];
        y = rows[i].getElementsByTagName("TD")[rowNumber];
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          shouldSwitch = true;
          break;
        }
      }
      if (shouldSwitch) {
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
      }
    }
  }
  tablePagination();
}


//Got code bellow from GeeksForGeeks 
//https://www.geeksforgeeks.org/how-to-export-html-table-to-csv-using-javascript/
function tableToCSV() {

  // Variable to store the final csv data
  var csv_data = [];

  // Get each row data
  var rows = document.getElementsByTagName('tr');
  for (var i = 0; i < rows.length; i++) {

    // Get each column data
    var cols = rows[i].querySelectorAll('td,th');

    // Stores each csv row data
    var csvrow = [];
    for (var j = 0; j < cols.length - 2; j++) {

      // Get the text data of each cell
      // of a row and push it to csvrow
      // Will also elimnate any extra HTML from the cells
      if (cols[j].innerHTML.substring(0, cols[j].innerHTML.indexOf('<')) == "") {
        csvrow.push(cols[j].innerHTML);
      } else {
        csvrow.push(cols[j].innerHTML.substring(0, cols[j].innerHTML.indexOf('<')));
      }

    }

    // Combine each column value with comma
    csv_data.push(csvrow.join(","));
  }

  // Combine each row data with new line character
  csv_data = csv_data.join('\n');

  // Call this function to download csv file 
  downloadCSVFile(csv_data);

}

function downloadCSVFile(csv_data) {

  // Create CSV file object and feed
  // our csv_data into it
  CSVFile = new Blob([csv_data], {
    type: "text/csv"
  });

  // Create to temporary link to initiate
  // download process
  var temp_link = document.createElement('a');

  // Download csv file
  temp_link.download = "GfG.csv";
  var url = window.URL.createObjectURL(CSVFile);
  temp_link.href = url;

  // This link should not be displayed
  temp_link.style.display = "none";
  document.body.appendChild(temp_link);

  // Automatically click the link to
  // trigger download
  temp_link.click();
  document.body.removeChild(temp_link);
}
//End of code used from GeeksForGeeks 


/*
The tablePagination function alows the user the option to
break up the table into smaller sections in order to make
for easyer readability. This also alows for the user to
switch between pages to more ealsy filter though larger
databases.
*/
function tablePagination() {
  var table = document.querySelector('#myTable');
  if (!table) {
    return;
  }
  var tbody = table.querySelector('tbody');
  var rows = Array.from(tbody.querySelectorAll('tr.inSearch'));
  var itemsPerPage = rowPerPage;
  var numPages = Math.ceil(rows.length / itemsPerPage);
  let currentPage = 1;

  /*
    This function displayes the current page of the table
    while hiding the rest from the user. only if the pages
    are also within the scope of the search the user may
    preform
  */
  function showPage(page) {
    currentPage = page;
    var start = (page - 1) * itemsPerPage;
    var end = parseInt(start) + parseInt(rowPerPage);
    rows.forEach((row, index) => {
      if (index >= start && index < end && row.classList.contains('inSearch')) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
    updatePagination();
  }


  /*
  the updatePagination button keeps track of what page
  the user is on and if there is a page before or after
  the current page.
  */
  function updatePagination() {
    var pages = document.querySelector('#pages');
    var prevBtn = document.querySelector('#prev');
    var nextBtn = document.querySelector('#next');
    pages.textContent = `${currentPage} / ${numPages}`;
    if (currentPage === 1) {
      prevBtn.disabled = true;
    } else {
      prevBtn.disabled = false;
    }
    if (currentPage === numPages) {
      nextBtn.disabled = true;
    } else {
      nextBtn.disabled = false;
    }
  }

  //This function moves the user to the previs page if available
  function prevPage() {
    if (currentPage > 1) {
      showPage(currentPage - 1);
    }
  }

  //This function moves the user to the next page if available
  function nextPage() {
    if (currentPage < numPages) {
      showPage(currentPage + 1);
    }
  }

  showPage(currentPage);
  document.querySelector('#prev').addEventListener('click', prevPage);
  document.querySelector('#next').addEventListener('click', nextPage);
}

function pagingInput(value) {
  rowPerPage = value;
  tablePagination();
}
