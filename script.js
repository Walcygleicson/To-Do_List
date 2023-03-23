const input = document.querySelector(".input-newTask");
const addButton = document.querySelector(".add-newTask");
const taskContainer = document.querySelector(".recent-taskList");
const taskInfos = document.querySelector(".add-taskInfos");
const inputDate = document.querySelector(".task-date");
const inputHour = document.querySelector(".task-hour");
const inputSelect = document.querySelector(".turno");
const textDescription = document.querySelector(".description");
const modalContainer = document.querySelector(".container-modal");


// ***********************************
// Propriedades do Objeto Modal
const Modal = {
    show: function () {
        modalContainer.style.display = "flex";
        const button = document.querySelector(".back");
        button.addEventListener("click", () => {
            modalContainer.style.display = "none";
        });
    },
    setTitle: function (title) {
        document.querySelector(".alert-title").textContent = title;
    },
    setAlert: function (text) {
        document.querySelector(".alert-text").innerHTML = text;
    },
    getBackButton: function (txt = "Voltar") {
        const button = document.querySelector(".back");
        button.textContent = txt;
        return button;
    },
    getContinueButton: function (txt = "Seguir") {
        const button = document.querySelector(".continue");
        button.textContent = txt;
        return button;
    },
};

//****************************
// Formatando em tempo real o texto digitado no input. Colocando a primeiro letra em maiúscula.
let openTaskInfos = false;
input.addEventListener("input", (event) => {
    let innerVal = event.target.value;
    if (innerVal.length <= 1) {
        input.value = innerVal.toUpperCase();
    }

    if (innerVal.length >= 4) {
        taskInfos.style.display = "flex";
        openTaskInfos = true;
    } else {
        taskInfos.style.display = "none";
        openTaskInfos = false;
    }
});

// *****************************************
// Retorna o número da última tarefa adicionada no localList.
function lastTaskNumber() {
    const objKeys = Object.keys(localList);
    let lastNumb = objKeys
        .slice(objKeys.length - 1)
        .toString()
        .slice(5);
    return Number(lastNumb);
}

let toContinue = false;
// Adiciona a tarefa criada direto no localList
const addTask = () => {
    //Validando e retornando o valor do campo de descrição.
    const text = () => {
        if (textDescription.value.length <= 0) {
            return "Sem descrição!";
        } else {
            return textDescription.value;
        }
    };
    localList["task-" + (lastTaskNumber() + 1)] = {
        nome: input.value,
        data: formatDate(),
        hora: getValidTime(),
        text: text(),
        status: "pendente",
    };
    input.value = "";
    inputDate.value = "";
    inputHour.firstElementChild.value = "";
    inputHour.lastElementChild.value = "";
    textDescription.value = "";
    atualizeStorageList()
    disabledHour();
};

// EVENTO DO BOTÃO DE SEGUIR DO MODAL
Modal.getContinueButton().addEventListener("click", () => {
    modalContainer.style.display = "none";
    if (toContinue && taskInfos.style.display == "flex") {
        taskInfos.style.display = "none";
        addTask();
        loadTaskElements()
        console.log(localList);
    } else {
        taskInfos.style.display = "flex";
        openTaskInfos = true;
    }
    toContinue = false;
});

