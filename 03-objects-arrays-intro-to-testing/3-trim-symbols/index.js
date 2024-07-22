/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {

    if (size === 0) {
        return '';
    }
    
    if (!size || size >= string.length) {
        return string;
    }

    let resStr = '';
    let prevCh;
    let repeats = 0;
    let sliceStartIdx = 0;
    let ch;
    let prevRepeats;


    for (let i = 0; i < string.length; i++, prevCh = ch, prevRepeats = repeats) {
        ch = string[i];

        if (prevCh === ch) {
            repeats++;
            prevRepeats = repeats;
        } else {
            repeats = 1;
        }

        if (prevRepeats && prevRepeats !== repeats) {
            resStr += string.slice(sliceStartIdx, i - prevRepeats + size)
            sliceStartIdx = i;
        }

        if (i === string.length - 1) {
            if (repeats > size) {
                resStr += string.slice(sliceStartIdx, i - repeats + size + 1)
            } else {
                resStr += string.slice(sliceStartIdx, string.length)
            }
        }
    }
    return resStr;
}
