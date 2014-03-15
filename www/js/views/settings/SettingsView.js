;define('views/settings/SettingsView', ['appframework', 'i18n!nls/miscellaneous', 'utils/ConfigurationManager'], function($, miscellaneous, config){

    var $pushNotification, $pushNotificationLabel, $pushNotificationsValue;

    var onPushNotification = function(evt){

        config.saveConfig('pushnotifications', evt.target.checked);

    };

    var onSettingFound = function(evt){

        evt.target.removeEventListener(evt.type, arguments.callee);

        if(evt.detail.value == 'true'){

            $pushNotification.attr('checked');

        }else{

            $pushNotification.removeAttr('checked');

        }

        $pushNotification.bind('change', onPushNotification);

    };

    var init = function(){

        $pushNotification           = $('#push-notification-settings input[type="checkbox"]');
        $pushNotificationLabel      = $('#push-notification-settings .narrow-control');
        $pushNotificationsValue     = $('#push-notification-values');

        $pushNotificationLabel.text(miscellaneous.pushnotification);
        $pushNotificationsValue.attr('data-on', miscellaneous.yes);
        $pushNotificationsValue.attr('data-off', miscellaneous.no);

        addEventListener(config.events.CONFIGURATION_VALUE_FOUND, onSettingFound);
        config.configurationItem('pushnotifications');

    };

    return{

        init: init

    };

});