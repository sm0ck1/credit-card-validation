const express = require('express');
const router = express.Router();
const correctlyExpireDate = require('../helpers/expiry-date')
const luhnAlgorithm = require('../helpers/luhn')

router.post('/', function (req, res, next) {
    const creditCard = req.body;
    let allowFields = [
        'cardNumber',
        'expiryDate',
        'cvv',
    ];
    let validate = {};

    //calculate the fields that did not reach
    const clientFields = Object.keys(creditCard);
    allowFields.filter(field => !clientFields.includes(field)).map(field => {
        validate[field] = `Field ${field} must be such`;
    });

    //Make sure all fields exist
    if (!Object.keys(validate).length) {

        allowFields.filter(field => !creditCard[field].trim()).map(field => {
            validate[field] = `Field must be filled`;
        });

        const expiryDate = correctlyExpireDate(creditCard.expiryDate);
        if (expiryDate !== creditCard.expiryDate || expiryDate.length !== 5) {
            validate['expiryDate'] = 'Invalid expiry date. Example: 10/23';
        }

        if (creditCard.cardNumber.length < 16 && creditCard.cardNumber.length > 19) {
            validate['cardNumber'] = 'Invalid card number. Is between 16 and 19 digits long.';
        } else if (!luhnAlgorithm(creditCard.cardNumber)) {
            validate['cardNumber'] = 'Invalid card number. Check card number.';
        }

        let isAmerican = false;
        if (/^(34|37)/.test(creditCard.cardNumber)) {
            isAmerican = true;
        }
        if (isAmerican && creditCard.cvv.length !== 4) {
            validate['cvv'] = 'Invalid CVV. Need 4 digits';
        } else if (!isAmerican && creditCard.cvv.length !== 3) {
            validate['cvv'] = 'Invalid CVV. Need 3 digits';
        }
    }

    res.json({
        'errors': validate,
        'success': (!Object.keys(validate).length)
    })
});

module.exports = router;
