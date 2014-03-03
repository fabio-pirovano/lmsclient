;define('controllers/ForgotPassword', ['appframework', 'core/Constants', 'libs/happy/happy', 'libs/happy/happy.methods', 'i18n!nls/forgot'],
                                       function($, Constants, happy, validators, forgot){

    var view;

    var doInit = function(v){

        view = v;

    };

    var doRecoverPassword = function(email){

        view.showLoader(true);

        $.ajax({

            url: Constants.API_URL,
            type: 'post',
            data: JSON.stringify({'details': {'action': 'recoverPassword', 'email': email}}),
            success: function (data) {

                var currentData = JSON.parse(data);

                if (currentData.success === true) {

                    view.showLoader(false);
                    view.showMessage()

                } else {

                    view.showLoader(false);
                    view.showMessage(currentData.message);

                }

            },
            error: function (xhr, error) {

                view.showLoader(false);
                view.showMessage(error.message);

            }
        });


    };

    var initValidation = function(form){

        console.log('init validation', form);

        //TODO add multi-language messages
        form.isHappy({
            fields: {
                // reference the field you're talking about, probably by `id`
                // but you could certainly do $('[name=name]') as well.
                '#e-mail': {

                    required: true,
                    message: forgot.emailRequired, //'Might we inquire your name'
                    test: validators.email

                },

                '#reset-url': {

                    required: true,
                    message: forgot.urlRequired //'Please type your password!'

                }
            },
            submitButton: '#do-recover'
        });

    };

    return{

        init: doInit,
        recoverPassword: doRecoverPassword,
        initValidation: initValidation

    };

});