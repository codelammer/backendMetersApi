const conn = require('../util/database');


module.exports = class Model {
    constructor (metercode, imei, zone, longitude = null, latitude = null){
        this.metercode = metercode;
        this.imei = imei;
        this.longitude = longitude;
        this.latitude = latitude; 
        this.zone = zone;
    }

    static findMeterModel(meterCodeF, callback){
        conn.query("SELECT * from metersdata WHERE meterCode = ?", meterCodeF , async (err, results) => {
            if (err) {
                console.log (`There was trouble executing the sql, error :${ err }`);
                callback ({error: "Internal server error"}, null);
            }else{
                if (!results.length > 0) {
                    callback (null, { message: false });
                }else{
                    callback (null, { message: true });
                }
                
            }
        });
    }

    static async updateLongLatScannerModel(meterUpdateArr, callback){
        if (!meterUpdateArr) {
            callback (null, { error: "body cannot be blank" });
            return;
        }else{
            conn.query("UPDATE metersdata SET longitude = ?, latitude = ? WHERE imei = ?", [ meterUpdateArr.longitude, meterUpdateArr.latitude, meterUpdateArr.imei ] , (err, results) => {
                if (err) {
                    callback ({error: err}, null);
                }else{
                    callback (null, { message: "Updated successfully"});
                    }
            });
        }
    } 

    static async updateLongLatModel(meterUpdateArr, callback){
        if (!meterUpdateArr) {
            callback (null, { error: "body cannot be blank" });
            return;
        }else{
            conn.query("UPDATE metersdata SET longitude = ?, latitude = ? WHERE metercode = ?", [ meterUpdateArr.longitude, meterUpdateArr.latitude, meterUpdateArr.metercode ] , (err, results) => {
                if (err) {
                    callback ({error: err}, null);
                }else{
                    callback (null, { message: "Updated successfully"});
                    }
            });
        }
    } 

    static addMeterDetailsModel(meterArr, callback) {
        conn.query("INSERT INTO metersdata (metercode, imei, zone) VALUES(?, ?, ?)", [meterArr.metercode, meterArr.imei, meterArr.zone], (err, results) => {
            if (err) {
                callback ({error: "Internal server error"}, null);
            }else{
                callback(null, { message: "meter record added successfully!"});
            }
        });
    }

    static checkImeiModel(imei, callback){
        conn.query("SELECT * FROM metersdata WHERE imei = ?", imei, (err, results) => {
            if (err) {
                callback(err, null);
            }else{
                if (results.length > 0) { 
                    console.log(results[0]);
                    callback(null, { message: true}); 
                } else {     
                    callback(null, { message: false});
                }
            }
        });
    }

    static checkMeterCodeZoneModel(reqBody, callback){
        conn.query("SELECT zone FROM metersdata WHERE metercode = ?", reqBody.metercode, (err, results) => {
            if (err) {
                callback(err, null);
            }else{
                if (results.length > 0) {
                    if (reqBody.zone && results[0].zone == reqBody.zone) {
                        callback(null, { message : true });
                    } else {
                       callback({ error: "Metercode found but zone does not match our databases" }, null); 
                    }
                } else {     
                    callback(null, { message: false});
                }
            }
        });
    }
}