//****************************
// EVENTO DO BOTÃO DE ADICIONAR
addButton.addEventListener("click", () => {
    Modal.getContinueButton().style.display = "block";
    Modal.getBackButton();
    // Validando o nome de tarefa fornecido pelo usuário.
    // Se o tamanho do nome de tarefa for menor que 4 caracteres abre um modal de alert.
    if (
        input.value.length < 4 &&
        input.value.length > 0 &&
        openTaskInfos == false
    ) {
        Modal.show();
        Modal.setTitle("Opa!");
        Modal.getBackButton("Editar");
        Modal.setAlert(
            `${input.value.bold()} Não parece ser um nome de tarefa. Deseja criar mesmo assim?`
        );
    }

    // Bloco só executa caso o nome de tarefa tenha sido aceito - Controlado pela variável 'openTaskInfos'.
    if (openTaskInfos && input.value.length > 0) {
        //Blocos de alertas do modal
        if (valiDate(inputDate.value) == "alert" && getValidTime() != "alert") {
            console.log(getValidTime());
            console.log(valiDate(inputDate.value));
            Modal.show();
            Modal.setTitle("Data Distante!");
            Modal.setAlert(
                "O ano escolhido parece muito distante (+10 anos). Certeza que está correto?"
            );
            toContinue = true;
        } else if (valiDate(inputDate.value) == "indefinido") {
            Modal.show();
            Modal.setTitle("Data Indefinida!");
            Modal.setAlert(
                "Há campos vazios. Deseja ignorar estes campos e criar tarefa sem data definida?"
            );
            toContinue = true;
        } else if (valiDate(inputDate.value) && getValidTime() == "alert") {
            console.log(getValidTime());
            console.log(valiDate(inputDate.value));
            Modal.show();
            Modal.setTitle("Horário Inválido!");
            Modal.setAlert(
                "Para criar tarefa com data é necessário definir um horário válido"
            );
            Modal.getContinueButton().style.display = "none";
            Modal.getBackButton("Ok");
        } else if (
            valiDate(inputDate.value) == true &&
            getValidTime() != "alert"
        ) {
            addTask();
            loadTaskElements()
            taskInfos.style.display = 'none'
            console.log(localList)
        } else {
            Modal.show();
            Modal.setTitle("Data Inválida!");
            Modal.getContinueButton().style.display = "none";
            Modal.getBackButton("Ok");
            Modal.setAlert(
                "Não é possível criar tarefa com data anterior à data de hoje. Selecione uma data posterior."
            );
        }
    }
});

const disabledHour = () => {
    if (inputDate.value.length >= 5) {
        inputHour.style.background = "rgb(5, 106, 74)";
        inputHour.firstElementChild.removeAttribute("disabled");
        inputHour.lastElementChild.removeAttribute("disabled");
        inputSelect.removeAttribute("disabled");
    } else {
        inputHour.style.background = "rgba(5, 106, 74, 0.699)";
        inputHour.firstElementChild.setAttribute("disabled", "disabled");
        inputHour.lastElementChild.setAttribute("disabled", "disabled");
        inputSelect.setAttribute("disabled", "disabled");
    }
};

inputDate.addEventListener("input", () => {
    disabledHour();
});

inputHour.firstElementChild.addEventListener("input", (event) => {
    const innerVal = event.target;
    if (innerVal.value <= 9) {
        innerVal.value = ("0" + innerVal.value).slice(-2);
    } else if (innerVal.value > 9 && innerVal.value <= 12) {
        innerVal.value = innerVal.value.slice(-2);
        inputHour.lastElementChild.focus();
    } else {
        innerVal.value = 12;
    }

    window.addEventListener("keydown", (event) => {
        if (event.code == "Enter") {
            inputHour.lastElementChild.focus();
        }
    });
});

inputHour.lastElementChild.addEventListener("input", (event) => {
    const innerVal = event.target;
    if (innerVal.value <= 9) {
        innerVal.value = ("0" + innerVal.value).slice(-2);
    } else if (innerVal.value > 9 && innerVal.value <= 59) {
        innerVal.value = innerVal.value.slice(-2);
        inputSelect.focus();
    } else {
        innerVal.value = 59;
        inputSelect.focus();
    }
});

inputSelect.addEventListener("focus", (event) => {
    let select = event.target;
    window.addEventListener("keydown", (tecla) => {
        if (tecla.code == "Enter") {
            select.open;
        }
    });
});

