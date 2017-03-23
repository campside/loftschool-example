require('./main.css');

ymaps.ready(init);

function init(ymaps) {

    var myMap,
        feedbackForm,
        mp = document.getElementById('map'),
        places = [];

    myMap = new ymaps.Map('map', {
        center: [
            55.76, 37.64
        ],
        zoom: 10
    });

    var customItemContentLayout = ymaps.templateLayoutFactory.createClass(
    // Флаг "raw" означает, что данные вставляют "как есть" без экранирования html.
    '<h2 class=ballon_header>{{ properties.balloonContentHeader|raw }}</h2>'
    + '<div class=ballon_body>{{ properties.ballonContent|raw }}</div>'
    + '<div class=ballon_footer>{{ properties.balloonContentFooter|raw }}</div>');

    var clusterer = new ymaps.Clusterer({
        clusterDisableClickZoom: true, clusterOpenBalloonOnClick: true,
        // Устанавливаем стандартный макет балуна кластера "Карусель".
        clusterBalloonContentLayout: 'cluster#balloonCarousel',
        // Устанавливаем собственный макет.
        clusterBalloonItemContentLayout: customItemContentLayout,
        // Устанавливаем режим открытия балуна.
        // В данном примере балун никогда не будет открываться в режиме панели.
        clusterBalloonPanelMaxMapArea: 0,
        // Устанавливаем размеры макета контента балуна (в пикселях).
        clusterBalloonContentLayoutWidth: 200,
        clusterBalloonContentLayoutHeight: 130,
        // Устанавливаем максимальное количество элементов в нижней панели на одной странице
        clusterBalloonPagerSize: 5
        // Настройка внешего вида нижней панели.
        // Режим marker рекомендуется использовать с небольшим количеством элементов.
        // clusterBalloonPagerType: 'marker',
        // Можно отключить зацикливание списка при навигации при помощи боковых стрелок.
        // clusterBalloonCycling: false,
        // Можно отключить отображение меню навигации.
        // clusterBalloonPagerVisible: false
    });

    myMap.geoObjects.events.add('click', function(e) {
        var coords = e.get('coords');

        // проверяем есть ли уже открытое окно
        if (mp.children[1]) {
            mp.removeChild(mp.children[1]);
        }

        // Проверяем что это не кластер
        if (!e.get('target')._clusterListeners) {
            ymaps.geocode(coords).then(function(res) {
                // Возвращаем название улицы и адрес
                return res.geoObjects.get(0).properties._data.name;
            }).then(function feedback(res) {
                feedbackForm = document.createElement('DIV');
                feedbackForm.setAttribute('id', 'feedback');
                feedbackForm.setAttribute('style', `left: ${e.get('pagePixels')[0]}px; top: ${e.get('pagePixels')[1]}px;`);
                feedbackForm.innerHTML = '<div class="header"><p>' + res + '</p><div id="close_feedback">X</div></div>\
                                        <div id="posts"></div>\
                                        <input placeholder="Ваше имя" class="name" type="text" name="user_name"/><br>\
                                        <input placeholder="Укажите место" type="text" name="user_place"/><br>\
                                        <textarea class="fbk" placeholder="Отзыв" name="user_feedback"></textarea></div>\
                                        <input class="button" type="submit" value="Добавить" /></div>';

                // Отрисовываем блок на карте
                mp.appendChild(feedbackForm);

                // Добавляем событие на крестик для закрытия окна
                document.getElementById('close_feedback').addEventListener('click', function() {
                    mp.removeChild(feedbackForm);
                });

                // Добавляем событие на кнопку "Добавить"
                document.querySelector('#feedback input[type="submit"]').addEventListener('click', function() {

                    var posts = feedbackForm.children[1];
                    var post = document.createElement('DIV');

                    post.innerHTML = '<b>' + $('input[name="user_name"]').val() +
                    '</b><p>' + $('textarea[name="user_feedback"]').val();

                    posts.appendChild(post);

                    var place = new ymaps.Placemark(coords, {
                        ballonContentLayout: post.innerHTML,
                        balloonContentFooter: new Date()
                    }, {
                        openBalloonOnClick: false
                    });

                    places.push(place);
                    clusterer.add(places);
                    myMap.geoObjects.add(clusterer);

                });
            });
        }
    });

    myMap.events.add('click', function(e) {
        var coords = e.get('coords');
        // удаляем форму если она уже есть на карте
        if (mp.children[1]) {
            mp.removeChild(mp.children[1]);
        }

        ymaps.geocode(coords).then(function(res) {
            return res.geoObjects.get(0).properties._data.name;
        }).then(function feedback(res) {
            feedbackForm = document.createElement('DIV');
            feedbackForm.setAttribute('id', 'feedback');
            feedbackForm.setAttribute('style', `left: ${e.get('pagePixels')[0]}px; top: ${e.get('pagePixels')[1]}px;`);
            feedbackForm.innerHTML = '<div class="header"><p>' + res + '</p><div id="close_feedback">X</div></div>\
                                    <div id="posts"></div>\
                                    <input placeholder="Ваше имя" class="name" type="text" name="user_name"/><br>\
                                    <input placeholder="Укажите место" type="text" name="user_place"/><br>\
                                    <textarea class="fbk" placeholder="Отзыв" name="user_feedback"></textarea></div>\
                                    <input class="button" type="submit" value="Добавить" /></div>';

            mp.appendChild(feedbackForm);

            document.getElementById('close_feedback').addEventListener('click', function() {
                mp.removeChild(feedbackForm);
            });

            document.querySelector('#feedback input[type="submit"]').addEventListener('click', function() {

                var posts = feedbackForm.children[1];
                var post = document.createElement('DIV');

                post.innerHTML = '<b>' + $('input[name="user_name"]').val() +
                '</b><p>' + $('textarea[name="user_feedback"]').val() + '</p><p>' + new Date() + '</p>';
                posts.appendChild(post);

                var place = new ymaps.Placemark(coords, {
                    // balloonContentHeader: $('input[name="user_place"]').val(),
                    // balloonContentBody: post.innerHTML,
                    // balloonContentFooter: new Date(),
                    ballonContent: post.innerHTML
                }, {
                    openBalloonOnClick: false
                });

                places.push(place);
                clusterer.add(places);
                myMap.geoObjects.add(clusterer);

                console.log('clusterer', clusterer);
            });

        });
    });
}
