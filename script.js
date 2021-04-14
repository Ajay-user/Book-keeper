const showModal = document.getElementById("show-modal");
const modal = document.getElementById("bookmark-form-container");
const closeModal = document.getElementById("close-modal");

const websiteNameEl = document.getElementById("website-name");
const websiteUrlEl = document.getElementById("website-url");
const submitBtn = document.getElementById("submit-form");

const bookmarkContainer = document.getElementById("bookmark-container");

// display the modal
const showModalForm = () => {
  modal.classList.add("bookmark-form-display");
};
// close the modal
const closeModalForm = () => {
  modal.classList.remove("bookmark-form-display");
};

// validate input url
const isUrlValid = (urlVal) => {
  var expression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
  var regex = new RegExp(expression);
  if (!urlVal.match(regex)) {
    return false;
  }
  return true;
};

// check for empty values and validates
const validateInputs = (name, url) => {
  if (!name || !url) {
    alert("please enter the data before submitting ");
    return false;
  }
  if (!isUrlValid(url)) {
    alert("enter a valid url");
    return false;
  }
  return true;
};

// gets the bookmarks obj from localStorage
const fetchFromLocalStore = () => {
  let bookmarks = {};
  if (window.localStorage.getItem("bookmarks")) {
    bookmarks = JSON.parse(window.localStorage.getItem("bookmarks"));
  }
  return bookmarks;
};
// persist the name and url by adding then to local storage
const addToLocalStore = (name, url) => {
  const bookmarks = fetchFromLocalStore();
  if (!bookmarks[name]) {
    // if key-val pair don't exist then add
    bookmarks[name] = url;
    window.localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  } else {
    alert("bookmark already exist");
  }
};

// fill the container with bookmarks
const buildBookmarkContainer = () => {
  const bookmarks = fetchFromLocalStore(); //fetch from localstoreage
  //  this clear the contents which are already inside
  bookmarkContainer.innerText = "";

  for (const [key, value] of Object.entries(bookmarks)) {
    console.log(`${key}: ${value}`);

    const item = document.createElement("div");
    item.classList.add("item");

    const anchor = document.createElement("a");
    anchor.href = value;
    anchor.innerText = key;
    anchor.setAttribute("target", "_blank");

    const icon = document.createElement("i");
    icon.classList.add("fas", "fa-times-circle");
    icon.onclick = () => deleteBookmark(key);

    item.append(anchor, icon);
    bookmarkContainer.appendChild(item);
  }
};

// delete the bookmarks
const deleteBookmark = (key) => {
  let bookmarks = fetchFromLocalStore();
  if (bookmarks[key]) {
    delete bookmarks[key];
  }
  window.localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  buildBookmarkContainer();
};

// save the form inputs
const saveBookmark = (e) => {
  e.preventDefault();
  let name = websiteNameEl.value;
  let url = websiteUrlEl.value;
  if (!validateInputs(name, url)) {
    return;
  }
  if (!url.includes("https") || !url.includes("http")) {
    url = `https://${url}`;
  }

  //   persist the name and url
  addToLocalStore(name, url);
  //   build the bookmarks container
  buildBookmarkContainer();
  // close the form
  closeModalForm();
};

//  EventListener
showModal.addEventListener("click", showModalForm);
closeModal.addEventListener("click", closeModalForm);
submitBtn.addEventListener("click", saveBookmark);

// on load
buildBookmarkContainer();
