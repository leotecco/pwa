'use strict'

const notes = JSON.parse(window.localStorage.getItem('notes')) || { data: [] }

/* DOM */
const getNotesDOM = () => document.querySelector('#notes')
const getNotesLiDOM = () => document.querySelectorAll('#notes li')
const loadDOMCachedNotes = ($notes) => notes.data.forEach(note => createLiInUl($notes, note))
const createLiInUl = ($ul, value) => {
  const $li = document.createElement('li')
  $li.innerHTML = value
  $ul.appendChild($li)
}
const checkAction = (changes) => {
  const index = changes[0].index
  const value = changes[0].object[index]
  const status = (changes[0].type === 'update') ? 'updated' : (changes[0].addedCount > 0) ? 'created' : 'removed'

  return { index, value, status }
}
const loadObserver = () => Array.observe(notes.data, (changes) => {
  const $notes = getNotesDOM()
  const $notesLi = getNotesLiDOM()
  const action = checkAction(changes)

  switch (action.status) {
    case 'created':
      createLiInUl($notes, action.value)
      break
    case 'removed':
      $notes.removeChild($notesLi[action.index])
      break

    case 'updated':
      alert('Ação não implementada!')
      break

    default:
      alert('Ação não implementada!')
      break
  }

  window.localStorage.setItem('notes', JSON.stringify(notes))
})

/* ARRAY */
const findNoteIndex = (searchedNote) => notes.data.findIndex((note) => note === searchedNote)
const createNote = (event) => {
  event.preventDefault()

  const $input = document.querySelector('#form-add-note input[type="text"]')
  const value = $input.value

  if (value) notes.data.push(value)

  $input.value = ''
}
const deleteNote = (event) => {
  const question = confirm('Deseja realmente excluir esta nota?')
  const deletedNote = findNoteIndex(event.target.innerHTML)

  if (question && deletedNote > -1) {
    notes.data.splice(deletedNote, 1)
    console.log('NOTES: ', notes.data)
  }
}

/* START */
document.addEventListener('DOMContentLoaded', (event) => {
  const $formAddNotes = document.querySelector('#form-add-note')
  const $notes = getNotesDOM()
  const $notesLi = getNotesLiDOM()

  console.log('[Application] start watch')
  loadObserver($notes, $notesLi)
  loadDOMCachedNotes($notes)
  $formAddNotes.addEventListener('submit', createNote)
  $notes.addEventListener('click', deleteNote)
})

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('serviceWorker.js')
    .then((reg) => {
      console.log('Service worker registered!')
    })
    .catch((err) => {
      console.log('Service worker error', err)
    })
}