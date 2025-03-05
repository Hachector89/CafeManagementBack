const express = require('express');
const connection = require('../connection');
const router = express.Router();
var auth = require('../services/auth');
var role = require('../services/role');

router.post('/add', auth.authToken, role.checkRole, (req, res, next) => {
    let category = req.body;
    query = "INSERT INTO category(name) VALUES (?)";
    connection.query(query,[category.name], (err, results) => {
        if(!err) {
            return res.status(200).json({message: 'Category added successfully.'});
        } else {
            return res.status(500).json(err);
        }
    });
});

router.get('/get', auth.authToken, (req, res, next) => {
    query = "SELECT * FROM category ORDER BY name";
    connection.query(query, (err, results) => {
        if(!err) {
            return res.status(200).json(results);
        } else {
            return res.status(500).json(err);
        }
    });
});

router.patch('/update', auth.authToken, role.checkRole, (req, res, next) => {
    let category = req.body;
    query = "UPDATE category SET name = ? WHERE id = ?";
    connection.query(query,[category.name, category.id], (err, results) => {
        if(!err) {
            if(results.affectedRows == 0) {
                return res.status(404).json({message: 'Category id not found.'});
            }
            return res.status(200).json({message: 'Category updated successfully.'});            
        } else {
            return res.status(500).json(err);
        }
    });
});

module.exports = router;