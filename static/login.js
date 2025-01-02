import { showSpinner, hideSpinner, clean_form } from "./utils.js";

//######### SET GLOBAL VARS #########
const button_login = document.querySelector("#login");
const username = document.querySelector("#username");
const password = document.querySelector("#password");


button_login.onclick = function(e){
    e.preventDefault();
    login(username.value, password.value)
    clean_form(username, password);
};

function login(username, password){
    showSpinner();
    console.log("Login user...")
    let all_data = { "username": username, "password": password };
    $.ajax({
        url: "/login",
        contentType: 'application/json;charset=UTF-8',
        type: 'POST',
        data: JSON.stringify(all_data),
        success: function() {
          hideSpinner();
          window.location.href = "/index";
        },
        error: function(error) {
            console.log(error);
            hideSpinner();
        }
    })
}