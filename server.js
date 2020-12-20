const express = require('express');
const app = express();

const PORT = process.env.PORT || 5000;
const { v4: uuidV4 } = require('uuid');

const server = app.listen(PORT);

const cors = require('cors');

app.use(cors());

const io = require('socket.io')(server, { cors: true, origins: ['http://127.0.0.1/'] });
// const io = require('socket.io')(server);

app.get('/', (req, res) => {
    console.log('requested');
    res.json({ roomID: uuidV4() });
});

app.get('/:roomID', (req, res) => {
    res.send('room created');
});

io.on('connection', (socket) => {
    console.log(socket.id);

    socket.on('join-room', ({ roomID, userID, stream }) => {
        console.log(roomID, userID, stream);

        socket.join(roomID);
        socket.to(roomID).broadcast.emit('user-connected', { userID, stream });

        socket.on('disconnect', () => {
            socket.to(roomID).broadcast.emit('user-disconnect', userID);
        });
    });
});
