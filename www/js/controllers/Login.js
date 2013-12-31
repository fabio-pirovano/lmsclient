;define('controllers/Login', ['libs/happy/happy', 'libs/happy/happy.methods', 'core/Constants'], (function(happy, validators, Constants){

    var doRecoverPassword = function(){

        console.log('should  recover password');

    };

    var login = function(username, password){

        $.ajax({

            url: Constants.API_URL,
            type: 'post',
            data: JSON.stringify({'details': {'action': 'authenticate', 'username': username , 'password': password }}),
            success: function( data ) {

                console.log( "Sample of data:", data);

            },
            error: function(xhr, error){

                console.log(arguments);

            }
        });

    };

    var initValidation = function(form){

        console.log('init validation', form, happy);

        //TODO add multi-language messages

        form.isHappy({
            fields: {
                // reference the field you're talking about, probably by `id`
                // but you could certainly do $('[name=name]') as well.
                '#username': {

                    required: true,
                    message: 'Might we inquire your name'

                },

                '#password': {

                    required: true,
                    message: 'Please type your password!'

                },

                '#website':{

                    required: true,
                    message: 'Specify the web site you would like to login',
                    test: validators.website

                }
            },
            submitButton: '#do-login'
        });

    };


    return{

        doLogin: login,
        initValidation: initValidation,
        recoverPassword: doRecoverPassword

    }

}));
