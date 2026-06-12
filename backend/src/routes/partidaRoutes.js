const express =
    require("express");

const router =
    express.Router();

const PartidaController =
    require(
        "../controllers/partidaController"
    );

router.post(
    "/",
    PartidaController.criar
);

router.get(
    "/",
    PartidaController.listar
);

router.get(
    "/:id",
    PartidaController.buscarPorId
);

module.exports =
    router;