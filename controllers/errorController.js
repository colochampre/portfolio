const error404 = (req, res) => {
    res.status(404).render("error", {
        title: "Error 404",
        message: "La página que buscas no existe"
    });
};

export default {
    error404
};