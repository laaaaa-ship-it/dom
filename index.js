const userNameInput = document.getElementById('user-name');
const addUserButton = document.getElementById('add-user');
const userList = document.getElementById('user-list');
const filterAllButton = document.getElementById('filter-all');
const filterSelectedButton = document.getElementById('filter-selected');

let currentFilter = 'all';

function addUser(name) {
    if (!name.trim()) return;
    
    const listItem = document.createElement('li');
    listItem.className = 'user-item';
    const id = Date.now();
    listItem.dataset.id = id;
    
    listItem.innerHTML = `
        <div class="user-left">
            <span class="user-name">${name}</span>
        </div>
        <div class="user-actions">
            <button type="button" class="btn-edit">Редактировать</button>
            <button type="button" class="btn-delete">Удалить</button>
        </div>
    `;
    
    userList.appendChild(listItem);
    userNameInput.value = '';
    updateEmptyHint();
    applyCurrentFilter();
}

function removeUser(id) {
    const userElement = document.querySelector(`[data-id="${id}"]`);
    if (userElement) {
        userElement.remove();
        updateEmptyHint();
    }
}

function editUser(id, newName) {
    const userElement = document.querySelector(`[data-id="${id}"]`);
    if (userElement) {
        const nameElement = userElement.querySelector('.user-name');
        nameElement.textContent = newName;
    }
}

function toggleSelect(id) {
    const listItem = document.querySelector(`[data-id="${id}"]`);
    if (listItem) {
        listItem.classList.toggle('selected');
        applyCurrentFilter();
    }
}

function filterUsers(mode) {
    currentFilter = mode;
    applyCurrentFilter();
}

function applyCurrentFilter() {
    const users = userList.querySelectorAll('.user-item');
    users.forEach(user => {
        user.style.display = currentFilter === 'selected' && !user.classList.contains('selected') ? 'none' : '';
    });
}

function updateEmptyHint() {
    const existingHint = document.querySelector('.empty-hint');
    const hasUsers = userList.querySelector('.user-item');
    
    if (!hasUsers && !existingHint) {
        const hint = document.createElement('p');
        hint.className = 'empty-hint';
        hint.textContent = 'Список пуст';
        userList.after(hint);
    } else if (hasUsers && existingHint) {
        existingHint.remove();
    }
}

addUserButton.addEventListener('click', () => {
    addUser(userNameInput.value);
});

userNameInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addUser(userNameInput.value);
});

userList.addEventListener('click', (e) => {
    const userItem = e.target.closest('.user-item');
    if (!userItem) return;
    
    const id = userItem.dataset.id;
    
    if (e.target.classList.contains('btn-delete')) {
        removeUser(id);
    } else if (e.target.classList.contains('btn-edit')) {
        const nameSpan = userItem.querySelector('.user-name');
        nameSpan.contentEditable = true;
        nameSpan.focus();
        nameSpan.dataset.originalName = nameSpan.textContent;
    } else {
        toggleSelect(id);
    }
});

userList.addEventListener('keydown', (e) => {
    if (e.target.classList.contains('user-name') && e.target.isContentEditable) {
        if (e.key === 'Enter') {
            e.preventDefault();
            e.target.contentEditable = false;
            const newName = e.target.textContent.trim();
            const id = e.target.closest('.user-item').dataset.id;
            if (newName) editUser(id, newName);
        }
    }
});

userList.addEventListener('blur', (e) => {
    if (e.target.classList.contains('user-name') && e.target.isContentEditable) {
        e.target.contentEditable = false;
    }
}, true);

filterAllButton.addEventListener('click', () => filterUsers('all'));
filterSelectedButton.addEventListener('click', () => filterUsers('selected'));

updateEmptyHint();