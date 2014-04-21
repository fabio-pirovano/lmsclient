;define('controllers/PushNotificationSettings', ['appframework', 'core/Constants'], (function($, Constants){

    var view;

    var init = function(v){

        view = v;

    };

    var changeSettings = function(status, userID, data){

        var currentAction;

        if(status == true){

            currentAction = 'register';

        }else{

            currentAction = 'unregister';

        }

        $.ajax({

            url: Constants.API_URL,
            type: 'post',
            data: JSON.stringify({'details': {'action': currentAction, 'userid': userID , 'uuid': device.uuid, 'os': device.os, 'token': data.token, 'key': data.key}}),
            success: function( data ) {

                    view.showSettingsChanged(true);

            },

            error: function(xhr, error){

                view.showSettingsChanged(false);

            }
        });


    };

    return {

        init: init,
        changeSettings: changeSettings

    }


}));