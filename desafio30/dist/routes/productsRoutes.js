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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productsController_1 = require("../controllers/productsController");
const checkAdm_1 = require("../middlewares/checkAdm");
const router = express_1.Router();
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let foto = 'noPhoto';
    let email = 'noEmail';
    if (req.isAuthenticated()) {
        const userData = req.user;
        if (userData.photos)
            foto = userData.photos[0].value;
        if (userData.emails)
            email = userData.emails[0].value;
        const totalProd = yield productsController_1.productController.getProducts();
        console.log('productos:', totalProd);
        res.render('main', {
            nombre: userData.displayName,
            foto,
            email,
            products: totalProd
        });
    }
    else {
        res.redirect('/api/login');
    }
}));
router.get('/:id', productsController_1.productController.checkProductExist, productsController_1.productController.getProducts);
router.post('/add', checkAdm_1.checkAdmin, productsController_1.productController.checkAddProduct, productsController_1.productController.addProduct);
router.put('/update/:id', checkAdm_1.checkAdmin, productsController_1.productController.checkProductExist, productsController_1.productController.updateProduct);
router.delete('/delete/:id', checkAdm_1.checkAdmin, productsController_1.productController.checkProductExist, productsController_1.productController.delete);
exports.default = router;
