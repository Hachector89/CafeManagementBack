const express = require('express');
const connection = require('../connection');
const router = express.Router();
var auth = require('../services/auth');
var role = require('../services/role');

router.post('/add', auth.authToken, role.checkRole, (req, res) => {
    let product = req.body;
    query = "INSERT INTO product(name, categoryId, description, price, status) VALUES (?, ?, ?, ?, 'true')";
    connection.query(query,[product.name, product.categoryId, product.description, product.price], (err, results) => {
        if(!err) {
            return res.status(200).json({message: 'Product added successfully.'});
        } else {
            return res.status(500).json(err);
        }
    });
});

router.get('/get', auth.authToken, (req, res, next) => {
    query = "SELECT p.id as productID, p.name, p.description, p.price, p.status, c.id as categoryID, c.name as categoryName FROM product as p INNER JOIN category as c WHERE p.categoryId = c.id ORDER BY c.id";
    connection.query(query, (err, results) => {
        if(!err) {
            return res.status(200).json(results);
        } else {
            return res.status(500).json(err);
        }
    });
});

router.get('/getByCategory/:id', auth.authToken, (req, res, next) => {
    const id = req.params.id;
    query = "SELECT id, name FROM product WHERE categoryId = ? and status = 'true'";
    connection.query(query,[id], (err, results) => {
        if(!err) {
            return res.status(200).json(results);
        } else {
            return res.status(500).json(err);
        }
    });
});

router.get('/getById/:id', auth.authToken, (req, res, next) => {
    const id = req.params.id;
    query = "SELECT id, name, description, price FROM product WHERE id = ? and status = 'true'";
    connection.query(query,[id], (err, results) => {
        if(!err) {
            return res.status(200).json(results[0]);
        } else {
            return res.status(500).json(err);
        }
    });
});

router.patch('/update', auth.authToken, role.checkRole, (req, res, next) => {
    let product = req.body;
    query = "UPDATE product SET name = ?, categoryId = ?, description = ?, price = ? WHERE id = ?";
    connection.query(query,[product.name, product.categoryId, product.description, product.price, product.id], (err, results) => {
        if(!err) {
            if(results.affectedRows == 0) {
                return res.status(404).json({message: 'Product id not found.'});
            }
            return res.status(200).json({message: 'Product updated successfully.'});            
        } else {
            return res.status(500).json(err);
        }
    });
});

router.delete('/delete/:id', auth.authToken, role.checkRole, (req, res, next) => {
    let id = req.params.id;
    query = "DELETE FROM product WHERE id = ?"
    connection.query(query,[id], (err, results) => {
        if(!err) {
            if(results.affectedRows == 0) {
                return res.status(404).json({message: 'Product id not found.'});
            }
            return res.status(200).json({message: 'Product deleted successfully.'});            
        } else {
            return res.status(500).json(err);
        }
    });
});

router.patch('/updateStatus', auth.authToken, role.checkRole, (req, res, next) => {
    let product = req.body;
    query = "UPDATE product SET status = ? WHERE id = ?";
    connection.query(query,[product.status, product.id], (err, results) => {
        if(!err) {
            if(results.affectedRows == 0) {
                return res.status(404).json({message: 'Product id not found.'});
            }
            return res.status(200).json({message: 'Product status updated successfully.'});            
        } else {
            return res.status(500).json(err);
        }
    });
});


module.exports = router;