"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("../middlewares/auth"));
const router = express_1.Router();
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("loginForm");
}));
router.post("/signup", (req, res, next) => {
    auth_1.default.authenticate("signup", function (err, user, info) {
        console.log(err, user, info);
        if (err) {
            return next(err);
        }
        if (!user)
            return res.status(401).json({ data: info });
        res.render("main", { username: req.body.username });
    })(req, res, next);
});
router.get("/signUpPage", (req, res) => {
    res.render("signup");
});
router.post("/login", auth_1.default.authenticate("login"), (req, res) => {
    res.render("main", { username: req.body.username });
});
router.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        res.redirect("/api");
    });
});
router.get("/auth/facebook", auth_1.default.authenticate("facebook", { scope: ["email"] }));
router.get("/auth/facebook/callback", auth_1.default.authenticate("facebook", {
    successRedirect: "/api/products",
    failureRedirect: "/api/fail",
}));
exports.default = router;
