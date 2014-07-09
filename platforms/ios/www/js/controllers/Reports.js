;define('controllers/Reports', ['model/DataProvider', 'core/DataManager', 'views/reports/ReportsView', 'i18n!nls/miscellaneous', 'utils/ConfigurationManager'],
                               (function(dataProvider, dataManager, view, miscellaneous, config){

    var totalCSS, totalJS,
        currentCSS, currentJS,
        currentHTML, currentURL
        that = this;

    var loadData = function(){

        currentCSS = currentJS = 0;

        that.addEventListener(config.events.CONFIGURATION_VALUE_FOUND, function(evt){

            evt.target.removeEventListener(evt.type, arguments.callee);

            currentURL = evt.detail.value + '/';

            var user = dataManager.getUser();
            var params = JSON.stringify({'id_user': user.id , 'token': user.token, 'key': user.getUsername});

            dataProvider.fetchData('report/user', params, onReportsData, onReportsError);

            console.log(currentURL)

        });

        config.configurationItem('defaulturl');

    };

    var parseFile = function (file) {

        if (file.indexOf('http') < 0) {

            file = currentURL + file;

        }

        return file;

    };

    var onReportsData = function( data ) {

        if(data.success === true){

            totalCSS    = data.css.length;
            totalJS     = data.js.length;

            currentHTML = data.html;

            var file;

            for (var i = 0; i < totalCSS; i++){

                file = parseFile(encodeURI(data.css[i]));

                require(['css!' + file], function(css){

                    totalCSS++;
                    isInjectionReady();

                });

            }

            for (i = 0; i < totalJS; i++){

                file = parseFile(data.js[i]);

                require(['css!' + file], function(js){

                    totalJS++;
                    isInjectionReady();

                });

            }

        }else{

            view.showError(miscellaneous.genericError);

        }

    };

    var isInjectionReady = function(){

        if(currentCSS === totalCSS && currentJS === totalJS){

            view.populate(currentHTML);

        }

    };

    var onReportsError = function(xhr, error){

        view.showError(error.message);

    };

    return{

        loadData: loadData

    };

}));