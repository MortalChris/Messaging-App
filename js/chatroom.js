// const socket = io();

// const form = document.getElementById('form');
// const input = document.getElementById('input');
// const messages = document.getElementById('messages');
// const activity = document.getElementById('activity');
// const username = document.getElementById('username');

// form.addEventListener('submit', (e) => {//Emits typed text in input
//     e.preventDefault();
//     if (input.value) {
//         socket.emit('chat message', input.value);
//         input.value = '';
//     }
// });

// socket.on('chat message', (msg) => {//connects typed text to server and displays it
//     activity.textContent = "";//Wipes activity text content
//     const item = document.createElement('li');
//     item.textContent = msg;
//     console.log(msg);
//     messages.appendChild(item);
//     window.scrollTo(0, document.body.scrollHeight);
// });

// //Handles displaying if other user is typing
// input.addEventListener('keypress', () => {//Displays if other user is typing on key press
//     socket.emit('activity', socket.id.substring(0,5))
// })

// let activityTimer
// socket.on('activity', () => {//Displays if other user is typing
//         activity.textContent = username.textContent + ` is typing...`;

//         // Clears activity after 3 seconds
//         clearTimeout(activityTimer)
//             activityTimer = setTimeout(() =>{
//                 activity.textContent = '';
//             }, 3000);
// });