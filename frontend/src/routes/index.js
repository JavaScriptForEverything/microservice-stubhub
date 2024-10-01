"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pageRoutes_1 = require("./pageRoutes");
const router = (0, express_1.Router)();
router.use('/', pageRoutes_1.router);
exports.default = router;
