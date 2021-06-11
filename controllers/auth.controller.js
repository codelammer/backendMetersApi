const Meter = require ('../models/meter.model');

//this is responsible for registering a Meter to the database
exports.addMeterDetails = (req, res) => {
    //check whether the req body is empty or not before proceeding
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
        res.status(400).send( { error: "Please fill in all the fields" } );
        return; 
    } else {
        //make sure none of the important fields are blank
        if (req.body.metercode != "" && req.body.imei != "" && req.body.zone != "") {
                //check whether the meter exists: if yes then abort the add request
                Meter.findMeterModel(req.body.metercode , async (err, results) => {

                    if (results) {                        
                        if (results.message) {
                            res.send({ error: "Meter already exist, cannot contain duplicate metercodes!" });                           
                        } else if (results.message == false){
                            

                            //check whether the imei exists: if yes then abort the add request
                            Meter.checkImeiModel(req.body.imei, async (errM, resultsM) => {
                                console.log("in the check imei blockkkk");
                                console.log(resultsM);
                                if (resultsM.message == true) {
                                    res.send({ error: "cannot contain duplicate IMEI entries" });
                                } else if(resultsM.message == false){
                                    let MeterArr = new Meter(req.body.metercode, req.body.imei, req.body.zone);
                                    Meter.addMeterDetailsModel(MeterArr, (err, results) => {
                                        if (err) {
                                            if(err.code == "ER_BAD_NULL_ERROR"){
                                                res.status(500).send({ error: "Internal server error"}); 
                                            }
                                            res.status(500).send({ error: "Error inserting values in the database"});
                                        }else{
                                            //no error
        
                                            res.send(results);
                                        }        
                                    });   

                                }
                            });


                        }
                    } else if (err) {
                        res.status(500).send({error: err});
                    }
                });
                

                
        } else {
            res.status(400).send({message: "Please make sure you have not submitted empty data"});
        }

    }
}

//this is for updating longitude based on a scanner
exports.updateLongLatZoneScanner = (req, res) => {
    //check whether the Meter has not submited an empty body request
    console.log("controller scanner");
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
        res.status(400).send( { message: "Please fill in all the fields" } );
        return; 
    }

    //before updating check whether IMEI exists in the server
    Meter.checkImeiModel(req.body.imei, async (err, results) => {
        if (err) {
            res.send(err);
        } else {
            if (results.message === true) {
                Meter.updateLongLatScannerModel(req.body, async (errR, resultsS) => {
                    console.log("controller scanner");
                    if (errR) {
                        res.status(500).send({ error: errR.error });
                    }else{
                        res.send(resultsS);
                    }        
                });            
            } 
            else if(results.message === false) {
                res.send({error: "IMEI does not exist in our database"});
            }
        }
    });
    //actual update  

}



//this is for updating longitude and latitudes manually
exports.updateLongLatZone = (req, res) => {
    //check whether the Meter has not submited an empty body request
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
        res.status(400).send( { message: "Please fill in all the fields" } );
        return; 
    }

    //before updating check whether Meter and Zone exists in the server
    Meter.checkMeterCodeZoneModel(req.body, async (err, results) => {

        // res.send(results);
        if (err) {
            res.send(err);
        } else {
            if (results.message === true) {
                //proceed with the update as the request body matches the database
                Meter.updateLongLatModel(req.body, async (errR, resultsS) => {
                    if (errR) {
                        res.status(500).send({ error: errR.error });
                    }else{
                        res.send(resultsS);
                    }        
                });            
            } 
            else if(results.message === false) {
                res.send({error: "Metercode not found! Please enter the correct details"});
            }
        }
    });
    //actual update

     

}
