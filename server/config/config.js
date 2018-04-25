/// =============
/// PUERTO
/// =============
process.env.PORT = process.env.PORT || 3000;

/// =============
/// Entorno
/// =============
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

/// =============
/// Vencimiento Token
/// =============
// 60 segundos
// 60 minutos
// 24 horas
// 30 dias

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

/// =============
/// SEED de autentificacion
/// =============

process.env.SEED = process.env.SEED || 'secreto-es-el-seed-desarrollo';

/// =============
/// base de datos
/// =============
let urlDB;

if (process.env.NODE_ENV === 'dev') {
	urlDB = `mongodb://localhost:27017/cafe`;
} else {
	urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

/// =============
/// Google Cliente ID
/// =============

process.env.G_CLIENT_ID =
	process.env.G_CLIENT_ID ||
	'11895244134-vtq1i5m42p3l7qiklogkbshuuiu69k6v.apps.googleusercontent.com';
