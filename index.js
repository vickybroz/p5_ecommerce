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
    },
    comentariosId: [{
      type: mongoose.Schema.Types.ObjectId, //arreglo de ID
      ref: "comentarios"            //referencia
    }]
})

const comentarioModel = mongoose.Schema({
  texto: {
    type: String,
    require: true,
    date: { type: Date, default: Date.now }
  }

})

const producto = mongoose.model('productos', productoModel)
const comentario = mongoose.model('comentarios', comentarioModel)

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

var urlencodedParser = bodyParser.urlencoded({ extended: false })


app.get('/',(req,res)=> {
    producto.find({}, (err, resultadoProducto) => {
        res.render('products.ejs', {productos:resultadoProducto})
    })
})


//POST comentario
app.post('/comentario/:id', urlencodedParser, (req, res) => {
  comentario.create(req.body, (err, newComentario) => {
    //console.log(newComentario)
    producto.findById(req.params.id, (err, productOld) => {
      producto.updateOne({_id:req.params.id}, { comentariosId: [...productOld.comentariosId, newComentario._id ] }, (err, resultadoProducto) => {
        res.redirect(`/producto/${req.params.id}`)
      })
    })

})
})
//GET comentarios
app.get('/comentario/:id', (req,res) =>{
  producto.findOne({_id:req.params.id}).populate('texto').exec(function (err, doc) {
          if (err) return handleError(err);
          console.log(doc)
        })
    })

//producto Individual
app.get('/producto/:id',(req,res)=> {
    producto.findOne({_id:req.params.id}).populate('comentariosId').exec((err, resultadoProducto) => {
      console.log('result product', resultadoProducto)
        res.render('product.ejs', {product:resultadoProducto})
    })
})

//nuevo POST para el comentario
// app.get('/comentario/:id', urlencodedParser, (req, res) => {
    // producto.findById(req.params.id, (err, resultadoProducto) => {
    //     console.log(resultadoProducto, req.body)
    //     // res.redirect(`/producto/${req.params.id}`)
    // })
// })


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
