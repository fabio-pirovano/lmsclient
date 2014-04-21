;define('controllers/UserProfile', ['appframework', 'core/Constants'], (function($, Constants){

    var $profileData = $('#main-nav > div');

    var recoverProfileData = function(id, data){

        $.ajax({

            url: Constants.API_URL,
            type: 'post',
            data: JSON.stringify({'details': {'action': 'userprofile', 'userid': id , 'token': data.token, 'key': data.key}}),
            success: function( data ) {

                console.log( "Sample of data:", data);
                var currentData = JSON.parse(data);

                $profileData.html(currentData.firstname + ' ' + currentData.lastname + '<br>' + currentData.email);

            },

            error: function(xhr, error){

                $.ui.popup(error.message);

            }
        });

    };

    return{

        fetch: recoverProfileData

    }

}));