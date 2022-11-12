const express = require("express");
const router = express.Router();

const { getWebs, getResultWeb } = require("../controllers/Webs");

/**
 * Listar resultados
 */
router.get("/target", getWebs)

/**
 * Ver los resultados de un dia
 * recibe por query la web y el date en formato YYYY:MM:DD
 */
router.get("/target/test", getResultWeb)

/**
 * Crear estatus
 */
// router.post("/target/result/result-summary/:url", createStatusWeb)

module.exports = router;