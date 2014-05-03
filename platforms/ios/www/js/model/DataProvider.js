;define('model/DataProvider', ['appframework', 'core/Constants', 'i18n!nls/miscellaneous'], (function($, Constants, miscellaneous){

    var failureHandlerActive, currentApiURL;

    var onAppOffline = function(evt){

        navigator.notification.alert(miscellaneous.connectionRequired);

    };

    var initFailureHandler = function(){

        failureHandlerActive = true;
        document.addEventListener('offline', onAppOffline, false);

    };

    var setCurrentApiURL = function(value){

        currentApiURL = value;

    };

    var fetchData = function(params, successHandler, errorHandler){

        $.ajax({

            url: currentApiURL + Constants.API_URL,
            type: 'post',
            data: params,
            success: successHandler,
            error: errorHandler

        });

        if(!failureHandlerActive){

            initFailureHandler();

        }

    };

    return {

        fetchData: fetchData,
        setCurrentApiURL: setCurrentApiURL

    }

}));