document.addEventListener('DOMContentLoaded', ()=> {
  const BASE_URL = 'http://localhost:3000/api/v1/calorie_entries/'
  const ce = (tag) => document.createElement(tag)
  const qs = (selector) => document.querySelector(selector)
  const ul = qs('#calories-list')
  qs('#new-calorie-form').children[1].children[0].firstElementChild.name = 'calorie'
  qs('#new-calorie-form').children[1].children[1].firstElementChild.name = 'note'
  const editForm = qs('#edit-calorie-form')
  editForm.children[1].children[0].firstElementChild.name = 'calorie'
  editForm.children[1].children[1].firstElementChild.name = 'note'

  const listItem = (item) => {
    const li = ce('li')
    ul.append(li)
    li.className = 'calories-list-item'
    li.dataset.id = item.id
    li.innerHTML = `
      <div class="uk-grid">
        <div class="uk-width-1-6">
          <strong>${item.calorie}</strong>
          <span>kcal</span>
        </div>
        <div class="uk-width-4-5">
          <em class="uk-text-meta">${item.note}</em>
        </div>
      </div>
      <div class="list-item-menu">
        <a class="edit-button" uk-toggle="target: #edit-form-container" uk-icon="icon: pencil" data-item-id="${item.id}"></a>
        <a class="delete-button" uk-icon="icon: trash"></a>
      </div>
    `

  }

  const getItems = () => {
    fetch(BASE_URL)
    .then(res => res.json())
    .then(items => items.forEach(listItem))
  }

  const submitHandler = () => {
    document.addEventListener('submit', e => {
      e.preventDefault()
      if (e.target.matches('#new-calorie-form')) {
        addItem(e.target)
      } else if (e.target.matches('#edit-calorie-form')) {
        editItem(e.target)
        editForm.reset()
        editForm.parentElement.parentElement.style.display = 'none'
      }
    })
  }

  const addItem = (target) => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        calorie: target.calorie.value,
        note: target.note.value
      })
    }

    fetch(BASE_URL, options)
    .then(res => res.json())
    .then(listItem)

    target.reset()
  }

  const editItem = (target) => {
    const itemId = target.dataset.itemId
    const options = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        calorie: target.calorie.value,
        note: target.note.value
      })
    }

    fetch(`${BASE_URL + itemId}`, options)
    .then(res => res.json())
    .then(item => {
      qs(`[data-id="${itemId}"]`).firstElementChild.firstElementChild.firstElementChild.textContent = item.calorie
      qs(`[data-id="${itemId}"]`).firstElementChild.lastElementChild.firstElementChild.textContent = item.note
    })
  }

  const deleteItem = (id) => {
    const options = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }

    fetch(`${BASE_URL + id}`, options)
  }


  const clickHandler = () => {
    document.addEventListener('click', e => {
      if (e.target.matches('[data-svg="pencil"]')) {
        editForm.dataset.itemId = e.target.parentElement.dataset.itemId
      } 
      else if (e.target.matches('[data-svg="trash"]')) {
        deleteId = e.target.parentElement.parentElement.parentElement.dataset.id
        deleteItem(deleteId)
        document.querySelector(`[data-id="${deleteId}"]`).remove()
      }
    })
  }


  getItems()
  submitHandler()
  clickHandler()
})
