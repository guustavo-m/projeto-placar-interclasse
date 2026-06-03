const express = require("express");
const router = express.Router();

const controller = require("../controllers/partidaController");

router.get("/", controller.obterPartida);

router.put("/times", controller.definirTimes);

router.put("/gol/add/:lado", controller.adicionarGol);
router.put("/gol/remove/:lado", controller.removerGol);

router.put("/falta/add/:lado", controller.adicionarFalta);
router.put("/falta/remove/:lado", controller.removerFalta);

router.put("/tempo", controller.editarTempo);

router.put("/cronometro/start", controller.iniciarCronometro);
router.put("/cronometro/stop", controller.pararCronometro);
router.put("/cronometro/reset", controller.reiniciarCronometro);

router.put("/reset", controller.resetarPartida);

module.exports = router;