;define('main', ['appframework', 'appframeworkui', 'views/login/LoginView', 'core/DataManager'], (function($, $ui, login, dataManager){

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
            // window.device.version === 7.0 ?  platform = 'ios7' : platform = 'ios';
            platform = 'ios7';
            break;

            default:
            platform = 'ios7';
            break;

        }

        $('#afui').get(0).className = platform;

        $(document).ready(function(){

            $ui.launch();

            dataManager.init();
            login.init();


        });


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