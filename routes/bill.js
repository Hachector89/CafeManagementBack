const express = require('express');
const connection = require('../connection');
const router = express.Router();
let ejs = require('ejs');
let pdf = require('html-pdf');
let path = require('path');
var fs = require('fs');
var uuid = require('uuid');
var auth = require('../services/auth');

router.post('/generateReport', auth.authToken, (req, res) => {
    const generatedUuid = uuid.v1();
    const orderDetails = req.body;
    var productDetailsReport = JSON.parse(orderDetails.productDetails);

    query = "INSERT INTO bill(name, uuid, email, contactNumber, paymentMethod, total, productDetails, createdBy) VALUES(?, ?, ?, ?, ?, ?, ?, ?);";
    connection.query(query, [orderDetails.name, generatedUuid, orderDetails.email, orderDetails.contactNumber, orderDetails.paymentMethod, orderDetails.totalAmount, orderDetails.productDetails, res.locals.user.email], (err, results) => {
        if (!err) {
            ejs.renderFile(path.join(__dirname, '', 'report.ejs'), {
                productDetails: productDetailsReport,
                name: orderDetails.name,
                email: orderDetails.email,
                contactNumber: orderDetails.contactNumber,
                paymentMethod: orderDetails.paymentMethod,
                totalAmount: orderDetails.totalAmount
            }, (err, results) => {
                if (err) {
                    return res.status(500).json(err);
                } else {
                    pdf.create(results).toFile('./generated_pdf/' + generatedUuid + '.pdf', function (err, data) {
                        if (err) {
                            console.log('Error on generate PDF:', err);
                            return res.status(500).json(err);
                        } else {
                            return res.status(200).json({ uuid: generatedUuid });
                        }
                    });
                }
            });
        } else {
            return res.status(500).json(err);
        }
    });
});

router.post('/getPDF', auth.authToken, (req, res) => {
    const orderDetails = req.body;
    const pdfPath = './generated_pdf/' + orderDetails.uuid + '.pdf';
    if (fs.existsSync(pdfPath)) {
        res.contentType("application/pdf");
        fs.createReadStream(pdfPath).pipe(res);
    } else {
        var productDetailsReport = JSON.parse(orderDetails.productDetails);
        ejs.renderFile(path.join(__dirname, '', 'report.ejs'), {
            productDetails: productDetailsReport,
            name: orderDetails.name,
            email: orderDetails.email,
            contactNumber: orderDetails.contactNumber,
            paymentMethod: orderDetails.paymentMethod,
            totalAmount: orderDetails.totalAmount
        }, (err, results) => {
            if (err) {
                return res.status(500).json(err);
            } else {
                pdf.create(results).toFile('./generated_pdf/' + orderDetails.uuid + '.pdf', function (err, data) {
                    if (err) {
                        console.log('Error on generate PDF:', err);
                        return res.status(500).json(err);
                    } else {
                        res.contentType("application/pdf");
                        fs.createReadStream(pdfPath).pipe(res);
                    }
                });
            }
        });
    }
});

router.get('/getAllBills', auth.authToken, (req, res, next) => {
    query = 'SELECT * FROM bill ORDER BY id DESC';
    connection.query(query, (err, results) => {
        if (!err) {
            return res.status(200).json(results);
        } else {
            return res.status(500).json(err);
        }
    });
});

router.delete('/delete/:id', auth.authToken, (req, res, next) => {
    const id = req.params.id
    query = 'DELETE FROM bill WHERE id = ?';
    connection.query(query, [id], (err, results) => {
        if (!err) {
            if(results.affectedRows == 0) {
                return res.status(404).json({message: 'Bill not found.'});
            } else {
                return res.status(200).json({message: 'Bill deleted succesfully.'});
            }
        } else {
            return res.status(500).json(err);
        }
    });
});





module.exports = router;