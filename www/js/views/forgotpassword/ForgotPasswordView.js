;define('views/forgotpassword/ForgotPasswordView', ['controllers/ForgotPassword', 'i18n!nls/forgot'], (function(controller, forgot){

    var $resetURL, $email, $doRecover, $introText, $form;

    var doInit = function(){

        console.log('should be ready');

        controller.init(this);

        $form           = $('#recover-pwd-form');
        $resetURL       = $('#reset-url');
        $email          = $('#e-mail');
        $doRecover      = $('#do-recover');
        $introText      = $('#intro-text');

        $introText.text(forgot.welcome);

        $resetURL.attr('placeholder', forgot.resetURL);
        $email.attr('placeholder', forgot.email);
        $doRecover.text(forgot.reset);

        require(['libs/happy/happy'], function(happy){

            controller.initValidation($form);

        });

        $form.bind('submit', recoverPassword);

    };

    var recoverPassword = function(evt){

        evt.preventDefault();

        controller.recoverPassword($email.val());

    };

    var doShowLoader = function(status, message){

        if(status){

            $.ui.showMask(message || forgot.loading);

        }else{

            $.ui.hideMask();

        }

    };

    var doShowMessage = function(msg){

        if(msg){

            return document.getElementById($.ui.popup(msg).id);

        }

    };

    return{

        init: doInit,
        showLoader: doShowLoader,
        showMessage: doShowMessage

    }

}));