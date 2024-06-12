const express = require('express');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const robot = require('robotjs');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('index');
});

io.on('connection', (socket) => {
  console.log('New connection');

  socket.on('recordAction', (action) => {
    // Process recorded action
    console.log('Recorded action:', action);
  });

  socket.on('startAutomation', (data) => {
    const { actions, repetitions, interval, variables } = data;
    for (let i = 0; i < repetitions; i++) {
      setTimeout(() => {
        actions.forEach(action => {
          if (action.type === 'mouse') {
            const xOffset = (variables.mouse && variables.mouse.xOffset) ? variables.mouse.xOffset * i : 0;
            const yOffset = (variables.mouse && variables.mouse.yOffset) ? variables.mouse.yOffset * i : 0;
            robot.moveMouse(action.x + xOffset, action.y + yOffset);
            if (action.click) {
              robot.mouseClick();
            }
          } else if (action.type === 'keyboard') {
            robot.typeString(action.key);
          }
        });
      }, i * interval);
    }
  });
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
