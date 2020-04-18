

const noteEl = document.querySelector('.notes');
const textEl = document.querySelector('.textfield');
const btn = document.querySelector('.btn');
const filt = document.querySelector('.filter');
// Local array
let valData = [];
// Array for getting the unique id from Firebase
let refData = [];

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
  refData = Object.entries(data.val());
  valData = Object.values(data.val());
  // Getting data from firebase and rendering it in the DOM
  render(valData);
}

// Creating data in Firebase
function saveAndRender(userInp) {
  ref.push({
    id: new Date().getTime(),
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
  const delId = parseInt(e.currentTarget.parentElement.dataset.id);

  const valIndex = valData.findIndex(item => {
    return item.id === delId;
  });

  const fireRef = refData.find(item => {
    return item[1].id === delId;
  });

  // console.log(fireRef[0]);
  const delFire = db.ref('notes/' + fireRef[0]);
  valData.splice(valIndex, 1);
  delFire.remove();
  currentEl.remove();
}

// Update

function handleEdit(e) {
  const editId = parseInt(e.currentTarget.parentElement.dataset.id);
  const inEl = document.createElement('input');

  inEl.classList.add('edit');
  // inEl.value = notes_arr.find(item => (item.id === editId))['note']
  inEl.value = valData.find(item => {
    return item.id === editId;
  }).note;

  const p = noteEl.querySelector(`.note[data-id="${editId}"]`);
  p.replaceWith(inEl);
  inEl.focus();

  inEl.addEventListener('blur', e => {
    valData.map(item => {
      if (editId === item.id) {
        item.note = inEl.value;
      }
      return item;
    });
    // Getting the Database ID
    const fireRef = refData.find(item => {
      return item[1].id === editId;
    });

    // Updating the value in the DB
    let newEditValue = inEl.value;
    console.log(newEditValue);

    db.ref('notes/' + fireRef[0]).update({
      note: newEditValue
    });
  });
}

// filter feature
filt.addEventListener('input', e => {
  // Whenever the input event is cleared...
  const filArr = valData.filter(item => {
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
    pEl.classList.add('note');
    // pEl.setAttribute('contenteditable', 'true');
    pEl.setAttribute('data-id', `${item.id}`);
    pEl.innerHTML = `${item.note} <i class="fas fa-edit"></i> <i class="fas fa-trash-alt"></i>`;
    noteEl.appendChild(pEl);
    const delEl = pEl.querySelector('.fa-trash-alt');
    delEl.addEventListener('click', deletion);

    const editEl = pEl.querySelector('.fa-edit');
    editEl.addEventListener('click', handleEdit);
  });
}

/* 

Origin (Github):
-> master: v2->a->b->d->e

Local (your computer):
-> master: v2->a->b->d

*/
