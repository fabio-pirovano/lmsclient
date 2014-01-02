;define('views/login/LoginView', ['appframework', 'controllers/Login'],
                                  (function($, controller){


    var $username, $password, $domain,
        $form, $forgotPassword;


    var onLogin = function(evt){

        evt.preventDefault();

        var username, password;
        username = $username.val();
        password = $password.val();

        controller.doLogin(username, password);

    };

    var showLoader = function(msg, callBack, panel){

        // TODO Make the mask string multi language
        if(msg && msg != ''){

            $.ui.showMask(msg);

        }else{

            $.ui.showMask('Authenticating...');

        }

        if(callBack){

            $('#' + panel).bind('loadpanel', function(e){

                callBack();

            });

        }

        if(panel){

            $.ui.loadContent(panel, false, false, 'up');

        }

    };

    var hideLoader = function(){

        $.ui.hideMask();

    };

    var init = function(){

        controller.init(this);

        $username =  $('#username');
        $password =  $('#password');
        $domain =    $('#website');

        $form = $('#login-form');
        $forgotPassword = $('#recover-password');

        controller.initValidation($form);

        $form.bind('submit', onLogin);
        $forgotPassword.bind('tap', controller.recoverPassword);

    };

    var dispose = function(){

        $form.unbind('submit', onLogin);
        $forgotPassword.unbind('tap', controller.recoverPassword);

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