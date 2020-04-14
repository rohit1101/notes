const noteEl = document.querySelector('.notes');
const textEl = document.querySelector('.textfield');
const btn = document.querySelector('.btn');

let notes_arr = JSON.parse(localStorage.getItem('Notes')) || [];
render();

console.log(notes_arr);

function saveAndRender() {
  localStorage.setItem('Notes', JSON.stringify(notes_arr));
}

function render() {
  noteEl.innerHTML = '';
  notes_arr.forEach(item => {
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

  textEl.value = '';
}

// Create

function handleClick(e) {
  e.preventDefault();
  if (textEl.value === '' || textEl.value === ' ') {
    return;
  }
  const userInp = textEl.value.trim();
  notes_arr.push({
    id: new Date().getTime(),
    note: userInp
  });
  saveAndRender();
  const pEl = document.createElement('p');
  pEl.classList.add('note');
  // pEl.setAttribute('contenteditable', 'true');
  pEl.setAttribute('data-id', `${new Date().getTime()}`);
  pEl.innerHTML = `${userInp} <i class="fas fa-edit"></i> <i class="fas fa-trash-alt"></i>`;
  noteEl.appendChild(pEl);
  textEl.value = '';

  const delEl = pEl.querySelector('.fa-trash-alt');
  delEl.addEventListener('click', deletion);

  const editEl = pEl.querySelector('.fa-edit');
  editEl.addEventListener('click', handleEdit);
}

btn.addEventListener('click', handleClick);

// Delete
function deletion(e) {
  e.preventDefault();
  const currentEl = e.currentTarget.parentElement;
  const delId = parseInt(e.currentTarget.parentElement.dataset.id);
  let d = notes_arr.findIndex(item => {
    return item.id === delId;
  });
  notes_arr.splice(d, 1);
  saveAndRender();

  currentEl.remove();
}

// Update

function handleEdit(e) {
  const editId = parseInt(e.currentTarget.parentElement.dataset.id);
  const inEl = document.createElement('input');
  inEl.classList.add('edit');

  // inEl.value = notes_arr.find(item => {
  //   return item.id === editId;
  // }).note;

  const p = noteEl.querySelector('.note');
  p.replaceWith(inEl);

  inEl.addEventListener('change', e => {
    notes_arr.map(item => {
      if (editId === item.id) {
        item.note = inEl.value;
      }
      saveAndRender();
      render();
    });
  });
}
