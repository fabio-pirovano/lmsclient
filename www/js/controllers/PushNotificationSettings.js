;define('controllers/PushNotificationSettings', ['appframework', 'core/Constants'], (function($, Constants){

    var view, pushNotification = window.plugins.pushNotification;

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

        view.showLoader(true);

        $.ajax({

            url: Constants.API_URL,
            type: 'post',
            data: JSON.stringify({'details': {'action': currentAction, 'userid': userID , 'uuid': device.uuid, 'os': device.platform, 'token': data.token, 'key': data.key}}),
            success: function( data ) {

                view.showLoader(false);
                var currentData = JSON.parse(data);

                if(currentData.success == true){

                    view.showSettingsChanged(true);

                    if(currentData.sender_id){

                        registerAndroidDevice(currentData.sender_id);

                    }else{

                        registerIOSDevice();

                    }

                }else{

                    view.showLoader(false);
                    view.showSettingsChanged(false);

                }

            },

            error: function(xhr, error){

                view.showSettingsChanged(false);

            }
        });

    };

    /* ##### Android device registration ##### */
    var registerAndroidDevice = function(senderID){

        pushNotification.register(function(result){console.log('register android device result', result);}, errorHandler, {'senderID': '"' + senderID + '"', 'ecb': 'onNotificationGCM'});

    };

    var onNotificationGCM = function (evt) {

        switch(evt.event){

            case 'registered':

                if (evt.regid.length > 0) {

                    // TODO send to the server the registration ID
                    console.log("regID = " + evt.regid);

            }

            break;

            case 'message':
                // if this flag is set, this notification happened while we were in the foreground.
                // you might want to play a sound to get the user's attention, throw up a dialog, etc.
                if (evt.foreground) {

                    // if the notification contains a soundname, play it.
                    var my_media = new Media('/android_asset/www/' + evt.soundname);
                    my_media.play();

                }else{	// otherwise we were launched because the user touched a notification in the notification tray.

                    if (evt.coldstart){

                        // $("#app-status-ul").append('<li>--COLDSTART NOTIFICATION--' + '</li>');

                    }else{

                        // $("#app-status-ul").append('<li>--BACKGROUND NOTIFICATION--' + '</li>');

                    }
                }

            break;

            case 'error':
            navigator.notification.alert(evt.messa);
            break;

        }
    };

    /* ##### IOS device registration ##### */
    var registerIOSDevice = function(){

        pushNotification.register(tokenHandler, errorHandler, {'badge': 'true', 'sound': 'true', 'alert': 'true', 'ecb': 'onNotificationAPN'});	// required!

    };

    var tokenHandler = function (result) {

        // TODO send the token back to the server

    };

    var onNotificationAPN = function (evt) {

        if (evt.alert) {

            navigator.notification.alert(evt.alert);

        }

        if (evt.sound) {

            var snd = new Media(evt.sound);
            snd.play();

        }

        if (evt.badge) {

            pushNotification.setApplicationIconBadgeNumber(function(result){console.log('set badge result', result);}, evt.badge);

        }

    };

    var errorHandler = function (error) {

        navigator.notification.alert(error);

    };

    return {

        init: init,
        changeSettings: changeSettings

    }

}));