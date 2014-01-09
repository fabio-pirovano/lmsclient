;define('main', ['appframework', 'appframeworkui', 'views/login/LoginView', 'core/DataManager', 'i18n!nls/nav'], (function($, $ui, login, dataManager, nav){

    var onDeviceReady = function(){

        var platform, devicePlatform

        if(window.device && window.device.available){

            devicePlatform = window.device.platform;

        }else{

            devicePlatform = 'iOS';

        }

        switch (true){

            case  devicePlatform == 'Android':
            platform = 'android';
            break;

            case  devicePlatform == 'BlackBerry':
            platform = 'bb';
            break;

            case  devicePlatform == 'WinCE':
            platform = 'win8';
            break;

            case  devicePlatform == 'iOS':
            // TODO uncomment for production
            window.device.version >= 7.0 ?  platform = 'ios7' : platform = 'ios';
            platform = 'ios7';
            break;

            default:
            platform = 'ios7';
            break;

        }

        $('#afui').get(0).className = platform;

        alert(platform)

        $(document).ready(function(){

            navigator.globalization.getPreferredLanguage(onSystemLanguage, onGlobalizationError);
            addEventListener('localePreferenceChanged', onLocalePreferenceChanged);

            $ui.launch();
            $ui.showBackButton = false;

            $ui.disableSideMenu();
            $ui.toggleNavMenu();

            $('#courses-link').text(nav.courses);
            $('#reports-link').text(nav.reports);
            $('#settings-link').text(nav.settings);
            $('#logout-link').text(nav.logout);

            // login.init('it');
            // dataManager.init();

        });

    };

    var onLocalePreferenceChanged = function(evt){

        localStorage.setItem('userLocale', evt.detail.value.toLocaleLowerCase());
        location.reload();

    };

    var onSystemLanguage = function(locale){

        console.log('onPreferredLanguage', locale.value);

        $ui.launch();
        dataManager.init();

        login.init(localStorage.getItem('userLocale') || locale.value);

    };

    var onGlobalizationError = function(error) {

        navigator.notification.alert('code: ' + error.code + '\n' + 'message: ' + error.message + '\n', null);

    };

    var init = function(){

        console.log($);

        document.addEventListener('deviceready', onDeviceReady, false);
        // onDeviceReady();


    };

    return{

        init: init

    };


}));