const User = require('../models/User')
const jwt = require('jsonwebtoken')

class AuthController {
    async registration(req, res) {
        const {username, password} = req.body
        User.findOne({username})
            .then(u => {
                if (u) throw new Error('\'Such user already exists\'')
                return new User({username, password}).save()
            })
            .then(_ => res.status(201).json("you were successfully registered"))
            .catch(e => res.status(400).json({message: e.message}))
    }

    async login(req, res) {
        const {username, password} = req.body
        User.findOne({username})
            .then(u => {
                if (!u) throw new Error('User wasn\'t found')
                if (u.password !== password) throw new Error('Incorrect password')

                const token = jwt.sign({id: u._id}, process.env.SECRET_KEY, {expiresIn: "1h"})
                return res.json({token})
            })
            .catch(e => res.status(400).json({message: e.message}))
    }

    async getUsers(req, res) {
        res.json("server is ok")
    }
}

module.exports = new AuthController()