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

// Add new input for list

addPoint.onclick = () => {
  let newInput = document.createElement("input");
  newInput.type = "text";
  newInput.setAttribute("class", "point");
  inputsContainer.appendChild(newInput);
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

addNoteButtons.forEach((button) => {
  button.addEventListener("click", addNoteFunc);
});

if (listsCount.length > 0) {
  i = listsCount.length + 1;
} else {
  i = 1;
}

// Function for creating a new note and pushing all needeadly values inside, and push this note on web-page

function addNoteFunc() {
  console.log(i);
  let caption;
  let values;
  let arr = {};
  // Create a list for a future
  const ul = document.createElement("ul");

  // Create a new section ( Note )
  const newNote = document.createElement("section");
  newNote.setAttribute("class", "list");

  // Create a field
  const head = document.createElement("h2");
  if (listPointMenu.classList.contains("active")) {
    caption = listPointMenu.querySelector("#head-list").value;
    values = listPointMenu.querySelectorAll(".point");
    values.forEach((el, index) => {
      ul.innerHTML += `<li><input type="checkbox" id="${i}${index}"/><label for="${i}${index}">${el.value}</label></li>`;
      newNote.append(ul);
    });
    // Add our list to note
  } else {
    caption = noteMenu.querySelector("#head-note").value;
    values = noteMenu.querySelector("textarea").value;
    let p = document.createElement("p");
    p.innerHTML = values;
    // Add our paragraph to note
    newNote.append(p);
  }
  head.innerHTML = caption;

  if (head.innerHTML.length == 0) {
    head.innerHTML = `List ${i}`;
  }

  let saveAll = document.createElement("button");
  saveAll.setAttribute("class", "save");
  saveAll.innerHTML = "Save";

  // Push header to note;
  newNote.prepend(head);
  newNote.appendChild(saveAll);
  contentWrapper.append(newNote);

  arr["content"] = newNote.innerHTML;

  let itemsContent = JSON.stringify(arr);

  localStorage.setItem(`"list${i}"`, itemsContent);
  i++;

  let mainMenu = document.querySelector(".active .menu-main");
  clearMenu(mainMenu);
}

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
  } else {
    return;
  }
  // buttonSave.addEventListener("click", updateDate);
  buttonSave.onclick = updateDate;
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
