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
    "/cronometro/start",
    PartidaController.iniciarCronometro
);

router.put(
    "/cronometro/stop",
    PartidaController.pararCronometro
);

router.put(
    "/cronometro/reset",
    PartidaController.resetarCronometro
);

module.exports =
    router;