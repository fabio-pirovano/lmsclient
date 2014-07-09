;define('views/reports/ReportsView', ['appframework', 'controllers/Reports', 'i18n!nls/miscellaneous'], (function($, reports, miscellaneous){

    var $content;

    var init = function(){

        if(!$content)$content = $('#reports');

        $content.html('');

        showLoader(true);
        reports.loadData();

    };

    var populate = function(value){

        $content.html(value);

    };

    var showLoader = function(status){

        if(status){

            $.ui.showMask(miscellaneous.loadingData);

        }else{

            $.ui.hideMask();

        }

    };

    var showError = function(message){

        showLoader(false);
        $.ui.popup(message);

    };

    return{

        init: init,
        populate: populate,
        showError: showError

    }


}));