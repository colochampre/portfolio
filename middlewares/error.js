const error = {
    c404: (req, res) => {
        res.status(404).render("error", {
            title: "Error 404",
            message: "La página que buscas no existe",
        });
    },
    c500: (req, res, err) => {
        res.status(500).render("error", {
            title: "Error 500",
            message: err.message,
        });
    }
}

export default error;
