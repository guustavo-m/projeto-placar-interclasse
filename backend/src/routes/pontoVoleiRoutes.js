const express =
    require("express");

const router =
    express.Router();

const PontoVoleiController =
    require(
        "../controllers/pontoVoleiController"
    );

const verificarToken =
    require("../../src/middleware/authMiddleware");

router.post(
    "/",
    verificarToken,
    PontoVoleiController.criar
);

router.get(
    "/partida/:id",
    verificarToken,
    PontoVoleiController.listarPorPartida
);

router.get(
    "/ranking/:id",
    verificarToken,
    PontoVoleiController.rankingPartida
);

router.delete(
    "/:id",
    verificarToken,
    PontoVoleiController.excluir
);

module.exports =
    router;