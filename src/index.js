/* ДЗ 3 - объекты и массивы */

/*
 Задача 1:
 Напишите аналог встроенного метода forEach для работы с массивами
 */
function forEach(array, fn) {
    var res = [];

    for (var i = 0; i < array.length; i++) {
        res.push(fn(array[i], i, array));
    }

    return res;
}

/*
 Задача 2:
 Напишите аналог встроенного метода map для работы с массивами
 */
function map(array, fn) {
    var res = [];

    for (var i = 0; i < array.length; i++) {
        res.push(fn(array[i], i, array));
    }

    return res;
}

/*
 Задача 3:
 Напишите аналог встроенного метода reduce для работы с массивами
 */
function reduce(array, fn, initial) {
    var iteration = 0;
    var prev;

    for (var i = 0; i < array.length; i++) {
        if (iteration == 0) {
            iteration++;
            if (initial == undefined) {
                i++;
                prev = fn(array[0], array[i], i, array);
            } else {
                prev = fn(initial, array[i], i, array);
            }
        } else {
            prev = fn(prev, array[i], i, array);
        }
    }

    return prev;
}

/*
 Задача 4:
 Функция принимает объект и имя свойства, которое необходиом удалить из объекта
 Функция должна удалить указанное свойство из указанного объекта
 */
function deleteProperty(obj, prop) {
    delete obj[prop];

}

/*
 Задача 5:
 Функция принимает объект и имя свойства и возвращает true или false
 Функция должна проверить существует ли укзаанное свойство в указанном объекте
 */
function hasProperty(obj, prop) {
    return ((obj.hasOwnProperty(prop)) ? true : false);
}

/*
 Задача 6:
 Функция должна получить все перечисляемые свойства объекта и вернуть их в виде массива
 */
function getEnumProps(obj) {
    return Object.keys(obj);
}

/*
 Задача 7:
 Функция должна перебрать все свойства объекта, преобразовать их имена в верхний регистра и вернуть в виде массива
 */
function upperProps(obj) {
    var props = Object.keys(obj),
        res = [];

    for (var i = 0; i < props.length; i++) {
        res.push(props[i].toUpperCase());
    }

    return res;
}

/*
 Задача 8 *:
 Напишите аналог встроенного метода slice для работы с массивами
 */
function slice(array, from = 0, to = array.length) {
    var res = [];
    var len = array.length - 1; // 7

    // по идее этот ифак можно заменить на функцию и реиспользовать ниже.
    if (from < 0) {
        if (from < (-len)) {
            from = 0;
        } else if (from >= -len) {
            from = len + from + 1;
        }
    } else if (from > len) {
        from = len + 1;
    }

    if (to < 0) {
        if (to < (-len)) {
            to = 0;
        } else if (to >= -len) {
            to = len + to + 1;
        }
    } else if (to > len) {
        to = len + 1;
    }

    for (var i = from; i < to; i++) {
        res.push(array[i]);
    }

    return res;
}

/*
 Задача 9 *:
 Функция принимает объект и должна вернуть Proxy для этого объекта
 Proxy должен перехватывать все попытки записи значений свойств и возводить это значение в квадрат
 */
function createProxy(obj) {
    var handler = {
        get: obj
    };

    return obj + handler;
}

export {
    forEach,
    map,
    reduce,
    deleteProperty,
    hasProperty,
    getEnumProps,
    upperProps,
    slice,
    createProxy
};
