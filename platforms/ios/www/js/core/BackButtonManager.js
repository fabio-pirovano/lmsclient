;define('core/BackButtonManager', ['appframework'], (function($){

    var isEnabled = false;
    var $backButtonDisabled, $backButtonEnabled;

     var enableBackButton = function(evt){

         if(!isEnabled)$.ui.setBackButtonVisibility(true);
         isEnabled = true;


     };

    var disableBackButton = function(evt){

        if(isEnabled)$.ui.setBackButtonVisibility(false);
         isEnabled = false;

    };

    var init = function(toDisable, toEnable){

        console.log('init bb manager', this);

        $backButtonDisabled = toDisable;
        $backButtonDisabled.bind('loadpanel', disableBackButton);
        $backButtonDisabled.bind('content-loaded', disableBackButton);

        $backButtonEnabled = toEnable;
        $.each($backButtonEnabled, function(index){

            $backButtonEnabled[index].bind('loadpanel', enableBackButton);
            $backButtonEnabled[index].bind('content-loaded', enableBackButton);

        });

    };

    var dispose = function(){

        $backButtonDisabled.unbind('loadpanel', disableBackButton);
        $backButtonDisabled.unbind('content-loaded', disableBackButton);

        $.each($backButtonEnabled, function(index){

            $backButtonEnabled[index].unbind('loadpanel', enableBackButton);
            $backButtonEnabled[index].unbind('content-loaded', enableBackButton);

        });

    };

    return{

        init: init,
        dispose: dispose

    }

}));