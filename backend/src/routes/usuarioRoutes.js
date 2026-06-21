const express =
    require("express");

const router =
    express.Router();

const UsuarioController =
    require(
        "../controllers/usuarioController"
    );

const adminOnly =
    require(
        "../middleware/adminMiddleware"
    );

const verificarToken =
    require("../../src/middleware/authMiddleware");

const verificarAdmin =
    require("../../src/middleware/verificarAdmin");

router.get(
    "/",
    verificarToken,
    adminOnly,
    verificarAdmin,
    UsuarioController.listar
);

router.get(
    "/:id",
    verificarToken,
    adminOnly,
    verificarAdmin,
    UsuarioController.buscarPorId
);

router.post(
    "/",
    verificarToken,
    adminOnly,
    verificarAdmin,
    UsuarioController.criar
);

router.put(
    "/:id",
    verificarToken,
    adminOnly,
    verificarAdmin,
    UsuarioController.atualizar
);

router.delete(
    "/:id",
    verificarToken,
    adminOnly,
    verificarAdmin,
    UsuarioController.excluir
);

module.exports =
    router;