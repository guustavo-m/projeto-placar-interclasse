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
    "/atual",
    PartidaController.buscarAtual
);

router.get(
    "/",
    PartidaController.listar
);

router.get(
    "/:id",
    PartidaController.buscarPorId
);

router.put(
    "/:id/gol/add/:lado",
    PartidaController.adicionarGol
);

router.put(
    "/:id/gol/remove/:lado",
    PartidaController.removerGol
);

router.put(
    "/falta/add/:lado",
    PartidaController.adicionarFalta
);

router.put(
    "/falta/remove/:lado",
    PartidaController.removerFalta
);

router.put(
    "/:id/cronometro/start",
    PartidaController.iniciarCronometro
);

router.put(
    "/:id/cronometro/stop",
    PartidaController.pararCronometro
);

router.put(
    "/:id/cronometro/reset",
    PartidaController.resetarCronometro
);

router.put(
    "/:id/tempo",
    PartidaController.alterarTempo
);

router.put(
    "/:id/finalizar",
    PartidaController.finalizarPartida
);

router.put(
    "/:id/retomar",
    PartidaController.retomarPartida
);

router.put(
    "/:id/set/add/:lado",
    PartidaController.adicionarSet
);

router.put(
    "/:id/set/remove/:lado",
    PartidaController.removerSet
);

router.put(
    "/:id/ponto/add/:lado",
    PartidaController.adicionarPonto
);

router.put(
    "/:id/ponto/remove/:lado",
    PartidaController.removerPonto
);

module.exports =
    router;