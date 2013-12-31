;define('views/login/LoginView', ['appframework', 'domReady!',
                                  'controllers/Login', 'utils/ConfigurationManager', 'utils/LogoLoader', 'utils/InfoProvider'],
                                  (function($, document, controller, config, logoLoader, infoProvider){


    var $username, $password, $domain,
        $form, $forgotPassword;


    var onLogin = function(evt){

        console.log('mo loggo', evt, config.logoExists(), this);

        evt.preventDefault();

        if(config.logoExists()){

            controller.doLogin($username.val(), $password.val(), $domain.val());
            showLoader();

        }else{

            console.log('event', infoProvider.events.API_INFO_DATA_READY, this);

            addEventListener(infoProvider.events.API_INFO_DATA_READY, function(evt){

                evt.target.removeEventListener(evt.type, arguments.callee);

                addEventListener(logoLoader.events.LOGO_DATA_READY, function(evt){

                    evt.target.removeEventListener(evt.type, arguments.callee);

                    config.saveConfig('logo', evt.detail.logoData);

                    controller.doLogin($username.val(), $password.val(), $domain.val());
                    showLoader();

                    // TODO show the new screen with the logo and handle successful or unseccsful authentication

                });

                console.log('GETTING READY TO LOAD', infoProvider.logoURL(), this);

                logoLoader.load(infoProvider.logoURL());

            });

            infoProvider.getInfo();
            showLoader('Loading assets...');

        }

    };

    var showLoader = function(msg){

        // TODO Make the mask string multi language
        if(msg){

            $.ui.showMask(msg);

        }else{

            $.ui.showMask('Authenticating...');

        }

    };

    var hideLoader = function(){

        $.ui.hideMask();

    };

    var init = function(){

        // Initialize the loader and configuration managers
        logoLoader.init();
        config.init();

        $username =  $('#username');
        $password =  $('#password');
        $domain =    $('#website');

        $form = $('#login-form');
        $forgotPassword = $('#recover-password');

        // console.log('aqui', $, username, password, domain);

        controller.initValidation($form);

        $form.bind('submit', onLogin);
        $forgotPassword.bind('tap', controller.recoverPassword);

    };

    var dispose = function(){

        $form.unbind('submit', controller.doLogin);
        $forgotPassword.unbind('click', controller.recoverPassword);

        $username.val('');
        $password.val('');
        $domain.val('');

    };


    return {

        init: init,
        dispose: dispose,
        showLoader: showLoader,
        hideLoader: hideLoader

    }

}));