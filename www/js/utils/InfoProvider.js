define('utils/InfoProvider', ['core/Constants'], (function(Constants){

    var events = {API_INFO_DATA_READY: 'onInfoDataReady'};

    var logoURL, dataCache;
    var that = this;

    var getInfo = function(){

        if(dataCache && logoURL){

            dataReady();

        }else{

            $.ajax({

                url: Constants.API_URL,
                type: 'post',
                data: JSON.stringify({'details': {'action': 'getlmsinfo'}}),
                success: function( data ) {

                    dataCache = JSON.parse(data);

                    if(dataCache.success === true){

                        logoURL = dataCache.logo;
                        dataReady();

                    }

                },
                error: function(xhr, error){

                    console.log(arguments);

                }
            });

        }

    };

    var dataReady = function(){

        // console.log('ON DATA READY', logoURL, this, this.dispatchEvent)

        var event = new CustomEvent(events.API_INFO_DATA_READY, {bubbles: true, cancelable: true});
        that.dispatchEvent(event);

        /*
        var evt = document.createEvent("Event");
        evt.initEvent(events.API_INFO_DATA_READY, true, true);

        this.dispatchEvent(evt);

        */

    };

    return {

        getInfo: getInfo,
        logoURL: function(){return logoURL;},
        events:  events

    }

}));