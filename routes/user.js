var express = require('express');
var router = express.Router();
var passport = require('passport');
var Account = require('../models/account');

router.post('/register', function (req, res) {

    Account.register(new Account({ username: req.body.username }), req.body.password, function (err, account) {
        if (err) {
            res.end();
        }
        passport.authenticate('local')(req, res, function () {
            res.send('User created');
        });
    });
});

router.post('/login', passport.authenticate('local'),
    function (req, res) {
        res.send('Welcome');
    });

module.exports = router;