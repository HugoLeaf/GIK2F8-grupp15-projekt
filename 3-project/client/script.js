employeeForm.title.addEventListener("input", (e) => validateField(e.target));
employeeForm.title.addEventListener("blur", (e) => validateField(e.target));
employeeForm.description.addEventListener("input", (e) => validateField(e.target));
employeeForm.description.addEventListener("blur", (e) => validateField(e.target));
employeeForm.startDate.addEventListener("input", (e) => validateField(e.target));
employeeForm.startDate.addEventListener("blur", (e) => validateField(e.target));

employeeForm.addEventListener("submit" , onSubmit);

const employeeListElement = document.getElementById("employeeList");

let titleValid = true;
let descriptionValid = true;
let startDateValid = true;


const api = new Api("http://localhost:5000/employees");

function validateField(field){
    const {name, value} = field;

    let = validationMessage = "" ;

    switch(name) {
        case "title": {
            if(value.length < 2) {
                titleValid = false;
                validationMessage = "Fältet  'Titel' måste innehålla minst 2 tecken";
            } else if(value > 100){
                titleValid = false;
                validationMessage = "Fältet  'Titel' får inte innehålla mer än 100 tecken";
        } else {
        titleValid = true;
        }
        break;
        }
        case "description": {
            if(value.length > 500){
                descriptionValid = false;
                validationMessage = "Fältet  'beskrivning' får inte innehålla mer än 500 tecken";
            } else {
            descriptionValid = true;
            }
            break;
        }
        case "startDate": {
            if(value.length == 0 ){
                descriptionValid = false;
                validationMessage = "Fältet  'utfört senast' får inte lämnas tomt";
            } else{
              startDateValid= true;
            }
        break;

        }

    }

    field.previousElementSibling.innerText = validationMessage;
    field.previousElementSibling.classList.remove("hidden");

    

}





function onSubmit(e) {

    e.preventDefault();

    if(titleValid && descriptionValid && startDateValid){
        console.log("submit");
        saveEmployee();
    }

    
 
};

function saveEmployee() {
    const employee = {
        title: employeeForm.title.value,
        description: employeeForm.description.value,
        startDate: employeeForm.startDate.value,
        completed : false,

    };

    api.create(employee).then((employee) => {
    if(employee){
        renderList();
    }} );
}


function renderList() {
    const sortList = [];
    api.getAll().then((employees) => {
      employeeListElement.innerHTML = '';
      if (employees && employees.length > 0) {
        employees.forEach((employee) => {
            sortList.push(employee);
        });
        sortList.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

        sortList.forEach((employee) => {
          employeeListElement.insertAdjacentHTML('beforeend', renderEmployee(employee));
        });
      }
    });
  }


function renderEmployee({ id, title, description, startDate, completed }) {

  const isChecked =  completed == true ? "checked" : "";
  const textChange = completed == true ? "text-green-500 text-l§g" : "";
 


  let html = `
    <li class="select-none mt-2 py-2 border-b border-blue-300 ${textChange}">
      <div class="flex items-center p-1 " id=${id}>
        <h3 class="mb-3 flex-1 text-xl font-bold text-black-800 uppercase ${textChange}">${title}</h3>
        <div>
          <span>${startDate}</span>
          <button onclick="deleteEmployee(${id})" class="${textChange} inline-block bg-amber-500 text-xs text-amber-900 border border-white px-3 py-1 rounded-md ml-2">Ta bort</button>
          <br>
          <input onclick="completeEmployee(${id})" type="checkbox" id="completeBox" ${isChecked}>
          <label class="${textChange}" for="completedBox">Instämplad</label><br>
        </div>
      </div>`;
  description &&
    (html += `
      <p class="ml-8 mt-2 text-xs italic ${textChange}">${description}</p>
  `);
  html += `
    </li>`;

  return html;
}


function completeEmployee(id) {
  const stampEmployee = document.getElementById(id).querySelector('#completeBox').checked;
  api.update(id, stampEmployee).then(result => { renderList()});
}



function deleteEmployee(id) {
    api.remove(id).then(result => {
        renderList();
    });
}





renderList();