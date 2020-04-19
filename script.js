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
  // // Getting data from firebase and rendering it in the DOM
}

// Creating data in Firebase
function saveAndRender(userInp) {
  ref.push({
    createdAt: new Date().getTime(),
    note: userInp
  });
  render(valData);
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
  const delId = parseInt(e.currentTarget.parentElement.dataset.createdAt);
  console.log(delId);

  const valIndex = valData.findIndex(item => {
    return item.createdAt === delId;
  });

  const fireRef = refData.find(item => {
    return item[1].createdAt === delId;
  });

  console.log(fireRef[0]);
  const delFire = db.ref('notes/' + fireRef[0]);
  valData.splice(valIndex, 1);
  delFire.remove();
  currentEl.remove();
}

// Update

function handleEdit(e) {
  const editId = parseInt(e.currentTarget.parentElement.dataset.createdAt);
  const inEl = document.createElement('input');

  inEl.classList.add('edit');
  // inEl.value = notes_arr.find(item => (item.id === editId))['note']
  inEl.value = valData.find(item => {
    return item.createdAt === editId;
  }).note;

  const p = noteEl.querySelector(`.note[data-createdAt="${editId}"]`);
  p.replaceWith(inEl);
  inEl.focus();

  inEl.addEventListener('blur', e => {
    valData.map(item => {
      if (editId === item.createdAt) {
        item.note = inEl.value;
      }
      return item;
    });
    // Getting the Database ID
    const fireRef = refData.find(item => {
      return item[1].createdAt === editId;
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
    // pEl.setAttribute('data-createdAt', `${item.createdAt}`);
    pEl.innerHTML = `${item.note} <i class="fas fa-edit"></i> <i class="fas fa-trash-alt"></i>`;
    noteEl.appendChild(pEl);
    const delEl = pEl.querySelector('.fa-trash-alt');
    delEl.addEventListener('click', deletion);

    const editEl = pEl.querySelector('.fa-edit');
    editEl.addEventListener('click', handleEdit);
  });
}
// /*
// Source
//   {
//     key-1: {createdAt, note},
//     key-2: {createdAt, note},
//   }

//   From firebase
//   {
//     "abc": {id: 121343,
//             note: "hi"},
//     "def": {id: 234343,
//             note: "bye"},
//   }

//   Transform to:
//   [{key: "abc", note: "hi", id: 12345},
//   {key: "def", note: "bye", id: 23433}]

// Destination:
// 1.  [{note, key-1, createdAt}
//     {note, key-2, createdAt}]

//     refData=[]
//     {
//       refData: []
//     }

//     {
//       refDAta: transform(obj)
//     }
// 2. arr=[['key-1',{id,note}],['key-2',{id,note}],['key-3',{id,note}]]
//     arr.forEach
//       obj = {
//         key: item[0],
//         note:item[1].note,
//         id:item[1].id
//       }
//       global_arr.push(obj)

//     function transformFirebaseData(firebaseData) -> 1
//       return firebase.map
//         obj = {
//         key: item[0],
//         note:item[1].note,
//         id:item[1].id
//       }
// */
