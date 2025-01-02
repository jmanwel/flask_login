//######### SET GLOBAL VARS #########

// const isnotEmpty = (currentValue) => currentValue != "";
// const button_hosts = document.querySelector("#button_hosts");
// const button_groups = document.querySelector("#button_groups");
// const form = document.querySelector("#form_hosts");
// const select_hosts = document.querySelector("#form-select");
// var info = [];
// var ITEM = [];

// // ######### DOM FUNCTIONS #########

// function showSpinner() {
//     document.querySelector('.spinner').style.display = 'block';
//     document.querySelector('.overlay').style.display = 'block';
// }

// function hideSpinner() {
//     document.querySelector('.spinner').style.display = 'none';
//     document.querySelector('.overlay').style.display = 'none';
// }

// function clean_form(){
//     let button = form.querySelector("button");
//     if (button) {
//         let title = form.querySelector("h2");
//         let table = form.querySelector("table");
//         button.remove();
//         title.remove();
//         table.remove();
//     }
// }

// function fill_select(info){
//     select_hosts.innerTextContent = "";
//     option = document.createElement("option");
//     option.innerText = "Open this menu";
//     select_hosts.add(option);
//     for ( value in info ) {
//         let option = document.createElement("option");
//         [ option.value, option.innerText ] = [ info[value], info[value] ];
//         select_hosts.add(option);
//     }
//     hideSpinner();
// }

// function create_td(content){
//     let td = document.createElement("td");
//     td.innerTextContent = content;
//     return td
// }

// function create_styled_table(array_rows){
//     let table = document.createElement("table");
//     table.className = "table table-striped mt-3";
//     let th_arr = [ "Parameter", "Value", "Updated_at", "Updated_by" ];
//     let tr_head = document.createElement("tr");
//     tr_head.style.color = "white";
//     tr_head.style.background = "black";
//     tr_head.className = "mb-2";
//     for ( let i = 0; i < th_arr.length; i++ ) {
//         let th = document.createElement("th");
//         th.innerTextContent = th_arr[i];
//         tr_head.append(th);
//     }
//     table.append(tr_head);
//     for ( let i = 0; i < array_rows.length; i++ ) {
//         let tr_row = document.createElement("tr");
//         let td_id = create_td(array_rows[i][0]);
//         td_id.style.display = "none"
//         tr_row.append(td_id);
//         let td_parameter = create_td(array_rows[i][3]);
//         tr_row.append(td_parameter);
//         let td_value = document.createElement("td");
//         let input = document.createElement("input");
//         input.className = "input-style";
//         input.value = array_rows[i][4];
//         td_value.append(input);
//         tr_row.append(td_value);
//         let td_update_at = create_td(array_rows[i][6]);
//         tr_row.append(td_update_at);
//         let td_update_by = create_td(array_rows[i][7]);
//         tr_row.append(td_update_by);
//         table.append(tr_row);
//     }
//     return table;
// }


// function fill_form(parameters, STR_ITEM){
//     clean_form();
//     let title = document.createElement("h2");
//     title.innerTextContent = `Working on ${ STR_ITEM }: ${ parameters[0][2] } environment: ${ parameters[0][1] }`;
//     title.className = "mb-2 mt-4";
//     form.append(title);
//     let table_in_form = create_styled_table(parameters);
//     form.append(table_in_form);
//     const button_form = document.createElement("button");   
//     button_form.className = "btn btn-success mb-2 mt-4"
//     button_form.innerTextContent = "Save"
//     form.append(button_form);
// }

// // ######### EVENTS FUNCTIONS #########

// button_hosts.onclick = function(e){
//     e.preventDefault();
//     info = call_host_info();
//     clean_form();
//     form.removeAttribute("hidden");
// };

// button_groups.onclick = function(e){
//     e.preventDefault();
//     info = call_group_info();
//     clean_form();
//     form.removeAttribute("hidden");
// };

// select_hosts.onchange = function(e){
//     e.preventDefault();
//     call_info_by_name(select_hosts.value)
// };

// form.onsubmit = function(e){
//     e.preventDefault();
//     form.querySelector("button").disabled = true;
//     row_element = Array.from(form.querySelectorAll("tr")).slice(1);
//     input_element = form.querySelectorAll("input");
//     if (checkValidity(input_element)){
//         let all_data = [];
//         for (element in row_element){
//             all_data.push({ "id": row_element[element].childNodes[0].firstChild.nodeValue, 
//                             "value": input_element[element].value, 
//                             "table": ITEM 
//                           });
//         }
//         $.ajax({
//             url: "/update_table",
//             data: JSON.stringify(all_data),
//             contentType: 'application/json;charset=UTF-8',
//             type: 'POST',
//             success: function(data) {
//                 alert(JSON.stringify(data.msg));
//                 window.location.reload();
//             },
//             error: function(error) {
//                 console.log(error);
//             }
//         })
//     }
//     else{
//         alert("No empty fields")
//     }
// };

