const express = require('express');

const {
	verificaToken,
	verificaAdmin_Rol
} = require('./../middlewares/autenticacion');
const Producto = require('../models/producto');

const app = express();

app.get('/producto', verificaToken, function(req, res) {
	let desde = Number(req.query.desde || 0);
	let limite = Number(req.query.limite || 5);

	Producto.find({ disponible: true })
		.skip(desde)
		.limit(limite)
		.sort('nombre')
		.populate('categoria', 'descripcion')
		.populate('usuario', 'nombre email')
		.exec((err, productosDB) => {
			if (err) {
				return res.status(400).json({ ok: false, err });
			}

			Producto.count({}, (err, conteo) => {
				res.json({
					ok: true,
					productos: productosDB,
					cuantos: conteo
				});
			});

			// res.json({ ok: true, productos: productosDB });
		});
});

app.get('/producto/:id', verificaToken, function(req, res) {
	let id = req.params.id;

	Producto.findById(id)
		.populate('categoria', 'descripcion')
		.populate('usuario', 'nombre email')
		.exec((err, productoDB) => {
			if (err) {
				return res.status(500).json({ ok: false, err });
			}
			if (!productoDB) {
				return res.status(400).json({
					ok: false,
					err: {
						message: 'El id no existe.'
					}
				});
			}
			res.json({ ok: true, productoDB });
		});
});

app.get('/producto/buscar/:termino', verificaToken, function(req, res) {
	let termino = req.params.termino;

	let reqex = new RegExp(termino, 'i');

	Producto.find({ nombre: reqex, disponible: true })
		.populate('categoria', 'descripcion')
		.populate('usuario', 'nombre email')
		.exec((err, productosDB) => {
			if (err) {
				return res.status(500).json({ ok: false, err });
			}
			if (!productosDB) {
				return res.status(400).json({
					ok: false,
					err: {
						message: 'no se encontraron datos.'
					}
				});
			}
			res.json({ ok: true, productos: productosDB });
		});
});

app.post('/producto', verificaToken, function(req, res) {
	let body = req.body;

	let producto = new Producto({
		nombre: body.nombre,
		precioUni: body.precioUni,
		descripcion: body.descripcion,
		disponible: body.disponible,
		categoria: body.categoria,
		usuario: req.usuario._id
	});

	producto.save((err, productoDB) => {
		if (err) {
			return res.status(500).json({
				ok: false,
				err
			});
		}

		if (!productoDB) {
			return res.status(400).json({
				ok: false,
				err
			});
		}

		res.json({
			ok: true,
			productoDB
		});
	});
});

app.put('/producto/:id', verificaToken, function(req, res) {
	let id = req.params.id;
	let body = req.body;

	let descproducto = {
		nombre: body.nombre,
		precioUni: body.precioUni,
		descripcion: body.descripcion,
		disponible: body.disponible,
		categoria: body.categoria
	};

	Producto.findByIdAndUpdate(
		id,
		descproducto,
		{ new: true, runValidators: true },
		(err, productoDB) => {
			if (err) {
				return res.status(500).json({
					ok: false,
					err
				});
			}
			if (!productoDB) {
				return res.status(400).json({
					ok: false,
					err: {
						message: 'El id no existe.'
					}
				});
			}
			res.json({
				ok: true,
				producto: productoDB
			});
		}
	);
});

app.delete('/producto/:id', [verificaToken, verificaAdmin_Rol], function(
	req,
	res
) {
	let id = req.params.id;

	Producto.findByIdAndUpdate(
		id,
		{ disponible: false },
		{ new: true, runValidators: true },
		(err, productoDB) => {
			if (err) {
				return res.status(500).json({
					ok: false,
					err
				});
			}
			if (!productoDB) {
				return res.status(400).json({
					ok: false,
					err: {
						message: 'El id no existe.'
					}
				});
			}
			res.json({
				ok: true,
				message: 'producto borrado.',
				productoDB
			});
		}
	);
});

module.exports = app;
