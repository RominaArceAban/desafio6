
let username = localStorage.getItem('username')
if (username == null) {
    username = prompt('Ingrese usuario')
    localStorage.setItem('username', username)
}
if (username) {
    document.getElementById('username').innerHTML = `Bienvenido: ${username}`
}



const btnForm = document.getElementById('btnForm')
const btnChat = document.getElementById('btnChat')
const socket = io()

btnForm.onclick = e => {
    e.preventDefault() 

    const name = document.getElementById("name").value
    const price = document.getElementById("price").value
    const photo = document.getElementById("photo").value


    socket.emit('add', {name, price, photo})
}

btnChat.onclick = e => {
    e.preventDefault() 

    const msn = document.getElementById("msn").value

    socket.emit('chat-in', { msn, username})
}

socket.on('show', productos => {
    console.log(productos)

    fetch('/tableProducts')
        .then(r => r.text())
        .then(html => {
            const div = document.getElementById("tableProducts")
            div.innerHTML = html
        })
        .catch(e => alert(e))
    
})

socket.on('chat-out', () => {
    
    fetch('/messages')
        .then(r => r.text())
        .then(html => {
            const div = document.getElementById("chat")
            div.innerHTML = html
        })
        .catch(e => alert(e))
    
})