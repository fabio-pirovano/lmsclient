;define('controllers/Login', ['libs/happy/happy', 'libs/happy/happy.methods', 'core/Constants',
    'utils/ConfigurationManager', 'utils/LogoLoader', 'utils/InfoProvider'],
    (function(happy, validators, Constants, config, logoLoader, infoProvider){

        var view, currentInterval;
        var that = this;

        var doRecoverPassword = function(){

            console.log('should  recover password');

        };

        var handleLogin = function(username, password){

            console.log(config.logoExists(), this)

            if(config.logoExists()){

                $("#login-loader").find("img").prop('src', config.configurationItem('logo'));

                view.showLoader('', function(){

                    login(username, password);

                }, 'login-loader');

            }else{

                console.log('event', infoProvider.events.API_INFO_DATA_READY, this, window, that);

                that.addEventListener(infoProvider.events.API_INFO_DATA_READY, function(evt){

                    evt.target.removeEventListener(evt.type, arguments.callee);

                    that.addEventListener(logoLoader.events.LOGO_DATA_READY, function(evt){

                        evt.target.removeEventListener(evt.type, arguments.callee);

                        config.saveConfig('logo', evt.detail.logoData);

                        $("#login-loader").find("img").prop('src', config.configurationItem('logo'));

                        view.showLoader('', function(){

                            login(username, password);

                        }, 'login-loader');

                    });

                    console.log('GETTING READY TO LOAD', infoProvider.logoURL(), this);

                    logoLoader.load(infoProvider.logoURL());

                });

                infoProvider.getInfo();
                view.showLoader('Loading assets...');

            }

        };

        var login = function(username, password){

            $.ajax({

                url: Constants.API_URL,
                type: 'post',
                data: JSON.stringify({'details': {'action': 'authenticate', 'username': username , 'password': password }}),
                success: function( data ) {

                    console.log( "Sample of data:", data);
                    var currentData = JSON.parse(data);

                    if(currentData.success === true){

                        require(['model/User'], function(User){

                            var currentUser = new User();

                            currentUser.username = username;
                            currentUser.id = currentData.id;
                            currentUser.token = currentData.token;

                            config.saveConfig('user', JSON.stringify(currentUser));

                            view.hideLoader('courses');
                            view.goNext();

                        });


                    }else{

                        var popup = view.invalidCredentials(currentData.message);
                        currentInterval = setInterval(function(){

                            handleUnsuccessfulLogin(popup);

                        }, 120);

                    }

                },
                error: function(xhr, error){

                    console.log(arguments);

                }
            });

        }

        var elementInDocument = function(element) {

            while (element = element.parentNode) {

                if (element == document) {

                    return true;

                }
            }

            return false;

        };

        var handleUnsuccessfulLogin= function(element){

            if(!elementInDocument(element)){

                clearInterval(currentInterval);
                view.hideLoader('main');

            }

        };

        var initValidation = function(form){

            console.log('init validation', form);

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

        var init = function(v){

            view = v;

            // Initialize the loader and configuration managers
            logoLoader.init();
            config.init();

        };

        return{

            doLogin: handleLogin,
            initValidation: initValidation,
            recoverPassword: doRecoverPassword,
            init: init

        }

    }));
