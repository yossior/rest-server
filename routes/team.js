var express = require('express');
var router = express.Router();
let Team = require('../models/team');

let isAdmin = (user, foundTeam) => {
    let u = foundTeam.adminIDs.find(userID => userID == user.id);
    return u;
}

router.post('/', function (req, res) {
    console.log(req.user);

    if (req.user) {
        let team = new Team({ name: req.body.name, adminIDs: [req.user.id], members: [req.user.id] });
        team.save().then(data => {
            res.send('team created..')
        })
    }
});

router.post('/addMember', function (req, res) {

    //find the team
    Team.findOne({ name: req.body.teamName }).then(foundTeam => {
        if (foundTeam !== null) {
            if (isAdmin(req.user, foundTeam)) {
                //allow add member
                let members = [...foundTeam.members];
                members.push(req.body.userid);
                Team.findByIdAndUpdate(foundTeam.id, { members }).then(data => {
                    res.send('team updated')
                })
            }
        }
        else {
            res.send("No such team");
        }
    })
});

router.put('/promoteMemberToAdmin', function (req, res) {

    Team.findOne({ name: req.body.teamName }).then(foundTeam => {
        if (isAdmin(req.user, foundTeam)) {
            let adminIDs = [...foundTeam.adminIDs];
            adminIDs.push(req.body.userid);
            Team.findByIdAndUpdate(foundTeam.id, { adminIDs }).then(data => {
                res.send('Member promoted');
            })
        }
    })
});

router.delete('/:userID', function (req, res) {

    Team.findOne({ name: req.body.teamName }).then(foundTeam => {
        if (isAdmin(req.user, foundTeam)) {
            if (req.user.id != req.params.userID) {
                let members = [...foundTeam.members];
                members = members.filter(user => user !== req.params.userID);
                Team.findByIdAndUpdate(foundTeam.id, { members }).then(data => {
                    res.send('Member removed from group');
                })
            } else {
                res.send("User can't remove himself");
            }
        }
    })
});

router.delete('/', function (req, res) {

    //find the team
    Team.findOne({ name: req.body.teamName }).then(foundTeam => {
        if (isAdmin(req.user, foundTeam)) {
            Team.findOneAndDelete({ name: req.body.teamName }).then(() => {
                res.send('Team removed');
            })
        }
    })
});

module.exports = router;