;define('routers/approuter', ['core/Constants', 'appframework'], (function(Constants, $){

    var that = this;

    var onChangeView = function(evt){

        var view = evt.detail.view;

        if(evt.detail.data){

            // TODO handle custom views such as the reports and the SCO

        }else{

            $('#' + view).bind('loadpanel', function(e){

               require([evt.detail.module], function(module){

                   module.init();

               });

                $(view).unbind('loadpanel', arguments.callee);

            });

            $.ui.loadContent(view, false, false, Constants.PANELS_DIRECTION);

        }

    };

    var doDispose = function(){

        that.removeEventListener(Constants.CHANGE_VIEW_EVENT, onChangeView);

    };

    var doInit = function(){

        that.addEventListener(Constants.CHANGE_VIEW_EVENT, onChangeView);

    };

    return {

        init: doInit,
        dispose: doDispose

    }

}));