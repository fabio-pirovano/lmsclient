;define('utils/ConfigurationManager', [], (function(){

    console.log('utils/ConfigurationManager', this)

    // Custom events
    var events = {DATA_READY: 'dataReady',
                  ITEM_ADDED: 'onItemAdded'};

    // Module variables
    var db, logoExists, isReady, data;
    var that = this;

    var initDatabase = function(tx) {

        data = {};
        tx.executeSql("CREATE TABLE IF NOT EXISTS 'configuration' ('id' INTEGER PRIMARY KEY, 'name' TEXT, 'value' BLOB)");

    };

    var init = function(){

        db = window.openDatabase('docebo', '1.0', 'docebo-lms', 1024 * 1024 * 20);
        db.transaction(initDatabase, onInitError, onInitSuccess);

    };

    var onInitError = function (err) {

        // TODO add a meaningful message for the user and log something on the device
        alert("Error processing SQL: " + err.code);

    };

    var onInitSuccess = function () {

        isReady = true;

        db.transaction(function(tx){

            console.log('faccio la query!!!!');
            tx.executeSql('SELECT * FROM configuration WHERE name = "logo"', [], onLogoResult, databaseError);

        }, databaseError);

    };

    var onLogoResult = function (tx, results) {

        console.log('on logo quey result', tx, results, results.rows.length);
        logoExists = Boolean(results.rows.length);

        if(logoExists){

            data['logo'] = results.rows.item(0).value;

        }

        var event = new CustomEvent(events.DATA_READY, {detail: {logoExists: logoExists}});
        this.dispatchEvent(event);

        // console.log('that', that, this);

    };

    var databaseError = function(error){

        console.log('Database error', error.code, SQLError);

        // TODO add a meaningful message for the user and log something on the device

        console.log('SQLError.UNKNOWN_ERR', SQLError.UNKNOWN_ERR);
        console.log('SQLError.DATABASE_ERR', SQLError.DATABASE_ERR);
        console.log('SQLError.VERSION_ERR', SQLError.VERSION_ERR);
        console.log('SQLError.TOO_LARGE_ERR', SQLError.TOO_LARGE_ERR);
        console.log('SQLError.QUOTA_ERR', SQLError.QUOTA_ERR);
        console.log('SQLError.SYNTAX_ERR', SQLError.SYNTAX_ERR);
        console.log('SQLError.CONSTRAINT_ERR', SQLError.CONSTRAINT_ERR);
        console.log('SQLError.TIMEOUT_ERR', SQLError.TIMEOUT_ERR);

    };

    var doLogoExists = function(){

        return logoExists;

    };

    var doIsReady = function(){

          return isReady;

    };

    var getConfigurationItem = function(name){

        return data[name];

    };

    var saveConfigurationItem = function(name, value){

        db.transaction(function(tx){

           // tx.executeSql('INSERT INTO configuration (name, value) VALUES (?,?)', [name, value], onLogoResult, databaseError);
            tx.executeSql('INSERT INTO configuration (name, value) VALUES (:name, :value)', [name, value], onConfigurationItemSaved, databaseError);
            // tx.executeSql('SELECT * FROM configuration WHERE name = "logo"', [], onLogoResult, databaseError);

        }, databaseError);

        data[name] = value;
        // console.log('that', that, this);

    };

    var onConfigurationItemSaved = function (tx, results) {

        console.log('on saveConfigurationItem query result', tx, results, results.rowsAffected, that);

        var event = new CustomEvent(events.ITEM_ADDED, {detail: {results: results}});
        that.dispatchEvent(event);

        console.log('that', that, this);

    }

    return {

        init: init,
        logoExists: doLogoExists,
        isReady: doIsReady,
        saveConfig: saveConfigurationItem,
        configurationItem: getConfigurationItem,
        events: events

    }

}));