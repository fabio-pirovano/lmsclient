;define('views/login/LoginView', ['appframework', 'controllers/Login', 'i18n!nls/login', 'core/Constants'],
    (function($, controller, loginMessages, Constants){

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

                $.ui.loadContent(panel, false, false, Constants.PANELS_DIRECTION);

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
            if(!$.ui.isSideMenuEnabled()){

                $.ui.enableSideMenu();

                if($('#menu').hasClass('tabletMenu')){

                    $.ui.toggleSideMenu(true);

                }

            }

            $('#menubadge').css('visibility', 'visible');

        };

        var invalidCredentials = function(msg){

            return document.getElementById($.ui.popup(msg).id);

        };

        var init = function(lang){

            controller.init(this);

            $('#main').attr('title', loginMessages.welcome);

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
            $($form).find('#do-login').text(loginMessages.submit);

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

            require(['core/BackButtonManager'], (function(backManager){

                backManager.init($('#courses'), [$('#reports'), $('#settings'), $('#logout'), $('#forgot-pwd')]);

            }));

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
            getUsername: function(){return $username;},
            getDomain: function(){return $domain.val();}

        }

    }));