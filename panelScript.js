const pendingContainer = document.querySelector('.pending-taskList')
const checkedContainer = document.querySelector(".checked-taskList")

// EVENTO DAS ABAS
const tabButtons = document.querySelectorAll('.tab-button')
tabButtons.forEach((elem) => {
    elem.addEventListener('click', (evt) => {
        const tab = evt.target
        if (tab.classList.contains('hidden')) {
            const active = document.querySelector('.active')
            active.classList.toggle('hidden')
            active.classList.toggle('active')
            tab.classList.toggle('hidden')
            tab.classList.toggle('active') 
        }

        if (tab.textContent == 'Concluídos') {
            checkedContainer.style.display = 'flex'
            pendingContainer.style.display = 'none'
            
        } else {
            checkedContainer.style.display = "none";
            pendingContainer.style.display = "flex";
        }
    })
})
