export function showSpinner() {
    document.querySelector('.spinner').style.display = 'block';
    document.querySelector('.overlay').style.display = 'block';
}

export function hideSpinner() {
    document.querySelector('.spinner').style.display = 'none';
    document.querySelector('.overlay').style.display = 'none';
}

export function clean_form(element1, element2){
    element1.value = "";
    element2.value = "";
  }
