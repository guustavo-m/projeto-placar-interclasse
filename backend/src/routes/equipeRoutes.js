const express =
    require("express");

const router =
    express.Router();

const EquipeController =
    require(
        "../controllers/equipeController"
    );

router.post(
    "/",
    EquipeController.criar
);

router.get(
    "/",
    EquipeController.listar
);

router.get(
    "/filtro",
    EquipeController.listarPorFiltro
);

router.get(
    "/:id",
    EquipeController.buscarPorId
);

router.get(
    "/modalidade/:id",
    EquipeController.buscarPorModalidade
);

router.put(
    "/:id",
    EquipeController.atualizar
);

router.delete(
    "/:id",
    EquipeController.excluir
);

module.exports =
    router;