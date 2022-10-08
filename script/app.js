let theme = localStorage.getItem("theme") || "light",
  toggle = document.querySelector(".toggle"),
  toggleTheme = localStorage.getItem("toggle") || false;

if (theme) {
  document.documentElement.setAttribute("data-theme", theme);
  if (theme == "light") {
    toggle.innerHTML = '<i class="fa-regular fa-sun"></i>';
  } else {
    toggle.innerHTML = '<i class="fa-regular fa-moon"></i>';
  }
} else {
  docuent.documentElement.setAttribute("data-theme", light);
  toggle.innerHTML = '<i class="fa-regular fa-moon"></i>';
}

if (toggleTheme) {
  toggle.classList.add(toggleTheme);
}

toggle.onclick = () => {
  let currentTheme = document.documentElement.getAttribute("data-theme"),
    targetTheme = "light";

  if (currentTheme === "light") {
    targetTheme = "dark";
  }

  document.documentElement.setAttribute("data-theme", targetTheme);
  localStorage.setItem("theme", targetTheme);

  toggleSet();
};

const toggleSet = () => {
  toggle.classList.toggle("active");
  if (toggle.classList.contains("active")) {
    localStorage.setItem("toggle", "active");
    toggle.innerHTML = '<i class="fa-regular fa-moon"></i>';
  } else {
    localStorage.removeItem("toggle");
    toggle.innerHTML = '<i class="fa-regular fa-sun"></i>';
  }
};

// Section for deal with creating , searching , reading , pushing and seting

let addListPoint = document.querySelector(".list-point"), // Button in footer for create list
  addNote = document.querySelector(".note"), // Button in footer for create note
  contentWrapper = document.querySelector(".content-wrapper"), // Section with ready lists
  listsCount = contentWrapper.children, // Count lists on page
  menuWrapper = document.querySelector(".menu-wrapper"), // Section with creating menus
  listPointMenu = document.querySelector(".list-point-menu"), // Menu for creating list
  inputsContainer = document.querySelector(".inputs"),
  addPoint = document.querySelector(".point-add"),
  noteMenu = document.querySelector(".note-menu"), // Menu for creating Note
  addNoteButtons = document.querySelectorAll(".add-note"), // Buttons for push (add) note
  items = localStorage.getItem('"list1"') || false, // Check for availability the first key
  i = 0; // Index

// Cheked for availability and create a web page
if (items) {
  for (let j = 1; localStorage.getItem(`"list${j}"`); j++) {
    let item = JSON.parse(localStorage.getItem(`"list${j}"`));
    for (let key in item) {
      let newNote = document.createElement("section");
      newNote.setAttribute("class", "list");
      newNote.innerHTML += item[key];
      contentWrapper.append(newNote);
    }
  }
}

// Open a context menu with list creating

addListPoint.onclick = () => {
  menuWrapper.classList.add("active");
  listPointMenu.classList.add("active");
};

// Open a context menu with note creating

addNote.onclick = () => {
  menuWrapper.classList.add("active");
  noteMenu.classList.add("active");
};

// Create a new point for list
const newInputCreate = () => {
  let newInput = document.createElement("input");
  newInput.type = "text";
  newInput.setAttribute("class", "point");

  return newInput;
};

// Add new input for list
addPoint.onclick = () => {
  inputsContainer.appendChild(newInputCreate());
};

// Close Menu Constructor with saving values

menuWrapper.onclick = CloseMenu;
function CloseMenu() {
  menuWrapper.classList.remove("active");
  if (listPointMenu.classList.contains("active")) {
    listPointMenu.classList.remove("active");
  } else if (noteMenu.classList.contains("active")) {
    noteMenu.classList.remove("active");
  }
}

// Get correct index

const correctIndex = () => {
  i = listsCount.length + 1;

  return i;
};

// Set Event for create a new note
addNoteButtons.forEach((button) => {
  button.addEventListener("click", addNoteFunc);
});

// Function for creating a new section for note
const newNoteCreate = () => {
  const newNote = document.createElement("section");
  newNote.setAttribute("class", "list");

  return newNote;
};

// Create a caption
const captionCreate = () => {
  const caption = document.createElement("h2");
  listPointMenu.classList.contains("active")
    ? (caption.innerHTML = listPointMenu.querySelector("#head-list").value)
    : // noteMenu.classList.contains("active") ?
      (caption.innerHTML = noteMenu.querySelector("#head-note").value);

  correctIndex();

  if (caption.innerHTML.length == 0) caption.innerHTML = `List ${i}`;
  return caption;
};

// Create a new Ul
const createList = () => {
  const ul = document.createElement("ul");

  return ul;
};

// PART OF CREATE A LIST CONTENT

// Create our Ul list for our WorkList
const createListContent = () => {
  let ul = document.createElement("ul");
  correctIndex();
  let values = listPointMenu.querySelectorAll(".point");
  values.forEach((el, index) => {
    let li = document.createElement("li");
    li.setAttribute("data-list-number", `${i}`);
    li.innerHTML = `<input type="checkbox" id="${i}${index}"/><label for="${i}${index}">${el.value}</label>`;
    ul.appendChild(li);
  });

  return ul;
};

// PART OF CREATE A NOTE CONTENT

// Create our paragraph for Note
const createNoteContent = () => {
  let value = noteMenu.querySelector("textarea").value;
  let p = document.createElement("p");
  p.innerHTML = value;

  return p;
};

// Create a Button "Save"
const createButtonSave = () => {
  let saveAll = document.createElement("button");
  saveAll.setAttribute("class", "save");
  saveAll.innerHTML = "Save";

  return saveAll;
};

// Collect and push our list or note
function addNoteFunc() {
  let newList = newNoteCreate();
  newList.appendChild(captionCreate());
  if (listPointMenu.classList.contains("active")) {
    newList.appendChild(createListContent());
  } else {
    newList.appendChild(createNoteContent());
  }
  newList.appendChild(createButtonSave());

  contentWrapper.append(newList);

  pushToStorage();

  let mainMenu = document.querySelector(".active .menu-main");
  clearMenu(mainMenu);
}

// Function for add note to Storage

const pushToStorage = () => {
  let arr = {};

  arr["content"] = contentWrapper.lastChild.innerHTML;

  let itemsContent = JSON.stringify(arr);

  localStorage.setItem(`"list${i}"`, itemsContent);
};

// Clear menu for next using

const clearMenu = (parent) => {
  let elements = parent.children;
  for (let element of elements) {
    if (element.tagName == "BUTTON") {
      continue;
    } else if (element.children.length > 0) {
      clearMenu(element);
    } else {
      element.value = "";
    }
  }
  CloseMenu();
};

// Function for open our list

let elementNumber;

contentWrapper.onclick = (e) => {
  let buttonSave;
  if (e.target.tagName == "SECTION" && !e.target.classList.contains("active")) {
    if (document.querySelector("section.active")) {
      document.querySelector("section.active").classList.remove("active");
    }
    e.target.classList.add("active");
    buttonSave = e.target.querySelector(".save");
    buttonSave.onclick = updateDate;
  } else {
    return;
  }
};

function updateDate(e) {
  let arr = {};
  let listsArray = contentWrapper.children;
  let arrElements = [];
  for (let i = 0; i < listsArray.length; i++) {
    arrElements.push(listsArray[i]);
  }
  elementNumber = arrElements.indexOf(e.target.parentElement);

  arr["content"] = listsArray[elementNumber].innerHTML;

  let itemsContent = JSON.stringify(arr);

  localStorage.setItem(`"list${elementNumber + 1}"`, itemsContent);

  listsArray[elementNumber].classList.remove("active");
}
