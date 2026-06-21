const express =
    require("express");

const router =
    express.Router();

const ModalidadeController =
    require(
        "../controllers/modalidadeController"
    );

const verificarToken =
    require("../../src/middleware/authMiddleware");

router.get(
    "/",
    verificarToken,
    ModalidadeController.listar
);

module.exports =
    router;