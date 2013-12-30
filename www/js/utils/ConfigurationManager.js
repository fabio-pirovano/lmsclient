;define('utils/ConfigurationManager', [], (function(){

    // Custom events
    var events = {DATA_READY: 'dataReady'};

    // Module variables
    var db, logoExists, isReady;


    var initDatabase = function(tx) {

        tx.executeSql("CREATE TABLE IF NOT EXISTS 'configuration' ('id' INTEGER PRIMARY KEY, 'name' varchar(255), 'value', blob)");

    };

    var init = function(){

        db = window.openDatabase('docebo', '1.0', 'docebo-lms', 1024 * 1024 * 10);
        db.transaction(initDatabase, onInitError, onInitSuccess);

    };

    var onInitError = function (err) {

        // TODO add a meaningful message for the user and log something on the device
        alert("Error processing SQL: "+err.code);

    };

    var onInitSuccess = function () {

        isReady = true;

        db.transaction(function(tx){

            tx.executeSql('SELECT * FROM configuration WHERE name = "logo"', [], onLogoResult, databaseError);

        }, databaseError);

    };

    var onLogoResult = function (tx, results) {

        console.log('on logo', tx, results, results.rows.item(0));
        logoExists = Boolean(results.rowsAffected);

        var event = new CustomEvent(events.DATA_READY, {'details': {'logoExists': logoExists}});
        this.dispatchEvent(event);

    };

    var databaseError = function(error){

        // TODO add a meaningful message for the user and log something on the device

    };

    var doLogoExists = function(){

        return logoExists;

    };

    var doIsReady = function(){

          return isReady;

    };

    var saveConfigurationItem = function(name, value){

        db.transaction(function(tx){

            tx.executeSql('INSERT INTO configuration (name, value) VALUES (:name, :value)', [name, value], onLogoResult, databaseError);

        }, databaseError);

    };

    return {

        init: init,
        logoExists: doLogoExists,
        isReady: doIsReady,
        saveConfig: saveConfigurationItem,
        events: events

    }

}));