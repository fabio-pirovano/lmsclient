;define('controllers/UserProfile', ['appframework', 'model/DataProvider'], (function($, dataProvider){

    var $profileData = $('#main-nav > div');

    var onProfileData = function( data ) {

        console.log( "Sample of data:", data);
        var currentData = JSON.parse(data);

        $profileData.html(currentData.firstname + ' ' + currentData.lastname + '<br>' + currentData.email);

    };

    var onProfileDataError = function(xhr, error){

        $.ui.popup(error.message);

    };

    var recoverProfileData = function(id, data){

        var params = JSON.stringify({'details': {'action': 'userprofile', 'userid': id , 'token': data.token, 'key': data.key}});
        dataProvider.fetchData(params, onProfileData, onProfileDataError);

    };

    return{

        fetch: recoverProfileData

    }

}));