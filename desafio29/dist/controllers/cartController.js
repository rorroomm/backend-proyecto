"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartController = void 0;
class CartController {
    checkProductExist(req, res, next) {
        const idProd = Number(req.params.id);
        ;
        next();
    }
    getProducts(req, res) {
        const idProd = Number(req.params.id);
        res.json({});
    }
    addProductsCartID(req, res) {
        const idProd = Number(req.params.id);
        res.json({
            msg: 'Product added successfully'
        });
    }
    deleteProductCart(req, res) {
        const idProd = Number(req.params.id);
        res.json({
            msg: 'Product deleted successfully'
        });
    }
}
exports.cartController = new CartController();
