const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');

const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

// default options
app.use(fileUpload());

app.put('/upload/:tipo/:id', function(req, res) {
	let tipo = req.params.tipo;
	let id = req.params.id;

	// extenciones permitidas.
	let tiposValidas = ['productos', 'usuarios'];
	if (tiposValidas.indexOf(tipo) < 0) {
		return res.status(400).json({
			ok: false,
			err: {
				message: 'Los tipos permitidos son: ' + tiposValidas.join(', ')
			}
		});
	}

	if (!req.files) {
		return res.status(400).json({
			ok: false,
			err: { message: 'No se ha seleccionado ningun archivo' }
		});
	}

	let archivo = req.files.archivo;
	let nombreCortado = archivo.name.split('.');
	let extencion = nombreCortado[nombreCortado.length - 1];

	// extenciones permitidas.
	let extencionesValidas = ['png', 'jpg', 'gif', 'jpeg'];
	if (extencionesValidas.indexOf(extencion) < 0) {
		return res.status(400).json({
			ok: false,
			err: {
				message:
					'Las extenciones permitidas son: ' +
					extencionesValidas.join(', '),
				ext: extencion
			}
		});
	}

	//cambiar nombre archivo
	let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extencion}`;

	archivo.mv(`uploads/${tipo}/${nombreArchivo}`, err => {
		if (err) {
			return res.status(500).json({ ok: false, err });
		}

		// aqui , imagen ya guardada en carpeta
		switch (tipo) {
			case 'usuarios':
				imagenUsuario(id, res, nombreArchivo);
				break;
			case 'productos':
				imagenProducto(id, res, nombreArchivo);
				break;
			default:
				break;
		}
	});
});

function imagenUsuario(id, res, nombreArchivo) {
	Usuario.findById(id, (err, usuariosDB) => {
		if (err) {
			borraArchivo(nombreArchivo, 'usuarios');

			return res.status(500).json({ ok: false, err });
		}

		if (!usuariosDB) {
			borraArchivo(nombreArchivo, 'usuarios');

			return res.status(400).json({
				ok: false,
				err: {
					message: 'Usuario no encontrado'
				}
			});
		}

		borraArchivo(usuariosDB.img, 'usuarios');

		usuariosDB.img = nombreArchivo;

		usuariosDB.save((err, usuarioGuardado) => {
			return res.json({
				ok: true,
				usuario: usuarioGuardado
			});
		});
	});
}

function imagenProducto(id, res, nombreArchivo) {
	Producto.findById(id, (err, productoDB) => {
		if (err) {
			borraArchivo(nombreArchivo, 'productos');

			return res.status(500).json({ ok: false, err });
		}

		if (!productoDB) {
			borraArchivo(nombreArchivo, 'productos');

			return res.status(400).json({
				ok: false,
				err: {
					message: 'Producto no encontrado'
				}
			});
		}

		borraArchivo(productoDB.img, 'productos');

		productoDB.img = nombreArchivo;

		productoDB.save((err, productoGuardado) => {
			return res.json({
				ok: true,
				producto: productoGuardado
			});
		});
	});
}

function borraArchivo(nombreImagen, tipo) {
	let pathImagen = path.resolve(
		__dirname,
		`../../uploads/${tipo}/${nombreImagen}`
	);
	if (fs.existsSync(pathImagen)) {
		fs.unlinkSync(pathImagen);
	}
}

module.exports = app;
