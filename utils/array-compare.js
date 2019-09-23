module.exports = function (array1, expressionArr, nameObj) {
    let array2 = [];

    if (nameObj) {
        for (let item of expressionArr) {
            array2 = [...array2, ...item[nameObj]];
        }
    }

    if (!nameObj) array2 = expressionArr;

    for (let item1 of array1) {
        for (let item2 of array2) {

            if (item1 === item2) return false;
        }
    };
    return true;
}