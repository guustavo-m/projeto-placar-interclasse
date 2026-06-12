const express =
    require("express");

const router =
    express.Router();

const JogadorController =
    require(
        "../controllers/jogadorController"
    );

router.post(
    "/",
    JogadorController.criar
);

router.get(
    "/",
    JogadorController.listar
);

router.get(
    "/:id",
    JogadorController.buscarPorId
);

router.get(
    "/equipe/:id",
    JogadorController.buscarPorEquipe
);

module.exports =
    router;