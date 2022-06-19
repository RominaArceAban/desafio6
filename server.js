const express = require('express')
const productsRouter = require('./routes/productsRouter')
const http = require('http')
const { Server } = require("socket.io")
const Contenedor = require('./contenedor')


const app = express()
const PORT = process.env.PORT || 8080

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/public', express.static(__dirname + '/public'))

app.set('view engine', 'ejs')
app.set('views', './views')

//app.use('/', productsRouter)

const server = http.createServer(app)
const io = new Server(server)

const productos = []

const contenedorProd = new Contenedor('products.json')
const contenedorMsn = new Contenedor('messages.json')

app.get('/', (req, res) => {
    res.render('index')
})

app.post('/', (req, res)=>{
    console.log(req.body)
    productos.push(req.body)
    res.json(req.body)
})

app.get('/tableProducts', (req, res) => {
    res.render('tableProducts', { productos: contenedorProd.getAll()
    })
})

app.get('/messages', (req, res) => {
    res.render('messages', { messages: contenedorMsn.getAll()
    })
})

io.on('connection', socket => {

    socket.on('add', data => {
        console.log(data)
        productos.push(data)
        const dateProd = {
            name: data.name,
            price: data.price,
            photo: data.photo
        }
        contenedorProd.save(dateProd)
        io.sockets.emit('show', productos)
    })

    socket.on('chat-in', data => {

        const dateFyH = new Date().toLocaleString()
        const dataOut = {
            username: data.username,
            date: dateFyH,
            msn: data.msn
        }
        
        contenedorMsn.save(dataOut)
        io.sockets.emit('chat-out', 'ok')
    })
})




server.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`)
})