const express = require("express");
const router = express.Router();

const { getWebs, getResultWeb, getResultsWeb } = require("../controllers/Webs");

/**
 * Listar resultados
 */
router.get("/target", getWebs)

/**
 * Ver los resultados de un dia
 * recibe por query la web y el date en formato YYYY:MM:DD
 */
router.get("/target/result-sumary/web", getResultWeb)

/**
 * Ver status de todas las webs
 */
router.get("/target/result-sumary/webs", getResultsWeb)

module.exports = router;