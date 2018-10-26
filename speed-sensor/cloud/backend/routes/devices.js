const createError = require("http-errors");
const express = require("express");
const router = express.Router();
const KNoTCloud = require("knot-cloud");

router.get("/", async function(req, res) {
  const meshbluHost = req.get("Meshblu-Host");
  const meshbluPort = parseInt(req.get("Meshblu-Port"), 10);
  const meshbluAuthUUID = req.get("Meshblu-Auth-UUID");
  const meshbluAuthToken = req.get("Meshblu-Auth-Token");

  const cloud = new KNoTCloud(
    meshbluHost,
    meshbluPort,
    meshbluAuthUUID,
    meshbluAuthToken
  );

  try {
    await cloud.connect();
    res.status(200).send("OK");
  } catch (err) {
    res.status(500).send(err);
    console.log("not connected!!!");
  } finally {
    await cloud.close();
  }
});

module.exports = router;
