const controller = require ('../controllers/auth.controller');
const express = require('express');
const router = express.Router();

router
    .route("/")
        .get((req, res) => {
            res.send({message: `you are in the default route`});
        });
router
    .route("/addMeterDetails")
        .post(controller.addMeterDetails);

router
    .route("/updateLongLatZoneScanner")
        .put(controller.updateLongLatZoneScanner);   
router
    .route("/updateLongLatZone")
        .put(controller.updateLongLatZone);   

module.exports = router;


