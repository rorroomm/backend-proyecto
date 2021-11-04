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
exports.productController = void 0;
const productsModels_1 = require("../models/productsModels");
const tableName = "productos";
class ProductController {
    checkAddProduct(err, req, res, next) {
        const { name, price, description, thumbnail, stock } = req.body;
        if (!name ||
            !price ||
            !description ||
            !thumbnail ||
            !stock ||
            typeof name !== "string" ||
            typeof description !== "string" ||
            typeof thumbnail !== "string" ||
            isNaN(stock) ||
            isNaN(price)) {
            return res.status(400).json({
                msg: "Campos del body invalidos",
                error: err,
            });
        }
        next();
    }
    checkProductExist(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            productsModels_1.productos.findById(id, (err, product) => {
                if (err) {
                    return res.status(404).json({
                        msg: "No se encuentra este producto",
                    });
                }
                else {
                    next();
                }
            });
        });
    }
    getProducts() {
        return __awaiter(this, void 0, void 0, function* () {
            const total = yield productsModels_1.productos.find().lean();
            return total;
        });
    }
    addProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            yield productsModels_1.productos.create(req.body);
            res.redirect("/api/products");
        });
    }
    updateProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            yield productsModels_1.productos.findByIdAndUpdate(id, req.body);
            res.json({
                msg: "Producto actualizado con exito",
            });
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            yield productsModels_1.productos.findByIdAndDelete(id);
            res.json({
                msg: "Producto borrado con exito",
            });
        });
    }
}
exports.productController = new ProductController();
