//* AUTORIZACIONES

const auth = (req, res, next) => {
    if (req.session.usuario) {
        next();
    } else {
        res.redirect('/login')
    }
};
const adminAuth = (req, res, next) => {
    if (req.session.rank == 2) {
        next();
    } else {
        res.status(401).send({ error: true });
    }
};

const authMW = (req, res, next) => {
    req.isAuthenticated() ? next() : res.send({error: true, msg: "no autenticado"})
}

module.exports = { auth, adminAuth, authMW }