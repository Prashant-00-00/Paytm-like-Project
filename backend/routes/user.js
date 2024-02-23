const express = require("express")
const userRouter = express.Router();
const zod = require('zod');
const { User, Account } = require("../db");
const JWT_Secret = require("../config");
const jwt = require('jsonwebtoken')
const { authmiddleware } = require("../middleware")


userRouter.post('/signup', async (req, res) => {
    const signupbody = zod.object({
        username: zod.string().email(),
        firstName: zod.string(),
        lastName: zod.string(),
        password: zod.string()
    })

    const { success } = signupbody.safeParse(req.body)

    if (!success) {
        return res.status(411).json({
            msg: "Email already exists / Incorrect Inputs"
        })
    }

    const existingUser = await User.findOne({
        username: req.body.username
    })

    if (existingUser) {
        return res.status(411).json({
            msg: "Email already in use"
        })
    }

    const user = await User.create({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password
    })

    const userId = user._id;

    await Account.create({
        userId,
        balance: 1 + Math.random() * 10000
    });

    const token = jwt.sign({ userId }, JWT_Secret);

    res.json({
        msg: "User Created Successfully",
        token: token
    });

})



userRouter.post('/signin', async (req, res) => {

    const signinbody = zod.object({
        username: zod.string().email(),
        password: zod.string()
    })


    const { success } = signinbody.safeParse(req.body)

    if (!success) {
        return res.status(411).json({
            msg: "Invalid inputs Prashant"
        })
    }

    const user = await User.find({
        username: req.body.username,
        password: req.body.password
    })

    if (user) {
        const token = jwt.sign({
            userId: user._id
        }, JWT_Secret);

        return res.json({
            token: token
        })
    }

    return res.status(411).json({
        msg: "Error while logging"
    })

})


userRouter.put('/', authmiddleware, async (req, res) => {

    const updatedBody = zod.object({
        firstName: zod.string().optional(),
        lastName: zod.string().optional(),
        password: zod.string().optional(),
    })

    const { success } = updatedBody.safeParse(req.body);

    if (!success) {
        return res.status(411).json({
            msg: "Cannot update body"
        })
    }

    await User.updateOne({ _id: req.userId }, req.body);

    res.json({
        msg: "Updated Successfully"
    })

})

userRouter.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [{
            firstName: {
                "$regex": filter
            }
        }, {
            lastName: {
                "$regex": filter
            }
        }]
    })

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})


module.exports = userRouter;