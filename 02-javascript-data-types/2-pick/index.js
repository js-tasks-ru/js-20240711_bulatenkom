/**
 * pick - Creates an object composed of the picked object properties:
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to pick
 * @returns {object} - returns the new object
 */
export const pick = (obj, ...fields) => {
    const resObj = {};

    for (const field of fields) {
        if (!obj.hasOwnProperty(field)) {
            continue;
        }
        resObj[field] = obj[field];
    }
    return resObj;
};
