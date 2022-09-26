const express = require('express');
const router = express.Router();
const { formProductos } = require('./productosController');
const { estaAutenticado } = require('../../middleware/index');


router.get('/', estaAutenticado, formProductos);

module.exports = router;