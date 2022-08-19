module.exports = function correctlyExpireDate(value) {
    value = value.replace(/\D/g, '');
    if (value.length === 1 && value > 1) {
        value = '0' + value + '/';
    } else if (value.length === 2 && value > 12) {
        value = '01/';
    } else if (value.length === 2 && value <= 12) {
        value = value + '/';
    } else if (value.length > 2) {
        //Current date
        let date = new Date();

        //Split max 4 digits
        let split = value.split('', 4);

        //Set format date to MM/YY
        value = split[0] + split[1] + '/' + split[2] + (split[3] || '');

        if (
            //Check if date is not in future without month
            parseInt(split[2] + (split[3] || '')) < date.getFullYear() - 2000 ||

            //Check if date is not in future with year and month
            date.getFullYear() - 2000 - parseInt(split[2] + (split[3] || '')) === 0 &&
            parseInt(split[0] + split[1]) < date.getMonth() + 1
        ) {
            //Set format date to MM/Y
            value = split[0] + split[1] + '/' + split[2];
        }
    }
    return value;
}