"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
exports.router = (0, express_1.Router)();
// 	/
exports.router.route('/')
    .get((req, res, next) => {
    const payload = {
        title: 'Home Page'
    };
    res.render('home', payload);
});
