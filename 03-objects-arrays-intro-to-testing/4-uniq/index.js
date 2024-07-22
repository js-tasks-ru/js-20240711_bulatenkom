/**
 * uniq - returns array of uniq values:
 * @param {*[]} arr - the array of primitive values
 * @returns {*[]} - the new array with uniq values
 */
export function uniq(arr) {
    if (!arr || arr.length === 0) {
        return [];
    }

    const resArr = [];
    const set = new Set();

    for (const v of arr) {
        if (!set.has(v)) resArr.push(v);

        set.add(v);
    }

    return resArr;
}
