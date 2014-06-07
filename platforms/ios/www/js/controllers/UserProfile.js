;define('controllers/UserProfile', ['appframework', 'model/DataProvider'], (function($, dataProvider){

    var $profileData = $('#main-nav > div');

    var onProfileData = function( data ) {

        var currentData = JSON.parse(data);

        $profileData.html(currentData.firstname + ' ' + currentData.lastname + '<br>' + currentData.email);

    };

    var onProfileDataError = function(xhr, error){

        $.ui.popup(error.message);

    };

    var recoverProfileData = function(id, data){

        var paramsForProxy = JSON.stringify({'details': {'action': 'userprofile', 'userid': id , 'token': data.token, 'key': data.key}}),
            params = JSON.stringify({'id_user': id , 'token': data.token, 'key': data.key});

        dataProvider.fetchData('user/profile', params, onProfileData, onProfileDataError);

    };

    return{

        fetch: recoverProfileData

    }

}));