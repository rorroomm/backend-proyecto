const { Socket } = require('dgram');
const { sqlite3Connect } = require('./DB/sqlite3.db');

const express = require("express");
const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const knex = require('knex')(sqlite3Connect);

app.use(express.json());
app.use(express.urlencoded({extended:true}));

// Config 
app.set("views", "./views");
app.set("view engine", "ejs");

// Lista de mensajes

const messages = {
    id: "12345", 
    mensajes: [
        {
            _id: "123",
            author: {
                email: 'jorgel@gmail.com',
                nombre: 'Jorge',
                apellido: 'Lopez',
                edad: '23',
                alias: 'Flying dutchman',
                avatar: 'aaaa',
            },
            text: 'Hola!'
        },
        {
            _id: "321",
            author: {
                email: 'aaa@gmail.com',
                nombre: 'Juan',
                apellido: 'Perez',
                edad: '33',
                alias: 'Honey Badger',
                avatar: 'sup',
            },
            text: 'Buenas noches!'
        },
        {
            _id: "213",
            author: {
                email: 'yyy@gmail.com',
                nombre: 'Esteban',
                apellido: 'Quito',
                edad: '4',
                alias: 'Quadrant',
                avatar: 'aaaaa',
            },
            text: 'Hola'
        },
        {
            _id: "123",
            author: {
                email: 'jorgel@gmail.com',
                nombre: 'Jorge',
                apellido: 'Lopez',
                edad: '23',
                alias: 'Flying dutchman',
                avatar: 'aaaa',
            },
            text: 'Como estan?'
        }
    ] 
}

/*
const messages = [
    {
        email: 'rodrigo@gmail.com',
        timestamp: '28/9/2021 10:15:22',
        message: 'Hola que tal'
    }
]
*/
// add messages to db

knex('messages').insert(messages)
    .then(() => console.log('mensajes ingresados'))
    .catch((err) => console.log(err))

// Rutas

app.get('/', (req, res) => {
    res.render('pages/index', {productos: productos})
})

// Normalizr

const util = require('util');

function print(objeto){
    console.log(util.inspect(objeto, false, 12, true));
};

const user = new schema.Entity('user', {}, {idAttribute: 'email'});

const chatSchema = new.schema.Entity('message', {
    author: user
}, {idAttribute:'_id'});

const normalizedData = normalize(messages, [chatSchema]);
print(normalizedData);
console.log(JSON.stringify(normalizedData).length);



// Connection Socket.io

io.on('connection', (socket) => {
    socket.broadcast.emit('mensaje-user', 'Hola mundo');

    // emit
    socket.emit('messages', normalizedData);

    // message-center

    socket.on('new-message', function(data) {
        messages.push(data);

        knex('messages').insert(data)
            .then(() => console.log('mensajes ingresados'))
            .catch((err) => console.log(err))

        io.sockets.emit('messages', messages);
    });

})

http.listen(3030, () => {
    console.log('Driving-driving on port 3030');
})
