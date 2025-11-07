import { test } from 'node:test';
import assert from 'assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { JSDOM } from 'jsdom';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const readProjectFile = (filename) => fs.readFileSync(path.join(__dirname, '..', filename), 'utf8');

const createDom = () => {
  const html = readProjectFile('index.html');
  const script = readProjectFile('index.js');
  const combined = html.replace('</body>', `<script>${script}</script></body>`);
  const dom = new JSDOM(combined, { runScripts: 'dangerously', resources: 'usable' });
  return dom;
};

const addUser = (document, name) => {
  const input = document.getElementById('user-name');
  const btn = document.getElementById('add-user');
  input.value = name;
  btn.click();
};

test('shows empty hint initially', () => {
  const dom = createDom();
  const { document } = dom.window;
  const hint = document.querySelector('.empty-hint');
  assert.ok(hint, 'Empty hint should be present when list is empty');
  dom.window.close();
});

test('add user and remove empty hint', () => {
  const dom = createDom();
  const { document } = dom.window;
  addUser(document, 'Alice');
  const item = document.querySelector('.user-item');
  assert.ok(item, 'User item should be added');
  const name = item.querySelector('.user-name');
  assert.strictEqual(name.textContent, 'Alice');
  const hint = document.querySelector('.empty-hint');
  assert.strictEqual(hint, null, 'Empty hint should be removed after adding a user');
  dom.window.close();
});

test('toggle select on click', () => {
  const dom = createDom();
  const { document } = dom.window;
  addUser(document, 'Bob');
  const item = document.querySelector('.user-item');
  item.click();
  assert.ok(item.classList.contains('selected'), 'Item should have selected class after click');
  item.click();
  assert.ok(!item.classList.contains('selected'), 'Item should toggle off selected class after second click');
  dom.window.close();
});

test('edit user name with Enter', () => {
  const dom = createDom();
  const { document, KeyboardEvent } = dom.window;
  addUser(document, 'Carl');
  const item = document.querySelector('.user-item');
  const editBtn = item.querySelector('.btn-edit');
  const nameEl = item.querySelector('.user-name');
  editBtn.click();
  nameEl.textContent = 'Carlton';
  const ev = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
  nameEl.dispatchEvent(ev);
  assert.strictEqual(nameEl.textContent, 'Carlton');
  assert.ok(!nameEl.isContentEditable, 'Name element should not be editable after finish');
  dom.window.close();
});

test('delete user and show empty hint', () => {
  const dom = createDom();
  const { document } = dom.window;
  addUser(document, 'Dana');
  const item = document.querySelector('.user-item');
  const deleteBtn = item.querySelector('.btn-delete');
  deleteBtn.click();
  const afterItem = document.querySelector('.user-item');
  assert.strictEqual(afterItem, null, 'User item should be removed after delete');
  const hint = document.querySelector('.empty-hint');
  assert.ok(hint, 'Empty hint should reappear after deleting last user');
  dom.window.close();
});

test('filter selected vs all', () => {
  const dom = createDom();
  const { document } = dom.window;
  addUser(document, 'One');
  addUser(document, 'Two');
  const items = document.querySelectorAll('.user-item');
  const first = items[0];
  const second = items[1];
  first.click();
  const filterSelected = document.getElementById('filter-selected');
  const filterAll = document.getElementById('filter-all');
  filterSelected.click();
  assert.notStrictEqual(first.style.display, 'none', 'Selected item should be visible after filter');
  assert.strictEqual(second.style.display, 'none', 'Unselected items should be hidden after filter selected');
  filterAll.click();
  assert.notStrictEqual(first.style.display, 'none', 'First should be visible after show all');
  assert.notStrictEqual(second.style.display, 'none', 'Second should be visible after show all');
  dom.window.close();
});
