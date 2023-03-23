
var localList = {};

// Cria uma lista no localStorage, se já existir esta ela apenas atualiza
function atualizeStorageList() {
    localStorage.setItem("taskList", JSON.stringify(localList));
}

// Resgata os valores do localStorage e atualiza o objeto localList.
function atualizeLocalList() {
    const getStorage = localStorage.getItem("taskList");
    let objList = JSON.parse(getStorage);
    localList = objList;
}


// **********************************
//FUNÇÃO PARA DELETAR TAREFA ( O botão recebe a função direto no atributo HTML 'onClick')
function deleteTask(id) {
    delete localList[id];
    atualizeStorageList()
    loadTaskElements()
    setIcon_NoTask()
    showNotificationBar('A Tarefa foi Deletada!')
}

// *************************
// FUNÇÃO DE MARCAR TAREFA COMO CONCLUIDO
function checkTask(id) {
    localList[id]['status'] = 'concluido'
    atualizeStorageList()
    loadTaskElements()
    showNotificationBar("Tarefa Marcada como Concluída!");
}


// Atualiza o localList quando a página é carregada - Atualiza os elementos das taskList
window.addEventListener("load", () => {
    if (localStorage.key("taskList")) {
        atualizeLocalList();
        loadTaskElements()
    }
    
});


let count = 0;
setInterval(() => {
    let mes = new Date().getMonth() + 1
    let dia = new Date().getDate()
    let horario = new Date().toLocaleTimeString('pt-BR', { hour12: true }).replace(' ', ':').split(':')
    if (horario[0] == 0) {
        horario[0] = 12
    }
    if (horario[0].length <= 1) {
        horario[0] = '0' + horario[0]
    }
    let keyList = Object.keys(localList)
    if (count > 0 && permistion) {
        document.querySelector('.notification').classList.add('expired-notifi')
        document.querySelector(".expired-notifi").style.top = 0;
        document.querySelector(
            ".expired-notifi"
        ).innerHTML = `Você tem <span>${count}</span> tarefas expiradas!`;
    } else {
        document.querySelector('.notification').classList.remove('expired-notifi')
    }
    count = 0
    for (task of keyList) {
        if (localList[task]['status'] == 'expirou') {
            count++
        }
        if (localList[task]['status'] == 'pendente' && localList[task]['data'] != 'Indefinido') {
            let taskDate = localList[task]['data'].split('/')
            let taskHours = localList[task]['hora'].replace('-', ':').split(':')
            // console.log(taskHours[0])
            // console.log(horario[0])

            if (taskDate[1] <= mes && taskDate[0] <= dia && taskHours[0] <= horario[0] && taskHours[1] + 1 < horario[1] + 1 & taskHours[2] == horario[3]) {
                localList[task]['status'] = 'expirou'
                atualizeStorageList();
                loadTaskElements(); 
            }
        } 
    }
    
}, 1000)

