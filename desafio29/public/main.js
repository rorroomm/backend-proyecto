const chatMessages = document.querySelector(".chat-messages");

const socket = io.connect();

socket.emit("askData");

function renderMsg(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<div class="user-info">
    <p class="meta">${message.email}</p> <span class="time-right"> ${message.timestamp}</span>
    </div>
    <p class="text-msg"> ${message.msg} </p>`;

  chatMessages.appendChild(div);
}

socket.on("messages", function (newMsg) {
  console.log("RENDERIZANDO DATA");
  document.getElementById("messages").innerHTML = newMsg
    .map(
      (entry) => `<div>
                      <strong class="author">${entry.email}</strong>
                      <span class="date-chat">${entry.timestamp}</span>
                      <em class="author-text">${entry.msg}</em>
                    </div>`
    )
    .join(" ");
  clearInputs();
});

function clearInputs() {
  document.getElementById("msg").value = "";
}
