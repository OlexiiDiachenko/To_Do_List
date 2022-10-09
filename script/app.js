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

// Set checked for checkboxs, which earlier we have mark
const inputsCheckboxs =
  document.querySelectorAll("input[type='checkbox']") || false;

if (inputsCheckboxs) {
  inputsCheckboxs.forEach((checkbox) => {
    if (checkbox.getAttribute("data-status")) {
      checkbox.checked = "true";
    }
  });
}

// Function for remove item or items frome parent Node
const removeItem = (parentElement, item) => {
  while (parentElement.lastChild.tagName == item) {
    let lastCloseItemChild = parentElement.lastChild;
    lastCloseItemChild.remove();
  }
};

// Cleare our Lists from needless buttons
const sections = document.querySelectorAll("section.list") || false;

if (sections) {
  sections.forEach((section) => {
    if (section.lastElementChild.tagName == "BUTTON") {
      removeItem(section, "BUTTON");
    }
  });
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

addPoint.onclick = () => {
  createNewField(inputsContainer);
};

// Add new input for list
function createNewField(parent) {
  parent.appendChild(newInputCreate());
}

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

// Set Event for 'Enter' to create a new note
window.addEventListener("keydown", (e) => {
  if (event.keyCode === 13) {
    addNoteFunc();
  }
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
  correctIndex();
  let ul = document.createElement("ul");
  ul.setAttribute("data-list-number", `${i}`);
  let values = listPointMenu.querySelectorAll(".point");
  values.forEach((el, index) => {
    let li = document.createElement("li");
    li.innerHTML = `<input type="checkbox" id="${i}${index}"/><label for="${i}${index}">${el.value}</label>`;
    ul.appendChild(li);
  });

  return ul;
};

// PART OF CREATE A NOTE CONTENT

// Create our paragraph for Note
const createNoteContent = () => {
  correctIndex();
  let value = noteMenu.querySelector("textarea").value;
  let p = document.createElement("p");
  p.setAttribute("data-list-number", `${i}`);
  p.innerHTML = value;

  return p;
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

  contentWrapper.append(newList);

  pushToStorage(contentWrapper.lastChild, i);

  let mainMenu = document.querySelector(".active .menu-main");
  clearMenu(mainMenu);
}

// Function for add note to Storage

const pushToStorage = (element, index) => {
  let arr = {};

  arr["content"] = element.innerHTML;

  let itemsContent = JSON.stringify(arr);

  localStorage.setItem(`"list${Number(index)}"`, itemsContent);
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
      let closeItem = document.querySelector("section.active");
      removeItem(closeItem, "BUTTON");
      closeItem.classList.remove("active");
    }
    e.target.classList.add("active");
    createButtonOk(e.target);
    createEditButton(e.target);
    createRemoveItemButton(e.target);
  } else {
    return;
  }
};

// Functions suppots for open our list

// Create a Button 'Ok'

const createButtonOk = (element) => {
  let buttonOk = document.createElement("button");
  buttonOk.setAttribute("class", "ok");
  buttonOk.innerHTML = "Ok";
  buttonOk.addEventListener("click", ok);
  element.append(buttonOk);
};

const ok = (e) => {
  let parent = e.target.parentElement;
  parent.classList.remove("active");
  removeItem(parent, "BUTTON");
};

// Create a Button "Save"
const createButtonSave = (element) => {
  let saveAll = document.createElement("button");
  saveAll.setAttribute("class", "save");
  saveAll.innerHTML = "Save";
  saveAll.addEventListener("click", updateDate);

  element.append(saveAll);
};

//  Create Edit Button
const createEditButton = (element) => {
  let editButton = document.createElement("button");
  editButton.setAttribute("class", "edit");
  editButton.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
  element.appendChild(editButton);
  if (element.querySelector("label")) {
    editButton.addEventListener("click", setEditList);
  } else {
    editButton.addEventListener("click", setEditNote);
  }
};

// Create Remove Item Button

const createRemoveItemButton = (parent) => {
  let removeItemButton = document.createElement("button");
  removeItemButton.setAttribute("class", "remove-item");
  removeItemButton.innerHTML = `<i class="fa-solid fa-trash"></i>`;
  parent.appendChild(removeItemButton);
  removeItemButton.addEventListener("click", removeOneItem);
};

// Function for get changes for List
const setEditList = () => {
  let parent = document.querySelector("section.active");
  let buttonOk = document.querySelector(".active .ok");
  buttonOk.remove();
  createButtonSave(parent);
  document.querySelector(".edit").disabled = "true";
  let ul = document.querySelector(".active ul");
  createAddInputButton(ul);
  getIds("label");
  getData("label");
};

// Create button "Add a new item"
const createAddInputButton = (parent) => {
  parent.insertAdjacentHTML(
    "afterEnd",
    `<button class="point-add" type="button"><i class="fa-solid fa-plus"></i> add a item</button>`
  );
};

// Get All data in Ul in List

