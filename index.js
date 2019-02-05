const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

app.listen(80, () => console.log('Listening on port 80'))

mongoose.connect('mongodb://localhost/p5_ecommerce')

const productoModel = mongoose.Schema({
    nombre:{
        type:String,
        require: true
    },
    precio: {
        type: Number,
        default: 0,
    },
    descripcion:{
        type: String,
        default: ''
    },
    imagen:{
        type: String,
        default: ''
    }
})

const producto = mongoose.model('productos', productoModel)

// producto.create(
//     {nombre:'Lapicera One', precio:50, descripcion:'Negro', imagen:'https://officemax.vteximg.com.br/arquivos/ids/171919-175-175/92220_1.jpg'},
//     {nombre:'Lapiz', precio:30, descripcion:'Negro', imagen:'https://officemax.vteximg.com.br/arquivos/ids/158696-175-175/32949_1.jpg'},
//     (err, result) =>{
//     producto.find({}, (err, result) => {
//         console.log(err,result)
//     });
// })

app.use('/assets/', express.static(__dirname + '/public'))

app.set('view engine', 'ejs');


let vacio = 
    {
        id:0,
        nombre: '',
        precio: '',
        descripcion: '',
        imagen: ''
    }



app.get('/',(req,res)=> {
    producto.find({}, (err, resultadoProducto) => {
        res.render('products.ejs', {productos:resultadoProducto})
    })   
})

app.get('/producto/:id',(req,res)=> {
    producto.findById({_id:req.params.id}, (err, resultadoProducto) => {
        console.log(resultadoProducto)
        res.render('product.ejs', {product:resultadoProducto})
    })   
})


var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.post('/cuproducto/:id',urlencodedParser,(req,res)=> {

    if(Number(req.params.id)==0){
        producto.create(
            {nombre:req.body.nombre, precio:req.body.precio, descripcion:req.body.descripcion, imagen:req.body.imagen},
            (err, result) =>{
            producto.find({}, (err, result) => {
                console.log(err,result)
                res.redirect('/')
            });
        })
    } else {
        producto.updateOne(
            {_id:req.params.id},{nombre:req.body.nombre, precio:req.body.precio, descripcion:req.body.descripcion, imagen:req.body.imagen},
            (err, result) =>{
            producto.find({}, (err, result) => {
                console.log(err,result)
                res.redirect('/')
            });
        })
    }
   
})


app.get('/cuproducto/:id',(req,res)=> {
    if(Number(req.params.id)==0){
        res.render('abm.ejs', {product:vacio})
    } else {
        producto.findById({_id:req.params.id}, (err, productSelected) => {
            // console.log(productSelected)
            res.render('abm.ejs', {product:productSelected})
        }) 
    }
})


app.get('/eliminarproducto/:id',(req,res)=> {
    producto.deleteOne(
        {_id:req.params.id},
        (err, result) =>{
        producto.find({}, (err, result) => {
            console.log(err,result)
            res.redirect('/')
        });
    })
})
