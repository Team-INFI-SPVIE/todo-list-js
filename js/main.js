//Select elements
const clear = document.querySelector(".clear");
const dateElement = document.getElementById("date");
const list = document.getElementById("list");
const input = document.getElementById("input");

// Classes names
const CHECK = "fa-circle-check";
const UNCHECK = "fa-circle";
const LINE_THROUGH = "lineThrough";

let idUpdate = "";
let nameUpdate = "";

let LIST, id;
let editable = false;

// getItem from localStorage
let data = localStorage.getItem("TODO");

// Clear to localstorage
clear.addEventListener("click", () => {
  localStorage.clear();
  location.reload();
});

//Show todays date
const options = { weekday: "long", month: "short", day: "numeric" };
const today = new Date();

dateElement.innerHTML = today.toLocaleDateString("fr-FR", options);

//  Add todo
const addTodo = (todo, id, done, trash) => {
  if (trash) {
    return;
  }

  const DONE = done ? CHECK : UNCHECK;
  const LINE = done ? LINE_THROUGH : "";

  const item = `
    <li class="item">
      <i class="fa-solid ${DONE} co" job="complete" id="${id}"></i>
      <p class="text ${LINE}">${todo}</p>
      <i class="fa-solid fa-pen-to-square ed" job="edit" id="${id}"></i>
      <i class="fa-solid fa-trash de" job="delete" id="${id}"></i>
    </li>
  `;

  const position = "beforeend";

  list.insertAdjacentHTML(position, item);
};

// Complete todo
const completeTodo = (todo) => {
  todo.classList.toggle(CHECK);
  todo.classList.toggle(UNCHECK);
  todo.parentNode.querySelector(".text").classList.toggle(LINE_THROUGH);

  LIST[todo.id].done = LIST[todo.id].done ? false : true;
};

// Delete todo
const deleteTodo = (todo) => {
  todo.parentNode.parentNode.removeChild(todo.parentNode);

  LIST[todo.id].trash = true;
};

const editTodo = (todo) => {
  editable = true;
  let todoItem = LIST[todo.id];
  input.value = todoItem.name;
  idUpdate = +todoItem.id;
};

document.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    const todo = input.value;

    if (todo && !editable) {
      addTodo(todo, id, false, false);

      LIST.push({
        name: todo,
        id: id,
        done: false,
        trash: false,
      });

      localStorage.setItem("TODO", JSON.stringify(LIST));

      id++;
    } else if (editable) {
      const todoUpdate = input.value;
      LIST[idUpdate].name = todoUpdate;
      editable = false;
      localStorage.setItem("TODO", JSON.stringify(LIST));
      window.location.reload();
    }

    input.value = "";
  }
});

list.addEventListener("click", (event) => {
  const element = event.target;
  const elementJob = element.attributes.job.value;

  if (elementJob == "complete") {
    completeTodo(element);
    localStorage.setItem("TODO", JSON.stringify(LIST));
  } else if (elementJob == "delete") {
    deleteTodo(element);
    localStorage.setItem("TODO", JSON.stringify(LIST));
  } else {
    editTodo(element);
    localStorage.setItem("TODO", JSON.stringify(LIST));
  }
});

// Load items to the interfae
const loadList = (arr) => {
  arr.forEach((item) => {
    addTodo(item.name, item.id, item.done, item.trash);
  });
};

// Check if data is not empty
if (data) {
  LIST = JSON.parse(data);
  id = LIST.lenght;
  loadList(LIST);
} else {
  LIST = [];
  id = 0;
}
