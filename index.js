const userNameInput = document.getElementById('user-name');
const addUserButton = document.getElementById('add-user');
const userList = document.getElementById('user-list');
const filterAllButton = document.getElementById('filter-all');
const filterSelectedButton = document.getElementById('filter-selected');


function addUser (name){
    const userList = document.getElementById('user-list');
    const listItem = document.createElement('li');
    listItem.className = 'user-item';
    const id = Date.now();
    listItem.dataset.id = id
    listItem.className = 'user-item';
    userList.appendChild(listItem);
    return id;
}

function removeUser(id) {
    const userElement = document.querySelector(`.user-item[data-id="${id}"]`);
    if (userElement) {
        userElement.remove();
        console.log(`Пользователь с ID ${id} успешно удален`);
        updateEmptyHint();
        return true;
    } else {
        console.log(`Пользователь с ID ${id} не найден`);
        return false;
    }
}

function editUser(id, newName) {
    const userElement = document.querySelector(`.user-item[data-id="${id}"]`);
    if (userElement) {
        const nameElement = userElement.querySelector('.user-name');
        const oldName = nameElement.textContent;
        nameElement.textContent = newName;
        console.log(`Было: ${oldName}. Стало: ${newName}`);
        return true;
    } else {
        console.log(`Пользователь с ID ${id} не найден`);
        return false;
    }
}
function toggleSelect(id) {
    const listItem = userList.querySelector(`.user-item[data-id="${id}"]`);
    if (listItem) {
        listItem.classList.toggle('selected');
        applyCurrentFilter();
    }
}

function filterUsers(mode) {
    currentFilter = mode;
    filterAllButton.classList.toggle('active', mode === 'all');
    filterSelectedButton.classList.toggle('active', mode === 'selected');
    applyCurrentFilter();
}