// Validando a data fornecida pelo usuário.
const valiDate = (data) => {
    const inptDate = data.split("-");
    const dt = new Date();
    const atualDate = {
        ano: dt.getFullYear(),
        mes: ("0" + (dt.getMonth() + 1)).slice(-2),
        dia: ("0" + dt.getDate()).slice(-2),
    };

    if (inptDate[0] == atualDate.ano) {
        // Testa se é o ano atual
        // Testa se é o mês atual e o dia é o atual o superior, ou se o mês é superior.
        if (
            (inptDate[1] == atualDate.mes && inptDate[2] >= atualDate.dia) ||
            inptDate[1] > atualDate.mes
        ) {
            return true;
        } else {
            return false;
        }
    } else if (inptDate[0] > atualDate.ano) {
        // Testa se o ano é maior que o ano atual.
        if (inptDate[0] > atualDate.ano + 10) {
            return "alert";
        } else {
            return true;
        }
    } else if (inptDate == "") {
        return "indefinido";
    }
};

// Retorna a data formatada
const formatDate = () => {
    let data = inputDate.value.split("-");
    if (inputDate.value.length <= 0) {
        return "Indefinido";
    } else {
        return `${data[2]}/${data[1]}/${data[0]}`;
    }
}

// Valida a hora fornecida pelo usuário e retorna os valores
function getValidTime() {
    const hourVal = inputHour.firstElementChild.value;
    const minuteVal = inputHour.lastElementChild.value;
    const hourAttr = inputHour.firstElementChild.getAttribute("disabled");

    if (hourVal > 0 && minuteVal.length > 0 && hourAttr == null) {
        return `${hourVal}:${minuteVal}-${inputSelect.value.toUpperCase()}`;
    } else if (hourVal > 0 && minuteVal.length <= 0 && hourAttr == null) {
        return `${hourVal}:00-${inputSelect.value.toUpperCase()}`;
    } else if (hourVal <= 0 && hourAttr == null) {
        return "alert";
    } else {
        return "--:--";
    }
}

textDescription.addEventListener("input", (evt) => {
    let textLength = evt.target.value.length;
    if (textLength <= 87) {
        const maxChar = document.querySelector(".max-char");
        maxChar.textContent = textLength + "/87";
    }
});

// Esconde/Revela o ícone de vazio na lista de tarefas recentes
function setIcon_NoTask() {
    const recentTL_before = document.querySelector(".recent-taskList");
    if (recentTaskList.childElementCount >= 1) {
        recentTL_before.classList.remove("empty");
        recentTL_before.classList.add("added");
    } else {
        recentTL_before.classList.add("empty");
        recentTL_before.classList.remove("added");
    }

    if (pendingTaskList.childElementCount >= 1) {
        pendingTaskList.nextElementSibling.style.display = 'none'
    } else {
         pendingTaskList.nextElementSibling.style.display = "block";
    }

    if (checkedTaskList.childElementCount >= 1) {
        checkedTaskList.nextElementSibling.style.display = "none";
    } else {
        checkedTaskList.nextElementSibling.style.display = "block";
    }
}




// Criando elemento e adicionando a tarefa á lista
const recentTaskList = document.querySelector(".recent-taskList .list");
const pendingTaskList = document.querySelector(".pending");
const checkedTaskList = document.querySelector(".checked");

