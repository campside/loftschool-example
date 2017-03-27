require('./main.css');
require('./cross.png');

ymaps.ready(init);

// Функция для сохранения информации о метках
var saveCounter = (function() {
    var count = sessionStorage.getItem('counter') || 0;

    return function(item) {
        sessionStorage.setItem(count, item);
        count++;
        sessionStorage.setItem('counter', count)
    }
})();

function init(ymaps) {

    myMap = new ymaps.Map('map', {
        center: [
            55.76, 37.64
        ],
        zoom: 10
    });

    var myMap,
        feedbackForm,
        mp = document.getElementById('map'),
        places = [];

    var customItemContentLayout = ymaps.templateLayoutFactory.createClass(
    // Флаг "raw" означает, что данные вставляют "как есть" без экранирования html.
    '<a id="others">{{ properties.ballonContentHeader|raw }}</a>' +
    '<div class=ballon_body>{{ properties.ballonContent|raw }}</div>');

    var clusterer = new ymaps.Clusterer({
        clusterDisableClickZoom: true,
        clusterOpenBalloonOnClick: true,
        clusterBalloonContentLayout: 'cluster#balloonCarousel',
        clusterBalloonItemContentLayout: customItemContentLayout,
        clusterBalloonPanelMaxMapArea: 0,
        clusterBalloonContentLayoutWidth: 200,
        clusterBalloonContentLayoutHeight: 130,
        clusterBalloonPagerSize: 5,
        groupByCoordinates: false
    });

    // Восстанавливаем из sessionStorage то что сохранили
    if (sessionStorage.getItem('0')) {
        for (var i = 0; i < sessionStorage.length - 2; i++) {
            var el = sessionStorage.getItem(i).split(',');

            var place = new ymaps.Placemark([
                el[0], el[1]
            ], {
                ballonContentHeader: el[3],
                ballonContent: el[2]
            }, {
                openBalloonOnClick: false
            });

            places.push(place);
            clusterer.add(places);
            myMap.geoObjects.add(clusterer);
        }
    }

    function popUp(res) {
        return '<div class="header"><div class="adress">' + res + '</div><div id="close_feedback">X</div></div>\
                                <div id="posts"></div>\
                                <input placeholder="Ваше имя" class="name" type="text" name="user_name"/><br>\
                                <input placeholder="Укажите место" type="text" name="user_place"/><br>\
                                <textarea class="fbk" placeholder="Отзыв" name="user_feedback"></textarea></div>\
                                <input class="button" type="submit" value="Добавить" /></div>';

    }

    function feedback(res, e, data) {
        if (mp.children[1]) {
            mp.removeChild(mp.children[1]);
        }

        feedbackForm = document.createElement('DIV');
        feedbackForm.setAttribute('id', 'feedback');
        feedbackForm.setAttribute('style', `left: ${e.get('pagePixels')[0]}px; top: ${e.get('pagePixels')[1]}px;`);
        feedbackForm.innerHTML = popUp(res);

        // Отрисовываем блок на карте
        var posts = feedbackForm.children[1];

        posts.innerHTML = data;
        mp.appendChild(feedbackForm);

        // Добавляем событие на крестик для закрытия окна
        document.getElementById('close_feedback').addEventListener('click', function() {
            mp.removeChild(feedbackForm);
        });

        // Добавляем событие на кнопку "Добавить"
        document.querySelector('#feedback input[type="submit"]').addEventListener('click', function() {
            var posts = feedbackForm.children[1];
            var post = document.createElement('DIV');

            if (posts.childNodes[0].textContent === 'Отзывов пока нет...') {
                posts.innerHTML = '';
            }

            feedbackForm.setAttribute('class', 'post');

            // Селекторы из JQuery из песочницы яндекс карт
            post.innerHTML = '<span class="post_name">' + $('input[name="user_name"]').val() + '  </span> ' +
            '<span class="post_place">' + $('input[name="user_place"]').val() + '</span> ' +
            '<span class="post_date">' + new Date().toISOString().slice(0, 10) + '</span>' +
            '<div>' + $('textarea[name="user_feedback"]').val() + '</div>';
            posts.appendChild(post);

            var place = new ymaps.Placemark(e.get('coords'), {
                ballonContentHeader: res,
                ballonContent: post.innerHTML
            }, {
                openBalloonOnClick: false
            });

            saveCounter([place.geometry._coordinates,
                        place.properties._data.ballonContent,
                        place.properties._data.ballonContentHeader]);

            places.push(place);
            clusterer.add(places);
            myMap.geoObjects.add(clusterer);
        });
    }

    // Событие на клик по геообъекту
    myMap.geoObjects.events.add('click', function(e) {
        var coords = e.get('coords');
        var data = e.get('target').properties._data.ballonContent;
        var items = e.get('target').properties.get('geoObjects');

        // Проверяем что это не кластер
        if (!e.get('target')._clusterListeners) {
            ymaps.geocode(coords).then(function(res) {
                feedback(res.geoObjects.get(0).properties._data.name, e, data)
            });
        } else {
            if (myMap.balloon) {
                var result = '';

                for (var i = 0; i < items.length; i++) {
                    result = result + items[i].properties._data.ballonContent;
                }
                // Пример из песочницы карт, не получилось его повторить нативно
                document.getElementsByTagName('body')[0].addEventListener('click', function (event) {
                    if (event.target.id === "others") {
                        myMap.balloon.close();
                        feedback(event.target.innerText, e, result);
                    }
                });
            }
        }
    });

    // Событие на клик по карте
    myMap.events.add('click', function(e) {
        var coords = e.get('coords');

        ymaps.geocode(coords).then(function(res) {
            feedback(res.geoObjects.get(0).properties._data.name, e, 'Отзывов пока нет...');
        })
    });
}
