/* ДЗ 5.2 - Div D&D */

/** Со звездочкой */
/**
 * Создать страницу с кнопкой
 * При нажатии на кнопку должен создаваться div со случайными размерами, цветом фона и позицией
 * Необходимо предоставить возможность перетаскивать созданные div при помощи drag and drop
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

/**
 * Функция должна создавать и возвращать новый div с классом draggable-div и случайными размерами/цветом/позицией
 * Функция должна только создавать элемент и задвать ему случайные размер/позицию/цвет
 * Функция НЕ должна добавлять элемент на страницу
 *
 * @return {Element}
 */
function createDiv() {
    // Позаимствовал этот хэлпер для генерации рандомного цвета
    function RandomColor() {
        var letters = '0123456789ABCDEF',
            color = '#';

        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }

        return color;
    }
    var size = Math.floor(Math.random() * 100 + 50);
    // Учитываем размер окна
    var posx = (Math.random() * (window.innerWidth - size)).toFixed();
    var posy = (Math.random() * (window.innerHeight - size)).toFixed();
    var div = document.createElement('div');

    div.setAttribute('class', 'draggable-div');
    div.style.height = size + 'px';
    div.style.width = size + 'px';
    div.style.backgroundColor = RandomColor().toString();
    div.style.left = posx + 'px';
    div.style.top = posy + 'px';

    return div;
}

/**
 * Функция должна добавлять обработчики событий для перетаскивания элемента при помощи drag and drop
 *
 * @param {Element} target
 */
function addListeners(target) {

    var dragStartX,
        dragStartY;
    var objInitLeft,
        objInitTop;
    var inDrag = false;

    target.addEventListener('mousedown', function(e) {
        inDrag = true;
        objInitLeft = target.offsetLeft;
        objInitTop = target.offsetTop;
        dragStartX = e.pageX;
        dragStartY = e.pageY;
    });

    target.addEventListener('mousemove', function(e) {
        if (!inDrag) {
            return;
        }
        target.style.left = (objInitLeft + e.pageX - dragStartX) + 'px';
        target.style.top = (objInitTop + e.pageY - dragStartY) + 'px';
    });

    target.addEventListener('mouseup', function() {
        inDrag = false;
    });
}

let addDivButton = homeworkContainer.querySelector('#addDiv');

addDivButton.addEventListener('click', function() {
    // создать новый div
    let div = createDiv();

    // добавить на страницу
    homeworkContainer.appendChild(div);
    // назначить обработчики событий мыши для реализации d&d
    addListeners(div);
    // можно не назначать обработчики событий каждому div в отдельности, а использовать делегирование
    // или использовать HTML5 D&D - https://www.html5rocks.com/ru/tutorials/dnd/basics/
});

export {createDiv};