// Get Ids
const getIds = (element) => {
  let ul = document.querySelector(".active ul");
  let items = document.querySelectorAll(`.active ${element}`);
  let ids = [];
  items.forEach((item) => {
    let siblingId = item.previousElementSibling.getAttribute("id");
    ids.push(siblingId);
  });
  document.querySelector(".active .point-add").onclick = () => {
    createNewListField(ul, ids);
  };
};

// Change tags from label to input:text
const getData = (element) => {
  let labels = document.querySelectorAll(`.active ${element}`);
  let elements = [];
  labels.forEach((item) => {
    let value = item.innerHTML;
    item.outerHTML = `<input type='text' class='new-data' value='${value}' />`;
  });
};

// Create a new field in List for update data
const createNewListField = (parent, forArr) => {
  let index = Number(forArr[forArr.length - 1]) + 1;
  let newField = document.createElement("li");
  newField.innerHTML = `<input type="checkbox" id="${index}" />
  <input type='text' class="new-data"/>`;
  parent.append(newField);
  forArr.push(index);
};

// Set new values for List
const newValuesList = (parent) => {
  let newDatas = parent.querySelectorAll("input.new-data");
  newDatas.forEach((data) => {
    let idToFor = data.previousElementSibling.getAttribute("id");
    let value = data.value;
    data.outerHTML = `<label for="${idToFor}">${value}</label>`;
  });
};

// Function for get changes for Note
const setEditNote = () => {
  let parent = document.querySelector("section.active");
  let buttonOk = document.querySelector(".active .ok");
  buttonOk.remove();
  createButtonSave(parent);
  let paragraph = document.querySelector(".active p");
  let num = paragraph.getAttribute("data-list-number");
  let text = paragraph.innerHTML;

  paragraph.outerHTML = `<textarea data-list-number='${num}'>${text}</textarea>`;
};

// Function for get changes for Note
const newValuesNote = () => {
  let paragraph = document.querySelector(".active textarea");
  let num = paragraph.getAttribute("data-list-number");
  let value = paragraph.value;

  paragraph.outerHTML = `<p data-list-number='${num}'>${value}</p>`;
};

// Fucntion for close list and set new values. SET CHANGES
const updateDate = (e) => {
  let wrapper = e.target.parentElement;
  let number;
  if (wrapper.querySelector("input.new-data")) {
    newValuesList(wrapper);
    number = document
      .querySelector(".active ul")
      .getAttribute("data-list-number");
  } else {
    newValuesNote(wrapper);
    number = document
      .querySelector(".active p")
      .getAttribute("data-list-number");
  }
  removeItem(wrapper, "BUTTON");
  pushToStorage(wrapper, number);
  wrapper.classList.remove("active");
};

// Add event for our checkboxs

let main = document.querySelector("main");

const setStatus = (e) => {
  if (
    e.target.classList.contains("list") &&
    e.target.classList.contains("active")
  ) {
    let wrapper = e.target;
    if (wrapper.querySelector("ul")) {
      let checkboxs = wrapper.querySelectorAll('input[type="checkbox"]');
      checkboxs.forEach((checkbox) => {
        checkbox.addEventListener("click", setDataStatus);
      });
    } else {
      return;
    }
  } else {
    return;
  }
};

function setDataStatus() {
  let wrapper = document.querySelector("section.active");
  let number = wrapper.querySelector("ul").getAttribute("data-list-number");
  if (this.getAttribute("data-status")) {
    this.removeAttribute("data-status");
    this.unchecked = "true";
  } else {
    this.setAttribute("data-status", "completed");
    this.checked = "true";
  }
  console.log(this);
  pushToStorage(wrapper, number);
}

main.addEventListener("click", setStatus);

// Fuctnions Clear

let clearAll = document.querySelector(".clearAll");
clearAll.onclick = () => {
  removeItem(contentWrapper, "SECTION");
};

function removeOneItem() {
  let checkBlock = this.parentElement.querySelector("ul") || false;
  let index;

  if (checkBlock) {
    index = checkBlock.getAttribute("data-list-number");
  } else {
    index = checkBlock
      .querySelector(".active p")
      .getAttribute("data-list-number");
  }

  if (this.parentElement.tagName == "SECTION") {
    removeSection(this, index);
  } else {
    this.parentElement.remove();
  }
}

function removeSection(element, number) {
  localStorage.removeItem(`"list${number}"`);
  element.parentElement.remove();
}

// Function SaveAll

let saveAll = document.querySelector(".saveAll");
saveAll.onclick = () => {
  let activeSection = document.querySelector("section.active") || false;
  if (activeSection) {
    removeItem(activeSection, "BUTTON");
    activeSection.classList.remove("active");
  }
  let listsSecions = document.querySelectorAll("section.list") || false;
  if (listsSections) {
    listsSections.forEach((section) => {
      let index = Number(
        section.lastElementChild.getAttribute("data-list-number")
      );
      pushToStorage(section, index);
    });
  }
};
