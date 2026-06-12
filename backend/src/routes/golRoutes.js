const express =
    require("express");

const router =
    express.Router();

const GolController =
    require(
        "../controllers/golController"
    );

router.post(
    "/",
    GolController.criar
);

router.get(
    "/partida/:id",
    GolController.listarPorPartida
);

router.delete(
    "/:id",
    GolController.remover
);

module.exports =
    router;