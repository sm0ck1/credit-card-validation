//https://ru.wikipedia.org/wiki/%D0%90%D0%BB%D0%B3%D0%BE%D1%80%D0%B8%D1%82%D0%BC_%D0%9B%D1%83%D0%BD%D0%B0
function luhnAlgorithm(value) {
    value = value.replace(/\D/g, '');

    var nCheck = 0;
    var bEven = false;

    for (var n = value.length - 1; n >= 0; n--) {
        var nDigit = parseInt(value.charAt(n), 10);

        if (bEven && (nDigit *= 2) > 9) {
            nDigit -= 9;
        }

        nCheck += nDigit;
        bEven = !bEven;
    }

    return (nCheck % 10) === 0;
}

module.exports = luhnAlgorithm;