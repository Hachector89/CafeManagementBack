const express = require('express');
const connection = require('../connection');
const router = express.Router();

const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();
var auth = require('../services/auth');
var role = require('../services/role');

router.post('/signup', (req, res) => {
    let user = req.body;
    query = 'SELECT email, password, role, status FROM user WHERE email = ?';
    connection.query(query, [user.email], (err, results) => {
        if (!err) {
            if (results.length <= 0) {
                query = "INSERT INTO user(name, contactNumber, email, password, status, role) VALUES (?, ?, ?, ?, 'false', ?)";
                connection.query(query, [user.name, user.contactNumber, user.email, user.password, process.env.USER_ROLE], (err, results) => {
                    if (!err) {
                        return res.status(200).json({ message: 'Successfully registered.' })
                    } else {
                        return res.status(500).json(err);
                    }
                });
            } else {
                return res.status(400).json({ message: 'Email already in use, please login.' })
            }
        } else
            return res.status(500).json(err);
    })


})

router.post('/login', (req, res) => {
    const user = req.body;
    query = "SELECT email, password, role, status FROM user WHERE email = ?";
    connection.query(query, [user.email], (err, results) => {
        if (!err) {
            if (results.length <= 0 || results[0].password != user.password) {
                return res.status(401).json({ message: 'Incorrect email or password' });
            } else if (results[0].status === 'false') {
                return res.status(401).json({ message: 'Wait for admin approval' });
            } else if (results[0].password == user.password) {
                const response = { email: results[0].email, role: results[0].role };
                const accessToken = jwt.sign(response, process.env.ACCESS_TOKEN, { expiresIn: '8h' });
                return res.status(200).json({ token: accessToken });
            } else {
                return res.status(400).json({ message: 'Something went wrong. Please try again later.' })
            }
        } else {
            return res.status(500).json(err);
        }
    })
});


var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});

router.post('/forgotPassword', (req, res) => {
    const user = req.body;
    query = "SELECT email, password FROM user WHERE email = ?";
    connection.query(query, [user.email], (err, results) => {
        if (!err) {
            if (results.length <= 0) {
                return res.status(200).json({ message: 'No email registered, please sign up.' })
            } else {
                var mailOptions = {
                    from: process.env.EMAIL,
                    to: results[0].email,
                    subject: 'Password by Cafe Management System',
                    html: '<p><b>Your login details:</b><br>EMAIL: ' + results[0].email + '<br>PASSWORD: ' + results[0].password + '<br><a href=""http://localhost:4200>Click here to login</a></p>'
                };
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log('Error sending email: ', error);
                    } else {
                        console.log('Email sent: ', info.response);
                    }
                });
                return res.status(200).json({ message: 'Password sent successfully to your email.' });
            }
        } else {
            return res.status(500).json(err);
        }
    });
});

router.get('/get', auth.authToken, role.checkRole, (req, res) => {
    var query = "SELECT id, name, contactNumber, email, status FROM user WHERE role = 'user'";
    connection.query(query, (err, results) => {
        if (!err) {
            return res.status(200).json(results);
        } else {
            return res.status(500).json(err);
        }
    });
});

router.patch('/update', auth.authToken, role.checkRole, (req, res) => {
    let user = req.body;
    var query = "UPDATE user SET status = ? WHERE id = ?";
    connection.query(query, [user.status, user.id], (err, results) => {
        if (!err) {
            if (results.affectedRows == 0) {
                return res.status(404).json({ message: 'User ID does not exist.' });
            } else {
                return res.status(200).json({ message: 'User status updated successfully.' });
            }
        } else {
            return res.status(500).json(err);
        }
    })
});

router.get('/checkToken', auth.authToken, (req, res) => {
    return res.status(200).json({ message: "true" });
});

router.post('/changePassword', auth.authToken, (req, res) => {
    const user = req.body;
    const email = res.locals.user.email;
    
    
    var query = "SELECT * FROM user WHERE email = ? AND password = ?";

    connection.query(query, [email, user.oldPassword], (err, results) => {
        if (!err) {
            if (results.length <= 0) {
                return res.status(400).json({ message: 'Incorrect old password.' });
            } else if (results[0].password == user.oldPassword) {
                query = "UPDATE user SET password = ? WHERE email = ?";
                connection.query(query, [user.newPassword, email], (err, results) => {
                    if (!err) {
                        return res.status(200).json({ message: 'User password updated successfully.' });
                    } else {
                        return res.status(500).json(err);
                    }
                })
            } else {
                return res.status(400).json({ message: 'Something went wrong. Please try again later.' });
            }
        } else {
            return res.status(500).json(err);
        }
    });
});




module.exports = router;