const express = require('express');
const { listarId, remover, hayProductos } = require('./api/productos');
const productos = require('./api/productos');

const app = express();
const router = express.Router();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const handlebars = require('express-handlebars');



app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('hbs', handlebars({
    extname: '.hbs',
    defaultLayout: 'index.hbs',
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials/'
}));

app.set('view engine', 'hbs');

app.set('views', './views');

app.use(express.static('views'));

app.get('/', (req, res) => {
    res.render('vista');
});
/* router.get('/', (req, res) => {
    console.log('request recibido!');
    res.json({ msg: 'Express Avanzado Martin Maidana' });
}); */

router.get('/productos/listar', (req, res) => {  
    res.send(productos.listar());}    
    )

    router.get('/formulario', (req, res) => {  
        res.render('layouts/formulario');}    
        )

router.get('/productos/vista', (req, res) => {   
    res.render('vista', { layouts: 'index', hayProductos: productos.hayProductos(), productos: productos.listar() });
    });

router.get('/productos/listar/:id', (req, res) => {
    consultaID = req.params.id;
    totalProd = productos.listar().filter(x => x.id == consultaID)
    res.send(totalProd);
    });

router.post('/productos/guardar', (req, res) => {
        let contenido = req.body;
        productos.guardar(contenido);
        //return res.json(contenido);
        res.redirect('../productos/vista')
})

router.put('/productos/actualizar/:id', (req, res) => {  
    consultaID = req.params.id;
    productos.remover(consultaID);
    let contenido = req.body;
    productos.reemplazar(contenido, consultaID)
    //return res.json(contenido);
});

router.delete('/productos/borrar/:id', (req, res) => { //delete
    consultaID = req.params.id;
    prodRemovido = productos.listar().filter(x => x.id == consultaID)
    productos.remover(consultaID);
    //res.send(prodRemovido)
});

app.use('/api', router);

const tablaProductos = [] 

io.on('connection', socket => {
    console.log('nuevo cliente conectado');
    console.log(this.productos)
    socket.emit('productos', this.productos )
    
    socket.on('producto', data => {
        console.log("nuevo producto", data)
        tablaProductos.push({titulo : productos.title, price: productos.price, thumbnail: productos.thumbnail});
        io.sockets.emit('productos', tablaProductos);
    })
})

// pongo a escuchar el servidor en el puerto indicado
const puerto = 8080;

const server = http.listen(puerto, () => {
    console.log(`servidor escuchando en http://localhost:${puerto}`);
});

// en caso de error, avisar
server.on('error', error => {
    console.log('error en el servidor:', error);
});
