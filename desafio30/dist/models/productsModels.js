"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productos = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const productsCollection = 'products';
const ProductsSchema = new mongoose_1.default.Schema({
    name: { type: String, require: true, max: 50 },
    price: { type: Number, require: true },
    description: { type: String, require: true, max: 240 },
    thumbnail: { type: String, require: true, max: 64 },
    stock: { type: Number, require: true },
    timestamp: { type: Date, default: Date.now() }
});
exports.productos = mongoose_1.default.model(productsCollection, ProductsSchema);
