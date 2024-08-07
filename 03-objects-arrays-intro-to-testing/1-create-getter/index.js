/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
    const keys = path.split('.');

    return function(obj) {
        let value = obj;
        for (const key of keys) {
            if (!value.hasOwnProperty(key)) return;
            value = value[key]
        }
        return value;
    }
}
