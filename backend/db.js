const mongoose = require('mongoose')

mongoose.connect("mongodb+srv://prashant:RbZhgAXkd1YF9O9I@prashant-cluster.a3uiuae.mongodb.net/Paytm")

const userSchema = new mongoose.Schema({
    username: String,
    firstName: String,
    lastName: String,
    password: String,

})

const User = mongoose.model("User", userSchema)

const accountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    balance: {
        type: Number,
        required: true
    }
})

const Account = mongoose.model("Account", accountSchema)

module.exports = ({
    User, 
    Account
})