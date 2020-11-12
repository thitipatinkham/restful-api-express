// import lib
const express = require('express');
const db = require('../util/db.config');
// define variable
const sequelize = db.sequelize;
const Blog = db.blog;
const User = db.user;
const route = express.Router();
const bcrypt = require("bcrypt");
let jsonResult = {
    responseCode: "",
    responseMessage: "",
    responseData: ""
}

// get home
route.get('/', async (req, res, next) => {
    res.end("Server user start (.)")
});

// login user 
route.post('/login', async (req, res, next) => {
    console.log('login user start');
    console.log('body::==', req.body);
    try {
        let username = req.body.username;
        let user = await User.findAll({ where: { username: username } });
        bcrypt.compare(req.body.username + req.body.password, user[0].password, function (err, response) {
            if (response) {
                console.log("success : " + res);
                jsonResult = {
                    responseCode: "0000",
                    responseMessage: "login success",
                    responseData: user[0]
                }
                res.json(jsonResult);
            } else {
                console.log("fail : " + res);
                jsonResult = {
                    responseCode: "0001",
                    responseMessage: "username or password invalid"
                }
                res.json(jsonResult);
            }
        });
    } catch (err) {
        jsonResult = {
            responseCode: "0001",
            responseMessage: "username or password invalid"
        }
        res.json(jsonResult);
    }
});

// get user with id
route.get('/find/myuser', async (req, res, next) => {
    console.log('find user start');
    console.log('header::==', req.header('key'));
    const token = req.header('key');
    let user = {};
    if (token) {
        user = await User.findById(token);
    }
    if (user != null) {
        jsonResult = {
            responseCode: "0000",
            responseMessage: "success",
            responseData: user
        }
        res.json(jsonResult);
    } else {
        jsonResult = {
            responseCode: "0001",
            responseMessage: "find not found"
        }
        res.json(jsonResult);
    }
});

// get users all
route.get('/find/all', async (req, res, next) => {
    console.log('find all user start');
    console.log('body::==', req.body);
    console.log('params::==', req.params.user_id);
    const users = await User.findAll();
    jsonResult = {
        responseCode: "0000",
        responseMessage: "success",
        responseData: users
    }
    res.json(jsonResult);
});

//create user
route.post('/create', async (req, res, next) => {
    try {
        console.log('create user start');
        console.log('body::==', req.body);
        console.log('params::==', req.params);
        let username = req.body.username;
        console.log(username)
        let findUser = await User.findAll({ where: { username: username } });
        if (findUser[0] != null) {
            jsonResult = {
                responseCode: "0002",
                responseMessage: "username duplicate",
            }
            res.json(jsonResult);
        } else {
            const salt = await bcrypt.genSalt(10);
            const password = await bcrypt.hash(req.body.username + req.body.password, salt);
            console.log(req.body.username + req.body.password);
            let user = {
                username: req.body.username,
                name: req.body.name,
                age: req.body.age,
                gender: req.body.gender,
                password: password,
                image: req.body.image
            }
            let result = null;
            if (user) {
                result = await sequelize.transaction(function (t, err) {
                    // chain all your queries here. make sure you return them.
                    return User.create(user, { transaction: t });
                });
            }
            jsonResult = {
                responseCode: "0000",
                responseMessage: "create success"
            }
            res.json(jsonResult);
        }
    } catch (err) {
        jsonResult = {
            responseCode: "0001",
            responseMessage: "create fail",
        }
        res.json(jsonResult);
    }
});

//update user
route.put('/update', async (req, res, next) => {
    try {
        console.log('update user start');
        console.log('body::==', req.body);
        console.log('params::==', req.params);
        console.log('header::==', req.header('key'));
        let userId = req.header('key');
        let findUser = await User.findById(userId);
        if (findUser == null) {
            jsonResult = {
                responseCode: "0002",
                responseMessage: "not found user",
            }
            res.json(jsonResult);
        } else {
            const user = {
                name: req.body.name,
                age: req.body.age,
                gender: req.body.gender,
                image: req.body.image,
            }
            let updateUser = null;
            if (user && userId) {
                updateUser = await sequelize.transaction(function (t) {
                    return User.update(
                        user,
                        { where: { userId: userId } },
                        { transaction: t }
                    );
                });
            }
            jsonResult = {
                responseCode: "0000",
                responseMessage: "update success",
            }
            res.json(jsonResult);
        }
    } catch (err) {
        jsonResult = {
            responseCode: "0001",
            responseMessage: "update fail",
        }
        res.json(jsonResult);
    }
});

//delete user with id
route.delete('/delete', async (req, res, next) => {
    console.log('delete user start');
    console.log('body::==', req.body);
    console.log('params::==', req.params);
    console.log('header::==', req.header('key'));
    let userId = req.header('key');
    let findUser = await User.findById(userId);
    if (findUser == null) {
        jsonResult = {
            responseCode: "0002",
            responseMessage: "not found user",
        }
        res.json(jsonResult);
    } else {
        let userDestroy = null;
        if (blogId) {
            const user = await User.findById(userId);
            if (blog) {
                userDestroy = await user.destroy();
            }
        }
        jsonResult = {
            responseCode: "0000",
            responseMessage: "delete success",
        }
        res.json(jsonResult);
    }
});

module.exports = route;