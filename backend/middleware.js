
const jwt = require("jsonwebtoken");
const JWT_Secret = require("./config");

const authmiddleware = (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(403).json({
            msg: "Wrong header/token send"
        })
    }

    const token = authHeader.split(' ')[1];


    try {
       const decode = jwt.verify(token, JWT_Secret);
       req.userId = decode.userId;
        // req.userId = "65d8dd0215a73b1057b09bfa";
        next();
    } catch (err) {
        return res.status(403).json({
            msg: "Something's seriously up here Prashant"
        });
    }

};

module.exports = { authmiddleware };
