;define('views/courses/CoursesView', [], (function(){

    var doInit = function(data){

      console.log(data);

      var user = data.getUser();


        $.ajax({

            url: Constants.API_URL,
            type: 'post',
            data: JSON.stringify({'details': {'action': 'userCourses', 'userid': user.id , 'token': user.token }}),
            success: function( data ) {

                console.log( "Sample of data:", data);

            },
            error: function(xhr, error){

                console.log(arguments);

            }
        });

    };


    return{

        init: doInit

    }

}));