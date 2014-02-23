;define('views/forgotpassword/ForgotPasswordView', ['i18n!nls/forgot'], (function(forgot){

    var $resetURL, $email, $doRecover;

    var doInit = function(){

        console.log('forgot password ready!');

        $resetURL       = $('#reset-url');
        $email          = $('#e-mail');
        $doRecover      = $('#do-recover');

        $resetURL.attr('placeholder', forgot.resetURL);
        $email.attr('placeholder', forgot.email);

        $doRecover.val(forgot.reset);

    };

    return{

        init: doInit

    }

}));