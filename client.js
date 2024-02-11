// client.js
const app = document.querySelector(".app");
const socket = io();

let uName;

document.querySelector("#join-user").addEventListener("click", () => {
  let userName = document.querySelector("#username").value;
  if (userName.length === 0) {
    return;
  }
  uName = userName;
  socket.emit("NewUser", userName);
  document.querySelector(".join-screen").classList.remove("active");
  document.querySelector(".chat-screen").classList.add("active");
});

document.querySelector("#send-message").addEventListener("click", () => {
  sendMessage();
});

document
  .querySelector("#message-input")
  .addEventListener("keydown", (event) => {
    if (event.keyCode === 13) {
      // Check if Enter key is pressed
      sendMessage();
    }
  });

function sendMessage() {
  let message = document.querySelector("#message-input").value;
  if (message.length === 0) {
    return;
  }

  showmessage("mymessage", {
    userName: uName,
    text: message,
  });

  socket.emit("Chat", {
    userName: uName,
    text: message,
  });

  document.querySelector("#message-input").value = "";
}

socket.on("update", (update) => {
  showmessage("update", { text: update });
});

socket.on("chatmessage", (message) => {
  showmessage("othermessage", message);
});

socket.on("userjoined", (userName) => {
  showmessage("update", { text: userName + " joined the room " });
});

function showmessage(type, data) {
  let messagecontainer = document.querySelector(
    ".chat-screen .message-container"
  );
  if (type === "mymessage") {
    let element = document.createElement("div");
    element.setAttribute("class", "message my-message");
    element.innerHTML = `
        <div>
          <div class="name">Your Message:</div>
          <div class="text">${data.text}</div>
        </div>`;
    messagecontainer.appendChild(element);
  } else if (type === "othermessage") {
    let element = document.createElement("div");
    element.setAttribute("class", "message other-message");
    element.innerHTML = `
        <div>
          <div class="name">${data.userName}</div>
          <div class="text">${data.text}</div>
        </div>`;
    messagecontainer.appendChild(element);
  } else if (type === "update") {
    let element = document.createElement("div");
    element.setAttribute("class", "message update-message");
    element.innerHTML = `
        <div class="update">${data.text}</div>`;
    messagecontainer.appendChild(element);
  }
  messagecontainer.scrollTop = messagecontainer.scrollHeight;
}