// function checkValidity(array_values){
//     let new_array = [...array_values].map(node => node.value);
//     return new_array.every(isnotEmpty)
// }

// // ######### API FUNCTIONS #########

// function call_host_info(){
//     showSpinner();
//     console.log("fetching host info...")
//     $.ajax({
//         url: "/call_host_info",
//         contentType: 'application/json;charset=UTF-8',
//         type: 'POST',
//         success: function(data) {
//             info = data;
//             ITEM = "host";
//             fill_select(data);
//         },
//         error: function(error) {
//             console.log(error);
//         }
//     })
// }

// function call_group_info(){
//     showSpinner();
//     console.log("fetching group info...")
//     $.ajax({
//         url: "/call_group_info",
//         contentType: 'application/json;charset=UTF-8',
//         type: 'POST',
//         success: function(data) {

//             info = data;
//             ITEM = "group";
//             fill_select(data);
//         },
//         error: function(error) {
//             console.log(error);
//         }
//     })
// }

// function call_info_by_name(name){
//     console.log("fetching info by name...")
//     let all_data = { "name": name, "table": ITEM };
//         $.ajax({
//             url: "/call_info_by_name",
//             data: JSON.stringify(all_data),
//             contentType: 'application/json;charset=UTF-8',
//             type: 'POST',
//             success: function(data) {
//                 fill_form(data, ITEM);
//             },
//             error: function(error) {
//                 console.log(error);
//             }
//         })
// }


//##################################################################################################
//##################################################################################################
//##################################################################################################
//##################################################################################################

// Inventory functions

// function show_me_more(value){
//     document.querySelector("#switch_name").innerText = `Hostname: ${ value.name }`;
//     document.querySelector("#switch_comments").innerText = `Comments: ${ value.comments }`;
//     document.querySelector("#switch_conf_reg").innerText = `Configuration Register: ${ value.conf_reg }`;
//     document.querySelector("#switch_model_id").innerText = `Model: ${ value.model_id }`;
//     document.querySelector("#switch_release").innerText = `Release: ${ value.release }`;
//     document.querySelector("#switch_rommon").innerText = `Rommon: ${ value.rommon }`;
//     document.querySelector("#switch_serial_number").innerText = `Serial Number: ${ value.serial_number }`;
//     document.querySelector("#switch_software_image").innerText = `Software Image: ${ value.software_image }`;
//     document.querySelector("#switch_u_site").innerText = `Site: ${ value.u_site }`;
//     document.querySelector("#switch_version").innerText = `Version: ${ value.version }`;
//     document.querySelector("#switch_u_location_path").innerText = `Location path: ${ value.u_location_path }`;
//     let div_interfaces = document.querySelector("#switch_interfaces");
//     for (let i=0; i< value.interfaces.length; i++){
//         let p = document.createElement("p");
//         p.innerText = value.interfaces[i];
//         div_interfaces.append(p);
//     }
// }


// $('.collapsible-button').on('click', function() {
//     $(this).toggleClass('collapsed');
// });


// document.addEventListener('DOMContentLoaded', function () {
//     const content = document.querySelector('#tableSwitches'); 
//     console.log(content)
//     const itemsPerPage = 50;
//     let currentPage = 0;
//     const items = Array.from(content.getElementsByTagName('tr')).slice(1);
  
//   function showPage(page) {
//     const startIndex = page * itemsPerPage;
//     const endIndex = startIndex + itemsPerPage;
//     items.forEach((item, index) => {
//       item.classList.toggle('hidden', index < startIndex || index >= endIndex);
//     });
//     updateActiveButtonStates();
//   }
  
//   function createPageButtons() {
//     const totalPages = Math.ceil(items.length / itemsPerPage);
//     const paginationContainer = document.createElement('div');
//     const paginationDiv = document.body.appendChild(paginationContainer);
//     paginationContainer.classList.add('pagination');
  
//     // Add page buttons
//     for (let i = 0; i < totalPages; i++) {
//       const pageButton = document.createElement('button');
//       pageButton.textContent = i + 1;
//       pageButton.addEventListener('click', () => {
//         currentPage = i;
//         showPage(currentPage);
//         updateActiveButtonStates();
//       });
  
//         content.appendChild(paginationContainer);
//         paginationDiv.appendChild(pageButton);
//       }
//   }
  
//   function updateActiveButtonStates() {
//     const pageButtons = document.querySelectorAll('.pagination button');
//     pageButtons.forEach((button, index) => {
//       if (index === currentPage) {
//         button.classList.add('active');
//       } else {
//         button.classList.remove('active');
//       }
//     });
//   }
  
//     createPageButtons();
//     showPage(currentPage);
//   });