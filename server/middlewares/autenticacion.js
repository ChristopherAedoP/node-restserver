const jwt = require('jsonwebtoken');

// =====
//Verifica token 
// ==========

let verificaToken = (req, res, next) => {

    let token = req.get('Authorization');

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err
            });
        }

        req.usuario = decoded.usuario;

        next();
    })

}

let verificaAdmin_Rol = (req, res, next) => {

    let usuario = req.usuario;
    console.log(usuario);

    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.status(401).json({
            ok: false,
            err: {
                message: "El usuario no es administrador"
            }
        });
    }
}

module.exports = {
    verificaToken,
    verificaAdmin_Rol
}