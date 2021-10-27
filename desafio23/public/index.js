const socket = io();

socket.on("productList", (data) => {
  const template = Handlebars.compile(`
    {{#if data}}
      <div class="table-responsive container">
        <table class="table table-dark table-sm text-center">
          <thead>
            <tr>
              <th scope="col">Nombre</th>
              <th scope="col">Precio</th>
              <th scope="col">Foto</th>
            </tr>
          </thead>
          <tbody>
              {{#each data}}
                <tr>
                  <td scope="row">{{this.title}}</td>
                  <td>{{this.price}}</td>
                  <td>
                    <img src={{this.thumbnail}} width="50rem">
                  </td>
                </tr>
              {{/each}}
          </tbody>
        </table>
      </div>
    {{else}}
      <div class="alert alert-danger container" role="alert">
        No hay productos!
      </div>
    {{/if}}
  `);
  document.getElementById("table").innerHTML = template({ data });
});

const formIsValid = () => {
  const emailUser = document.getElementById("email-user").value;
  const nameUser = document.getElementById("name-user").value;
  const surnameUser = document.getElementById("surname-user").value;
  const ageUser = document.getElementById("age-user").value;
  const aliasUser = document.getElementById("alias-user").value;
  const avatarUser = document.getElementById("avatar-user").value;
  const text = document.getElementById("text").value;
  const isValid = emailUser.trim() !== ""
    && text.trim() !== ""
    && nameUser.trim() !== ""
    && surnameUser.trim() !== ""
    && ageUser.trim() !== ""
    && aliasUser.trim() !== ""
    && avatarUser.trim() !== "";
  return isValid;
};

document.querySelector("#submit").addEventListener("click", (e) => {
  e.preventDefault();
  sendMessage()
})

const getActualDate = () => {
  const date = new Date();

  let day = date.getDate();
  if (day < 10) day = `0${day}`;

  let month = date.getMonth() + 1;
  if (month < 10) month = `0${month}`;

  const year = date.getFullYear();

  let hours = (date.getHours() < 10 ? '0' : '') + date.getHours();
  let minutes = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
  let seconds = (date.getSeconds() < 10 ? '0' : '' ) + date.getSeconds();
  
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};

const sendMessage = () => {
  if (!formIsValid()) {
    alert("Todos los campos son requeridos.");
    return;
  }
  socket.emit("new-message", {
    author: {
      email: document.getElementById("email-user").value,
      name: document.getElementById("name-user").value,
      surname: document.getElementById("surname-user").value,
      age: document.getElementById("age-user").value,
      alias: document.getElementById("alias-user").value,
      avatar: document.getElementById("avatar-user").value,
    },
    text: document.getElementById("text").value,
    date: getActualDate()
  });
  return false;
};

socket.on("messageList", (normalizedMessages) => {
  const author = new normalizr.schema.Entity('authors', {}, {
    idAttribute: 'email'
  });

  const message = new normalizr.schema.Entity('messages', { author }, {
    idAttribute: '_id'
  });

  const normalizedMsgsLength = JSON.stringify(normalizedMessages).length;

  const denormalizedMessages = normalizr.denormalize(normalizedMessages.result, [message], normalizedMessages.entities);
  const denormalizedMsgsLength = JSON.stringify(denormalizedMessages).length;

  document.getElementById("compression").innerHTML = `Compresion: ${Math.trunc((normalizedMsgsLength / denormalizedMsgsLength) * 100)}%`

  document.getElementById("msg-core").innerHTML = denormalizedMessages
    .map(({ author: { email }, text, date }) => `
      <div>
        <b style="color: blue;">${email}</b>
        <span style="color: brown;">[${date}]<i style="color: green;"> : ${text}</i></span>
      </div>`
    )
    .join(" ");
  clearInputs();
});

const clearInputs = () => {
  document.getElementById("email-user").value = "";
  document.getElementById("text").value = "";
  document.getElementById("name-user").value = "";
  document.getElementById("surname-user").value = "";
  document.getElementById("age-user").value = "";
  document.getElementById("alias-user").value = "";
  document.getElementById("avatar-user").value = "";
};