const express = require("express");
const { authmiddleware } = require("../middleware");
const { Account } = require("../db");
const accountRouter = express.Router();
// const mongoose = require("mongoose")

accountRouter.get('/balance', authmiddleware, async (req, res) => {

    const account = await Account.findOne({
        userId: req.userId
    });

    return res.status(200).json({
        "balance": account.balance
    })

});

accountRouter.post('/transfer', authmiddleware, async (req, res) => {

 
    const { amount, to } = req.body;
    const account = await Account.findOne({
        userId: req.userId
    });

    if (amount > account.balance) {
        return res.status(400).json({
            msg: "Insufficient Balance, Prashant"
        })
    }

    const toAccount = await Account.findOne({
        userId: to
    });

    if (!toAccount) {
        return res.status(400).json({
            msg:
                "Invalid Account"
        })
    }

    await Account.updateOne({
        userId: req.userId
    }, {
        $inc: {
            balance: -amount
        }
    });

    await Account.updateOne({
        userId: to
    }, {
        $inc: {
            balance: amount
        }
    });

    res.json({
        message: "Transfer successful"
    })

});

module.exports = accountRouter; 