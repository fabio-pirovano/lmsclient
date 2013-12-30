
require.config({

    paths: {
        appframework: 'libs/appframework/appframework',
        appframeworkui: 'libs/appframework/appframework.ui.min',
        text: 'libs/require/plugins/text',
        domReady: 'libs/require/plugins/domReady',
        i18n: 'libs/require/plugins/i18n',
        async: 'libs/require/plugins/async',
        happy: 'libs/happy/happy',
        happyValidators: 'libs/happy/happy.methods',
        base64: 'libs/base64/base64'
    },

    shim: {
        'appframework': {
            exports: '$'
        },
        'appframeworkui': {
            exports: '$.ui'
        }
    },

    waitSeconds: 10

});

require(['main'], function(main){

    main.init();

});
