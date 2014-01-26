;define('views/forgotpassword/ForgotPasswordView', ['i18n!nls/forgot'], (function(forgot){

    var $userId, $email, $doRecover;

    var doInit = function(){

        console.log('forgot password ready!');

        $userId         = $('#user-id');
        $email          = $('#e-mail');
        $doRecover      = $('#do-recover');

        $userId.attr('placeholder', forgot.username);
        $email.attr('placeholder', forgot.email);

        $doRecover.val(forgot.reset);

    };

    return{

        init: doInit

    }

}));