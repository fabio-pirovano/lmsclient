;define('controllers/Login', ['libs/happy/happy', 'libs/happy/happy.methods', 'core/Constants',
    'utils/ConfigurationManager', 'utils/LogoLoader', 'utils/InfoProvider', 'core/DataManager',
    'i18n!nls/login'],
    (function(happy, validators, Constants, config, logoLoader, infoProvider, dataManager, loginMessages){

        var view, currentInterval;
        var that = this;
        var cache = {};

        var doRecoverPassword = function(){

            console.log('should  recover password');

            var event = new CustomEvent(Constants.CHANGE_VIEW_EVENT, {detail: {view: Constants.FORGOT_PWD_VIEW, module: Constants.FORGOT_PWD_MODULE, data: null, state: null}});
            that.dispatchEvent(event);

        };

        var handleLogin = function(username, password){

            console.log(config.logoExists(), this);
            cache['login-loader'] =  $('#login-loader');

            if(config.logoExists()){

                cache['login-loader'].find("img").prop('src', config.configurationItem('logo'));

                view.showHideLoader(true, '', function(){

                    login(username, password);

                }, 'login-loader');

            }else{

                console.log('event', infoProvider.events.API_INFO_DATA_READY, this, window, that);

                that.addEventListener(infoProvider.events.API_INFO_DATA_READY, function(evt){

                    evt.target.removeEventListener(evt.type, arguments.callee);

                    that.addEventListener(logoLoader.events.LOGO_DATA_READY, function(evt){

                        evt.target.removeEventListener(evt.type, arguments.callee);

                        config.saveConfig('logo', evt.detail.logoData);

                        cache['login-loader'].find("img").prop('src', config.configurationItem('logo'));

                        view.showHideLoader('', function(){

                            login(username, password);

                        }, 'login-loader');

                    });

                    console.log('GETTING READY TO LOAD', infoProvider.logoURL(), this);

                    logoLoader.load(infoProvider.logoURL());

                });

                infoProvider.getInfo(view.getDomain());
                view.showHideLoader(true, login.loadingAssets);

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

                            currentUser.getUsername = username;
                            currentUser.id = currentData.id_user;

                            currentUser.token = currentData.token;

                            var event = new CustomEvent(dataManager.events.USER_LOGGED_IN, {detail: {user: currentUser}});
                            that.dispatchEvent(event);

                            config.saveConfig('username', username);

                            cache['login-loader'].removeAttr('src');
                            view.showHideLoader(false);
                            view.goNext();

                            var event = new CustomEvent(Constants.CHANGE_VIEW_EVENT, {detail: {view: Constants.COURSES_VIEW, module: Constants.COURSES_MODULE, data: dataManager, state: null}});
                            that.dispatchEvent(event);

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
                        message: loginMessages.userRequired //'Might we inquire your name'

                    },

                    '#password': {

                        required: true,
                        message: loginMessages.passRequired //'Please type your password!'

                    },

                    '#website':{

                        required: true,
                        message: loginMessages.domainRequired, // 'Specify the web site you would like to login',
                        test: validators.website

                    }
                },
                submitButton: '#do-login'
            });

        };

        var onUsername = function(evt) {

            evt.target.removeEventListener(evt.type, arguments.callee);
            view.getUsername().attr('value', evt.detail.value);

        };

        var doChangeLanguage = function(evt){

            var event = new CustomEvent('localePreferenceChanged', {detail: {value: evt.target.value }, bubbles: true, cancelable: true});
            that.dispatchEvent(event);

        };

        var init = function(v){

            view = v;

            that.addEventListener(config.events.CONFIGURATION_VALUE_FOUND, onUsername);
            that.addEventListener(config.events.DATA_READY, function(evt){

                evt.target.removeEventListener(evt.type, arguments.callee);

                var value = config.configurationItem('username');

                if(value){

                    view.getUsername().attr('value', value);
                    that.removeEventListener(config.events.CONFIGURATION_VALUE_FOUND, onUsername);

                }

            });

            // Initialize the loader and configuration managers
            logoLoader.init();
            config.init();

        };

        return{

            doLogin: handleLogin,
            initValidation: initValidation,
            recoverPassword: doRecoverPassword,
            changeLanguage: doChangeLanguage,
            init: init

        }

    }));
