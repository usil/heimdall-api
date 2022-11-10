const express = require("express");
const router = express.Router();

const {
  getWebs,
  createStatusWeb
} = require("../controllers/StatusWeb")

/**
 * Listar resultados
 */
router.get("/target", getWebs)

/**
 * Crear estatus
 */
router.post("/target/result/result-summary/:url", createStatusWeb)

module.exports = router;