const socket = io();

let recording = false;
let actions = [];
let startTime;

document.getElementById('startRecording').addEventListener('click', () => {
  recording = true;
  actions = [];
  startTime = new Date().getTime();
  document.getElementById('startRecording').disabled = true;
  document.getElementById('stopRecording').disabled = false;
});

document.getElementById('stopRecording').addEventListener('click', () => {
  recording = false;
  document.getElementById('startRecording').disabled = false;
  document.getElementById('stopRecording').disabled = true;
  document.getElementById('startAutomation').disabled = false;
  socket.emit('recordAction', actions);
});

document.getElementById('startAutomation').addEventListener('click', () => {
  const repetitions = document.getElementById('repetitions').value;
  const interval = document.getElementById('interval').value;
  const xOffset = document.getElementById('xOffset').value;
  const yOffset = document.getElementById('yOffset').value;
  const variables = {
    mouse: { xOffset: parseInt(xOffset, 10), yOffset: parseInt(yOffset, 10) }
  };
  socket.emit('startAutomation', { actions, repetitions, interval, variables });
});

document.addEventListener('mousemove', (event) => {
  if (recording) {
    const time = new Date().getTime() - startTime;
    actions.push({ type: 'mouse', x: event.clientX, y: event.clientY, time });
  }
});

document.addEventListener('click', (event) => {
  if (recording) {
    const time = new Date().getTime() - startTime;
    actions.push({ type: 'mouse', x: event.clientX, y: event.clientY, click: true, time });
  }
});

document.addEventListener('keydown', (event) => {
  if (recording) {
    const time = new Date().getTime() - startTime;
    actions.push({ type: 'keyboard', key: event.key, time });
  }
});
