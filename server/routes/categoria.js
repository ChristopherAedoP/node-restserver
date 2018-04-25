const express = require('express');

const {
	verificaToken,
	verificaAdmin_Rol
} = require('./../middlewares/autenticacion');
const Categoria = require('../models/categoria');

const app = express();

app.get('/categoria', verificaToken, function(req, res) {
	//  let desde = Number(req.query.desde || 0);
	//  let limite = Number(req.query.limite || 5);
	//  let condiciones = { estado: true }

	Categoria.find({})
		.sort('descripcion')
		.populate('usuario', 'nombre email')
		.exec((err, categoriasDB) => {
			if (err) {
				return res.status(400).json({
					ok: false,
					errcenas
				});
			}

			res.json({
				ok: true,
				categorias: categoriasDB
			});
		});
});

app.get('/categoria/:id', verificaToken, function(req, res) {
	let id = req.params.id;

	Categoria.findById(id)
		.populate('usuario', 'nombre email')
		.exec((err, categoriaDB) => {
			if (err) {
				return res.status(500).json({
					ok: false,
					err
				});
			}
			if (!categoriaDB) {
				return res.status(400).json({
					ok: false,
					err: {
						message: 'El id no existe.'
					}
				});
			}
			res.json({
				ok: true,
				categoriaDB
			});
		});
});

app.post('/categoria', verificaToken, function(req, res) {
	let body = req.body;

	let categoria = new Categoria({
		descripcion: body.descripcion,
		usuario: req.usuario._id
	});

	categoria.save((err, categoriaDB) => {
		if (err) {
			return res.status(500).json({
				ok: false,
				err
			});
		}

		if (!categoriaDB) {
			return res.status(400).json({
				ok: false,
				err
			});
		}

		res.json({
			ok: true,
			categoriaDB
		});
	});
});

app.put('/categoria/:id', verificaToken, function(req, res) {
	let id = req.params.id;

	let descCategoria = {
		descripcion: req.body.descripcion
	};

	Categoria.findByIdAndUpdate(
		id,
		descCategoria,
		{ new: true, runValidators: true },
		(err, categoriaDB) => {
			if (err) {
				return res.status(500).json({
					ok: false,
					err
				});
			}
			if (!categoriaDB) {
				return res.status(400).json({
					ok: false,
					err: {
						message: 'El id no existe.'
					}
				});
			}
			res.json({
				ok: true,
				categoria: categoriaDB
			});
		}
	);
});

app.delete('/categoria/:id', [verificaToken, verificaAdmin_Rol], function(
	req,
	res
) {
	let id = req.params.id;
	Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
		if (err) {
			return res.status(500).json({
				ok: false,
				err
			});
		}

		if (!categoriaDB) {
			return res.status(400).json({
				ok: false,
				err: {
					message: 'El id no existe.'
				}
			});
		}

		res.json({
			ok: true,
			message: 'Categoria borrada.',
			categoriaDB
		});
	});
});

module.exports = app;
