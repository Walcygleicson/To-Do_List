const input = document.querySelector('.input')
const add = document.querySelector(".add");
const remove = document.querySelector(".remove");
const clear = document.querySelector('.clear')


let local = {};
console.log('limpo - ' + local)



   
clear.addEventListener('click', () => {
    let ob = document.createElement('button') 
    localStorage.clear()
    ob.setAttribute('id', 'x')
    ob.setAttribute('onClick', 'deleteEvent()')
    ob.textContent = 'xxxxx'
    document.getElementsByTagName('body')[0].appendChild(ob)

})

function deleteEvent() {
    let x = document.getElementById('x')
    x.addEventListener('click', () => {
    console.log('oii')
})
}




// Adicionando no localStorage

function atualizeStorage() {
    localStorage.setItem("lista", JSON.stringify(local));
}
add.addEventListener('click', () => {
    const i = Object.keys(local).length
    local["task-" + (lastTaskNumber() + 1)] = {
        text: input.value,
        valor: 2,
    };
    
    atualizeStorage()
    console.log(local)
    console.log(lastTaskNumber())
    
})


// Resgatando do localStorage

function atualizeLocalList() {
    const getStorage = localStorage.getItem('lista')
    let x = JSON.parse(getStorage)
    local = x
}

// retorna o numero da última tarefa adicionada
function lastTaskNumber() {
    const y = Object.keys(local)
    let r = y.slice(y.length - 1).toString().slice(5)
    return Number(r)
}

window.addEventListener('load', () => {
    if (localStorage.key('lista')) {
     atualizeLocalList()   
    }
    
})


remove.addEventListener('click', () => {
    delete local[input.value]
    atualizeStorage()
    console.log(local)
})






