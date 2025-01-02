import { showSpinner, hideSpinner, clean_form } from "./utils.js";

//######### SET GLOBAL VARS #########
const button_signup = document.querySelector("#signup");
const username = document.querySelector("#username");
const password = document.querySelector("#password");

button_signup.onclick = function(e){
    e.preventDefault();
    signup(username.value, password.value)
    clean_form(username, password);
};

function signup(username, password){
    showSpinner();
    console.log("Creating new user...")
    let all_data = { "username": username, "password": password };
    $.ajax({
        url: "/signup",
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

password.onblur = function(e){
  let validate = checkPwd(password.value);
  if (validate.result === 0){
    password.classList.remove("is-invalid");
    password.classList.add("is-valid");
  }
  else{
    password.classList.remove("is-valid");
    password.classList.add("is-invalid");
    document.querySelector("#validationPasswordFeedback").innerHTML = validate.msg;
  }
}

function checkPwd(pwd){
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,15}$/;
  if (pwd === ""){
    return { result: 1, msg: "Password must not be empty" };
  }
  if (regex.test(pwd) === false){
    return { result: 1, msg: "Password must have lower, upper, digits, special chars and min 8 max 15 chars long" };
  }
  else {
    return { result: 0, msg: "Password is OK!" };
  }
}

username.onblur = function(e){
  let validate = checkUsr(username.value);
  if (validate.result === 0){
    username.classList.remove("is-invalid");
    username.classList.add("is-valid");
  }
  else{
    username.classList.remove("is-valid");
    username.classList.add("is-invalid");
    document.querySelector("#validationUsernameFeedback").innerHTML = validate.msg;
  }
}

function checkUsr(usr){
  if (usr === ""){
    return { result: 1, msg: "Username must not be empty" };
  }
  else {
    return { result: 0, msg: "Looks good!" };
  }
}