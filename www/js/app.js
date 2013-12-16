
require.config({

    paths: {
        appframework: 'libs/appframework/appframework.min',
        text: 'libs/require/plugins/text',
        domReady: 'libs/require/plugins/domReady',
        i18n: 'libs/require/plugins/i18n',
        async: 'libs/require/plugins/async'
    },

    shim: {
        'appframework': {
            exports: '$'
        }
    },

    waitSeconds: 10

});

require(['main'], function(main){

    main.init();

});