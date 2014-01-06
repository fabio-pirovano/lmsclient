;define('views/login/LoginView', ['appframework', 'controllers/Login', 'i18n!nls/login'],
    (function($, controller, loginMessages){


        var $username, $password, $domain,
            $form, $forgotPassword, $languageSelector;


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
                    $('#' + panel).unbind('loadpanel', arguments.callee);

                });

            }

            if(panel){

                $.ui.loadContent(panel, false, false, 'up');

            }

        };

        var hideLoader = function(panel){

            $.ui.hideMask();

            if(panel){

                $.ui.loadContent(panel, false, false, 'up');

            }

        };

        var doGoNext = function(){

            //TODO handle the app routing since here

        };

        var invalidCredentials = function(msg){

            return document.getElementById($.ui.popup(msg).id);

        };

        var init = function(lang){

            controller.init(this);

            $username           = $('#username');
            $password           = $('#password');
            $domain             = $('#website');
            $languageSelector   = $('#language');
            $forgotPassword     = $('#recover-password');

            $form               = $('#login-form');

            $username.attr('placeholder', loginMessages.username);
            $password.attr('placeholder', loginMessages.password);
            $domain.attr('placeholder', loginMessages.domain);
            $forgotPassword.text(loginMessages.forgot);
            $($form).find('input[type="submit"]').val(loginMessages.submit);

            require(['utils/SelectParser'], function(selectParser){

                selectParser.init($languageSelector);
                selectParser.update(lang || 'en')


            });

            require(['libs/happy/happy'], function(happy){

                controller.initValidation($form);

            });

            $form.bind('submit', onLogin);
            $forgotPassword.bind('tap', controller.recoverPassword);
            $languageSelector.bind('change', controller.changeLanguage);

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
            hideLoader: hideLoader,
            invalidCredentials: invalidCredentials,
            goNext: doGoNext,
            getUsername: function(){return $username;}

        }

    }));