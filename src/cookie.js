/**
 * ДЗ 7.2 - Создать редактор cookie с возможностью фильтрации
 *
 * На странице должна быть таблица со списком имеющихся cookie:
 * - имя
 * - значение
 * - удалить (при нажатии на кнопку, выбранная cookie удаляется из браузера и таблицы)
 *
 * На странице должна быть форма для добавления новой cookie:
 * - имя
 * - значение
 * - добавить (при нажатии на кнопку, в браузер и таблицу добавляется новая cookie с указанным именем и значением)
 *
 * Если добавляется cookie с именем уже существующией cookie, то ее значение в браузере и таблице должно быть обновлено
 *
 * На странице должно быть текстовое поле для фильтрации cookie
 * В таблице должны быть только те cookie, в имени или значении которых есть введенное значение
 * Если в поле фильтра пусто, то должны выводиться все доступные cookie
 * Если дабавляемая cookie не соответсвуте фильтру, то она должна быть добавлена только в браузер, но не в таблицу
 * Если добавляется cookie, с именем уже существующией cookie и ее новое значение не соответствует фильтру,
 * то ее значение должно быть обновлено в браузере, а из таблицы cookie должна быть удалена
 *
 * Для более подробной информации можно изучить код тестов
 *
 * Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

/**
 * homeworkContainer - это контейнер для всех ваших домашних заданий
 * Если вы создаете новые html-элементы и добавляете их на страницу, то дабавляйте их только в этот контейнер
 *
 * @example
 * homeworkContainer.appendChild(...);
 */
let homeworkContainer = document.querySelector('#homework-container');
let filterNameInput = homeworkContainer.querySelector('#filter-name-input');
let addNameInput = homeworkContainer.querySelector('#add-name-input');
let addValueInput = homeworkContainer.querySelector('#add-value-input');
let addButton = homeworkContainer.querySelector('#add-button');
let listTable = homeworkContainer.querySelector('#list-table tbody');

/**
 * Функция должна проверять встречается ли подстрока chunk в строке full
 * Проверка должна происходить без учета регистра символов
 *
 * @example
 * isMatching('Moscow', 'moscow') // true
 * isMatching('Moscow', 'mosc') // true
 * isMatching('Moscow', 'cow') // true
 * isMatching('Moscow', 'SCO') // true
 * isMatching('Moscow', 'Moscov') // false
 *
 * @return {boolean}
 */
function isMatching(full, chunk) {
    if (chunk === '') {
        return true;
    }

    return full.toLowerCase().trim().includes(chunk.toLowerCase().trim());
}

function deleteCookie(name) {
    return document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function createCookie(name, value) {
    document.cookie = name + '=' + value;
}
/**
 * Парсим кукисы в объект :)
 */
function getCookies() {
    return document.cookie
        .split('; ')
        .filter(Boolean)
        .map(cookie => cookie.match(/^([^=]+)=(.+)/))
        .reduce((obj, [, name, value]) => {
            obj[name] = value;

            return obj;
        }, {});
}

/**
 * Обновляет список кукисов
 */
function update(cookies) {

    while (listTable.firstChild) {
        listTable.removeChild(listTable.firstChild);
    }

    for (var prop in cookies) {
        if (isMatching(cookies[prop], filterNameInput.value) || isMatching(prop, filterNameInput.value)) {
            listTable.appendChild(createCookieTr(prop, cookies[prop]));
        }
    }
}

/**
 * Создает новый tr для таблицы со списком cookie
 *
 * @param name - имя cookie
 * @param value - значение cookie
 */
function createCookieTr(name, value) {

    let newRow = document.createElement('TR');
    let nameTd = document.createElement('TD');
    let valueTd = document.createElement('TD');
    let delButton = document.createElement('TD');

    delButton.innerHTML = '<button name="' + name + '">Удалить</button>';
    nameTd.innerText = name;
    valueTd.innerText = value;

    newRow.appendChild(nameTd);
    newRow.appendChild(valueTd);
    newRow.appendChild(delButton);

    delButton.firstChild.addEventListener('click', function del(e) {
        deleteCookie(e.target.name);
        update(getCookies());
    })

    return newRow;
}

filterNameInput.addEventListener('keyup', () => {
    update(getCookies());
});

addButton.addEventListener('click', () => {
    createCookie(addNameInput.value, addValueInput.value);
    update(getCookies());
});