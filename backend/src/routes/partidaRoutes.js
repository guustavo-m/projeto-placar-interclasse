const express =
    require("express");

const router =
    express.Router();

const PartidaController =
    require(
        "../controllers/partidaController"
    );

const verificarToken =
    require("../../src/middleware/authMiddleware");

router.post(
    "/",
    verificarToken,
    PartidaController.criar
);

router.get(
    "/atual",
    verificarToken,
    PartidaController.buscarAtual
);

router.get(
    "/",
    verificarToken,
    PartidaController.listar
);

router.get(
    "/:id",
    verificarToken,
    PartidaController.buscarPorId
);

router.put(
    "/:id/gol/add/:lado",
    verificarToken,
    PartidaController.adicionarGol
);

router.put(
    "/:id/gol/remove/:lado",
    verificarToken,
    PartidaController.removerGol
);

router.put(
    "/falta/add/:lado",
    verificarToken,
    PartidaController.adicionarFalta
);

router.put(
    "/falta/remove/:lado",
    verificarToken,
    PartidaController.removerFalta
);

router.put(
    "/:id/cronometro/start",
    verificarToken,
    PartidaController.iniciarCronometro
);

router.put(
    "/:id/cronometro/stop",
    verificarToken,
    PartidaController.pararCronometro
);

router.put(
    "/:id/cronometro/reset",
    verificarToken,
    PartidaController.resetarCronometro
);

router.put(
    "/:id/tempo",
    verificarToken,
    PartidaController.alterarTempo
);

router.put(
    "/:id/finalizar",
    verificarToken,
    PartidaController.finalizarPartida
);

router.put(
    "/:id/retomar",
    verificarToken,
    PartidaController.retomarPartida
);

router.put(
    "/:id/set/add/:lado",
    verificarToken,
    PartidaController.adicionarSet
);

router.put(
    "/:id/set/remove/:lado",
    verificarToken,
    PartidaController.removerSet
);

router.put(
    "/:id/ponto/add/:lado",
    verificarToken,
    PartidaController.adicionarPonto
);

router.put(
    "/:id/ponto/remove/:lado",
    verificarToken,
    PartidaController.removerPonto
);

module.exports =
    router;