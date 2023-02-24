var datalength = 0;
var rowlength = 0;
var headerData;
var formOpen = false;


function tableSearch() {
    let input, filter, table, tr, td, txtValue;

    //Intialising Variables
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("myTable");
    tr = table.getElementsByClassName("body");
    for (let i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0];
        if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }

}

function Upload() {
    var fileUpload = document.getElementById("fileUpload");
        var reader = new FileReader();
        reader.onload = function (e) {
          var table = document.createElement("table");
          table.setAttribute("id", "myTable")
          var rows = e.target.result.split("\n");
          rowlength = rows.length - 1;
          for (var i = 0; i < rows.length; i++) {
            var cells = rows[i].split(",");
            if(datalength == 0){
              datalength = cells.length;
              headerData = cells;
            }
            if (cells.length > 1) {
              var row = table.insertRow(-1);
              if(i == 0){
                row.classList.add("head");
              }else{
                row.classList.add("body");
              }
              for (var j = 0; j < cells.length; j++) {
                var cell = row.insertCell(-1);
                cell.innerHTML = cells[j];
              }
              if(i > 0){
                var cellDelBox = row.insertCell(-1);
                var delcheck = document.createElement("input");
                delcheck.setAttribute("type", "checkbox");
                delcheck.setAttribute("onclick", "selectToggle(this.id)");
                delcheck.setAttribute("id", "check" + i);
                cellDelBox.appendChild(delcheck);
              }else{
                var cellDelBox = row.insertCell(-1);
                var delcheck = document.createElement("input");
                delcheck.setAttribute("type", "button");
                delcheck.setAttribute("onclick", "rowDelete()");
                delcheck.setAttribute("value", "Delete Item(s)");
                cellDelBox.appendChild(delcheck);
              }
            }
          }
          var TableDiv = document.getElementById("TableDiv");
          TableDiv.innerHTML = "";
          TableDiv.appendChild(table);
        }
        reader.readAsText(fileUpload.files[0]);
  }

function ToggleForm() {
  if (!formOpen) {

    formOpen = true;
    var form = document.createElement("form");
    form.setAttribute("method", "post");
    form.setAttribute("action", "submit.php");

    for (let i = 0; i < datalength; i++) {
      var formCreate = document.createElement("input");
      formCreate.setAttribute("type", "text");
      formCreate.setAttribute("placeholder", headerData[i]);
      formCreate.classList.add("dynamicForm");
      form.append(formCreate);
    }

    var formButton = document.createElement("input");
    formButton.setAttribute("type", "button");
    formButton.setAttribute("value", "Add Item");
    formButton.setAttribute("onclick", "AddData()");
    form.append(formButton);

    document.getElementById("FormDiv").appendChild(form);
  }else{
    formOpen = false;
    document.getElementById("FormDiv").innerHTML = "";
  }
}

function AddData() {

  var formInfo = document.getElementsByClassName("dynamicForm");

  var table = document.getElementById("myTable");
  var row = table.insertRow(-1);
  row.classList.add("body");
  for (var i = 0; i < datalength; i++) {
    var cell = row.insertCell(-1);
    cell.innerHTML = formInfo[i].value;
  }
  var cellDelBox = row.insertCell(-1);
  var delcheck = document.createElement("input");
  delcheck.setAttribute("type", "checkbox");
  delcheck.setAttribute("onclick", "selectToggle(this.id)");
  delcheck.setAttribute("id", "check" + rowlength);
  rowlength++;
  cellDelBox.appendChild(delcheck);

  var TableDiv = document.getElementById("TableDiv");
  TableDiv.innerHTML = "";
  TableDiv.appendChild(table);
}

function selectToggle(id){
  var check = document.getElementById(id);
  if(check.classList.contains("selected")){
    check.classList.remove("selected");
  }else{
    check.classList.add("selected");
  }
}

function rowDelete(){
  var rows = document.getElementsByClassName("selected");
  rows[0].parentNode.parentNode.remove();
  rowDelete();
}

//THIS IS COPYED CODE
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