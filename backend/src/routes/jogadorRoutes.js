const express =
    require("express");

const router =
    express.Router();

const JogadorController =
    require(
        "../controllers/jogadorController"
    );

    const adminOnly =
    require(
        "../middleware/adminMiddleware"
    );

const verificarToken =
    require("../../src/middleware/authMiddleware");

const verificarAdmin =
    require("../../src/middleware/verificarAdmin");

router.post(
    "/",
    adminOnly,
    verificarToken,
    verificarAdmin,
    JogadorController.criar
);

router.get(
    "/",
    verificarToken,
    JogadorController.listar
);

router.get(
    "/:id",
    verificarToken,
    JogadorController.buscarPorId
);

router.get(
    "/equipe/:id",
    verificarToken,
    JogadorController.buscarPorEquipe
);

router.put(
    "/:id",
    adminOnly,
    verificarToken,
    verificarAdmin,
    JogadorController.atualizar
);

router.delete(
    "/:id",
    adminOnly,
    verificarToken,
    verificarAdmin,
    JogadorController.excluir
);

module.exports =
    router;