const express = require('express');
const router = express.Router();

const loggedIn = require('../controllers/login/loggedIn');

router.get("/", loggedIn, (req, res) => {
    console.log(req.user)
    if (req.cookies['remember-login']) {
        console.log("User is logged in")
        res.sendFile('index.html', {root: './Frontend/public'});
    } else {
        console.log("Tried to access home page without being logged in")
        res.redirect("/login")
    }
})

router.get("/login", (req, res) => {
        res.sendFile('login.html', {root: './Frontend/public'});
})

router.get("/reports/:id", loggedIn, (req, res) => {
    if (req.cookies['remember-login']) {
        res.sendFile(`Rel.html`, {root: './Frontend/public/reports'});
    } else {
        res.redirect("/login")
    }
})

router.get("/relatorios", (req,res) => {
    if (req.cookies['remember-login']) {
        res.sendFile('relatorios.html', {root:'./Frontend/public'})
    } else {
        res.redirect("/login")
    }
})

router.get("/upload", loggedIn, (req, res) => {
    if (req.cookies['remember-login']) {
        res.sendFile('upload.html', {root: './Frontend/public'});
    } else {
        res.redirect("/login")
    }
})

module.exports = router