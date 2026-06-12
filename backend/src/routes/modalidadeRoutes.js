const express =
    require("express");

const router =
    express.Router();

const ModalidadeController =
    require(
        "../controllers/modalidadeController"
    );

router.get(
    "/",
    ModalidadeController.listar
);

module.exports =
    router;