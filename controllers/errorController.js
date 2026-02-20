const error404 = (req, res) => {
    res.status(404).send("Página no encontrada");
};

export default { 
    error404 
};