let displayCheck = 'inicial'
function loadTaskElements() {
    pendingTaskList.innerHTML = ''
    recentTaskList.innerHTML = ''
    checkedTaskList.innerHTML= ''

    let keyId = Object.keys(localList);
    for (taskId of keyId) {
        const taskName = localList[taskId];
       // Criando o elemento e seus filhos
        const created_task = document.createElement("div");
        created_task.setAttribute("class", "toDo-task");
        created_task.setAttribute("id", taskId);
        if (taskName.status == 'expirou') {
            created_task.classList.add('expired-task')
        }
        const created_content = () => {
            const elem = document.createElement("div");
            elem.setAttribute("class", "td-taskContent");
            elem.setAttribute("onClick", `showInfos('${taskId}')`);
            const p1 = document.createElement("p");
            p1.setAttribute('class', 'head-title')
            p1.textContent = taskName.nome
            const p2 = document.createElement("p");
            p2.setAttribute('class', 'head-date')
            if (taskName.data == "Indefinido") {
                p2.textContent = taskName.data + " " + taskName.hora;
            } else {
                p2.textContent = `Para Dia: ${taskName.data} - Hora: ${taskName.hora}`;
            }

            elem.appendChild(p1);
            elem.appendChild(p2);
            return elem;
        };
        const created_buttons = () => {
            const elem = document.createElement("div");
            elem.setAttribute("class", "buttons");
            const btDelete = document.createElement("button");
            btDelete.setAttribute("class", "material-symbols-rounded delete");
            btDelete.setAttribute("onClick", `deleteTask('${taskId}')`);
            btDelete.innerText = "delete";
            const btCheck = document.createElement("button");
            btCheck.setAttribute("class", "material-symbols-rounded check");
            btCheck.setAttribute("onClick", `checkTask('${taskId}')`);
            btCheck.innerText = "check_box";

            elem.appendChild(btDelete);
            elem.appendChild(btCheck);
            return elem;
        };

        created_task.appendChild(created_content());
        created_task.appendChild(created_buttons());
        const existElem = document.querySelector(`#${taskId}`) == null
        if (taskName.status != 'concluido' && displayCheck == 'inicial') {
            recentTaskList.insertBefore(
                created_task,
                recentTaskList.firstElementChild
            );
        } else if (taskName.status != 'concluido' && displayCheck == 'expand') {
            pendingTaskList.insertBefore(
                created_task,
                pendingTaskList.firstElementChild
            );
        }

        if(taskName.status == 'concluido'){
            checkedTaskList.insertBefore(
                created_task,
                checkedTaskList.firstElementChild
            );
        }
    }
    setIcon_NoTask(); 
}


// Evento do botão de VER MAIS e VER MENOS
const panelTaskList = document.querySelector('.panel-container')
const expandButton = document.querySelectorAll('.expand')
expandButton.forEach((elem) => {
    elem.addEventListener('click', (evt) => {
        if (evt.target.value == 'on') {
            recentTaskList.parentElement.parentElement.style.display = 'none'
            panelTaskList.style.display = 'block'
            displayCheck = 'expand'
        } else {
            recentTaskList.parentElement.parentElement.style.display = "flex";
            panelTaskList.style.display = "none";
            displayCheck = 'inicial'
        }

        loadTaskElements()
    })
})

const closeDescriptionModal = document.querySelector('.close-description-modal')
closeDescriptionModal.addEventListener('click', () =>{
    closeDescriptionModal.parentElement.style.display = 'none'
})


function showInfos(id) {
    const elem = document.getElementById(id)
    const getTitle = elem.firstChild.firstChild
    const getDate = elem.firstChild.lastChild
    const getDescript = localList[id]['text']
    const getStatus = localList[id]['status']
    const headStatus = document.querySelector('.head-status')
    document.querySelector('.description-modal').style.display = 'block'
    document.querySelector('.description-modal > .head-title').textContent = getTitle.textContent
    document.querySelector('.description-modal > .head-date').textContent = getDate.textContent
    document.querySelector('.task-description').textContent = getDescript
    if (getStatus == 'concluido') {
        headStatus.textContent = 'Concluído'
        headStatus.style.color = "rgb(5, 106, 74)";
    } else if (getStatus == 'expirou') {
        headStatus.textContent = 'Expirou'
        headStatus.style.color = "rgba(204, 31, 11, 0.785)";
    } else {
        headStatus.textContent = 'Pendente'
        headStatus.style.color = 'gray'
    }

}
let permistion = true
function showNotificationBar(message) {
    const notfi = document.querySelector('.notification')
    permistion = false
    notfi.classList.remove('expired-notifi')
    notfi.style.transition = '.4s'
    notfi.textContent = message
    notfi.style.top = 0
    setTimeout(() => {
        notfi.style.top = '-6%'
        permistion = true
    }, 2000)
}

