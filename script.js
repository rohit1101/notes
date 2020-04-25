const noteEl = document.querySelector('.notes');
const textEl = document.querySelector('.textfield');
const btn = document.querySelector('.btn');
const filt = document.querySelector('.filter');
// Local array
let newRef = [];

let firebaseConfig = {
  apiKey: 'AIzaSyDi8HS6rKIl_IzrEw6KTuLduukoQD9sZW4',
  authDomain: 'final-d45d7.firebaseapp.com',
  databaseURL: 'https://final-d45d7.firebaseio.com',
  projectId: 'final-d45d7',
  storageBucket: 'final-d45d7.appspot.com',
  messagingSenderId: '103164435210',
  appId: '1:103164435210:web:ba9e2ab5e783bc2dc478f3'
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
let db = firebase.database();
// Setting the ref as notes
let ref = db.ref('notes');
// Getting the value from the DB and call the callback function -> getData
ref.on('value', getData);

function getData(data) {
  let refData = [];
  refData = Object.entries(data.val());

  formatFireData(refData);
}

function formatFireData(item) {
  newRef = item.map(item => {
    return {
      key: item[0],
      createdAt: item[1].createdAt,
      note: item[1].note,
      editedAt: item[1].editedAt || null
    };
  });
  // Getting data from firebase then formating and rendering it in the DOM VERY IMPORTANT!!!!!!
  render(newRef);
}

// filter feature
filt.addEventListener('input', e => {
  // Whenever the input event is cleared...
  const filArr = newRef.filter(item => {
    return item.note
      .toLowerCase()
      .includes(e.currentTarget.value.toLowerCase());
  });
  render(filArr);
});

function render(items) {
  noteEl.innerHTML = '';
  items.forEach(item => {
    const pEl = document.createElement('p');
    const editLi = document.createElement('li');
    const createLi = document.createElement('li');
    pEl.classList.add('note');
    // pEl.setAttribute('contenteditable', 'true');
    pEl.setAttribute('data-createdAt', `${item.createdAt}`);
    pEl.innerHTML = `
    ${item.note} <i class="fas fa-edit"></i> <i class="fas fa-trash-alt"></i>
    Created on ${new Date(item.createdAt).toLocaleDateString()}, at ${new Date(
      item.createdAt
    ).toLocaleTimeString()} 
    `;
    if (item.editedAt !== null) {
      pEl.innerHTML = ` 
      ${item.note} <i class="fas fa-edit"></i> <i class="fas fa-trash-alt"></i>
      Created on ${new Date(
        item.createdAt
      ).toLocaleDateString()}, at ${new Date(
        item.createdAt
      ).toLocaleTimeString()}
      and 
      Edited on ${new Date(item.editedAt).toLocaleDateString()}, at ${new Date(
        item.editedAt
      ).toLocaleTimeString()}
      `;
    }

    noteEl.appendChild(pEl);
    const delEl = pEl.querySelector('.fa-trash-alt');
    delEl.addEventListener('click', deletion);

    const editEl = pEl.querySelector('.fa-edit');
    editEl.addEventListener('click', handleEdit);
  });
}

// Creating data in Firebase
function saveAndRender(userInp) {
  ref.push({
    createdAt: new Date().getTime(),
    note: userInp
  });
}

//Read
function handleClick(e) {
  e.preventDefault();
  if (textEl.value === '' || textEl.value === ' ') {
    return;
  }
  const userInp = textEl.value.trim();
  saveAndRender(userInp);
  textEl.value = '';
}

btn.addEventListener('click', handleClick);

// Delete

function deletion(e) {
  e.preventDefault();
  const currentEl = e.currentTarget.parentElement;
  const delId = parseInt(e.currentTarget.parentElement.dataset.createdat);

  const fireRef = newRef.find(item => {
    return item.createdAt === delId;
  });

  const delFire = db.ref('notes/' + fireRef.key);
  delFire.remove();
  currentEl.remove();
}

// Update

function handleEdit(e) {
  const editId = parseInt(e.currentTarget.parentElement.dataset.createdat);

  const inEl = document.createElement('input');
  inEl.classList.add('edit');
  // inEl.value = notes_arr.find(item => (item.id === editId))['note']
  inEl.value = newRef.find(item => {
    return item.createdAt === editId;
  }).note;

  const p = noteEl.querySelector(`.note[data-createdAt="${editId}"]`);
  p.replaceWith(inEl);
  inEl.focus();

  inEl.addEventListener('blur', e => {
    // Getting the Database ID
    const fireRef = newRef.find(item => {
      return item.createdAt === editId;
    });
    // Updating the value in the DB
    let newEditValue = inEl.value;
    db.ref('notes/' + fireRef.key).update({
      note: newEditValue,
      editedAt: new Date().getTime()
    });
  });
}
