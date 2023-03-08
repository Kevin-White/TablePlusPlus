var datalength = 0;
var rowlength = 0;
var headerData;
var formOpen = false;


/*
SearchData breaks down the table into cells that
then can be matched to the search critera given
by the user. It will loop through every cell.

If a match is found on one row it will move to
the next.

if not match is found, it will hide the row.

*/
function SearchData() {
  let input, filter, table, tr, td, txtValue;

  //Intialising Variables
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  table = document.getElementById("myTable");
  tr = table.getElementsByClassName("body");

  //Searches through all columns of every row for matching data
  for (let i = 0; i < tr.length; i++) {
      for (let j = 0; j < datalength; j++) {
          td = tr[i].cells[j];
          if (td) {
              txtValue = td.textContent || td.innerText;
              if (txtValue.toUpperCase().indexOf(filter) > -1) {
                  tr[i].style.display = "";
                  break;  // break out of inner loop if match found
              } else {
                  tr[i].style.display = "none";
              }
          }
      }
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
function UploadData() {
  var fileUpload = document.getElementById("fileUpload");

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

  rowlength = rows.length - 1;
  for (var i = 0; i < rows.length; i++) {
      var cells = rows[i].split(",");
      if (datalength == 0) {
          datalength = cells.length;
          headerData = cells;
      }

      if (cells.length > 1) {
          var row = table.insertRow(-1);
          if (i == 0) {
              row.classList.add("head");
          } else {
              row.classList.add("body");
          }

          for (var j = 0; j < cells.length; j++) {
              var cell = row.insertCell(-1);
              cell.innerHTML = cells[j];
          }

        deleteButtonOrCheck(row, i);      
      }
  }
  return table;
}

/*
displayHTMLTable takes a already made html table and finds
the approprate div on the front end in order to append 
the table to
*/
function displayHTMLTable(table){
  var TableDiv = document.getElementById("TableDiv");
  TableDiv.innerHTML = "";
  TableDiv.appendChild(table);
}

/*
deleteButtonOrCheck will add a delte button to the first
row of data, or a delete check mark in order to let the
user delete rows of data
*/
function deleteButtonOrCheck(row, i){
    if(i > 0){
      var cellDelBox = row.insertCell(-1);
      var delcheck = document.createElement("input");
      delcheck.setAttribute("type", "checkbox");
      delcheck.setAttribute("onclick", "selectToggle(this.id)");
      delcheck.setAttribute("id", "check" + i);
    }else{
      var cellDelBox = row.insertCell(-1);
      var delcheck = document.createElement("input");
      delcheck.setAttribute("type", "button");
      delcheck.setAttribute("onclick", "rowDelete()");
      delcheck.setAttribute("value", "Delete Item(s)");
    }
    cellDelBox.appendChild(delcheck);
  }

/*
MakeInputUI is a driver function

it allows the user to create a form, 
and appends it to the proper div
*/
function MakeInputUI() {
  if (!formOpen) {

    formOpen = true;
    var form = document.createElement("form");
    form.setAttribute("method", "post");

    
    RowInputForm(form);

    document.getElementById("FormDiv").appendChild(form);
  }else{
    formOpen = false;
    document.getElementById("FormDiv").innerHTML = "";
  }
}

/*
RowInputForm creates a dynamic form, that the
user can submit inorder to add a row
*/
function RowInputForm(form){
  //This creates a input box for every single header item
  for (let i = 0; i < datalength; i++) {
    var formCreate = document.createElement("input");
    formCreate.setAttribute("type", "text");
    formCreate.setAttribute("placeholder", headerData[i]);
    formCreate.classList.add("dynamicForm");
    form.append(formCreate);
  }
  
  //Creates a submin button
  var formButton = document.createElement("input");
  formButton.setAttribute("type", "button");
  formButton.setAttribute("value", "Add Item");
  formButton.setAttribute("onclick", "AddRow()");
  form.append(formButton);
}


/*
AddRow is a driver function

AddRow function reads from the dynamic form in order
to add a new row of data, that can then be downloaded
with the preexisting items in the form
*/
function AddRow() {

  var formInfo = document.getElementsByClassName("dynamicForm");
  
  //Takes data from form and adds it to cells
  var table = document.getElementById("myTable");
  var row = table.insertRow(-1);
  row.classList.add("body");
  for (var i = 0; i < datalength; i++) {
    var cell = row.insertCell(-1);
    cell.innerHTML = formInfo[i].value;
  }

  //Creates one more cell, with a delete button
  deleteButtonOrCheck(row, rowlength);
  rowlength++;

  //Appends newly created row and cells to the table
  var TableDiv = document.getElementById("TableDiv");
  TableDiv.innerHTML = "";
  TableDiv.appendChild(table);
}

/*
selectToggle Toggles wiether or not a row has been selected for
deletion by the user
*/
function selectToggle(id){
  var check = document.getElementById(id);
  if(check.classList.contains("selected")){
    check.classList.remove("selected");
  }else{
    check.classList.add("selected");
  }
}

/*
rowDelete recersevlly looks at all items selected for deletion
then deletes the row from the database
*/
function rowDelete(){
  var rows = document.getElementsByClassName("selected");
  rows[0].parentNode.parentNode.remove();
  rowDelete();
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
      for (var j = 0; j < cols.length-1; j++) {

          // Get the text data of each cell
          // of a row and push it to csvrow
          csvrow.push(cols[j].innerHTML);
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