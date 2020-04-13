const noteEl = document.querySelector('.notes');
const textEl = document.querySelector('.textfield');
const btn = document.querySelector('.btn');

btn.addEventListener('click', handleClick);

function handleClick(e) {
  e.preventDefault();
  if (textEl.value === '' || textEl.value === ' ') {
    return;
  }

  const userInp = textEl.value.trim();

  const pEl = document.createElement('p');
  pEl.classList.add('note');
  pEl.setAttribute('contenteditable', 'true');
  pEl.innerHTML = `${userInp} <i class="fas fa-trash-alt"></i>`;
  noteEl.appendChild(pEl);
  textEl.value = '';

  const delEl = pEl.querySelector('.fas');
  delEl.addEventListener('click', deletion);
}

function deletion(e) {
  e.preventDefault();
  const currentEl = e.currentTarget.parentElement;
  currentEl.remove();
}
