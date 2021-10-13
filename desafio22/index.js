const express = require('express');
const app = express();
const faker = require('faker');

app.use(express.json());

/* ----------------------- FAKER ----------------------- */

const productos = [ ];

    //DESAFIO 22 - VISTA-TEST C/ QUERY PARAMS
    //productos/vista-test?cant=5
app.get('/productos/vista-test', (req, res) => {
    const { cant } = req.query;

     if(cant === 0 || cant < 0){
        const noProd = "No hay productos";
        res.send(noProd);
    } else if (cant > 0) {
        for(let i = 0; i < cant; i++){
            const producto = {
                nombre: faker.commerce.productName(),
                precio: faker.commerce.price(),
                foto: faker.image.imageUrl()
            }
            productos.push(producto);  
            console.log(producto);
        }
        res.send(productos);
    } else {
        for (let i = 0; i < 10; i++){
            const producto = {
                nombre: faker.commerce.productName(),
                precio: faker.commerce.price(),
                foto: faker.image.imageUrl()
            }
            productos.push(producto);
        }

        res.send(productos);
    }

    
})

/* ----------------------- FAKER ----------------------- */


/* ----------------------- SERVER + DB CONNECTION ----------------------- */

app.listen(8080, ()=>{
    console.log('DB driving driving on port 8080');
})



