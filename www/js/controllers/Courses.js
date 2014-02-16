;define('controllers/Courses', ['appframework', 'core/Constants', 'model/Course'], (function($, Constants, Course){

    var view;

    var doInit = function(v){

      view = v;

    };

    var doGetUserCourses = function(user){

        $.ajax({

            url: Constants.API_URL,
            type: 'post',
            data: JSON.stringify({'details': {'action': 'userCourses', 'userid': user.id , 'token': user.token , 'key': user.getUsername}}),
            success: function( data ) {

                var currentData = JSON.parse(data);

                if(currentData.success === true){

                    console.log( "Sample of data:", currentData);

                    view.showLoader(true);
                    prepareData(currentData);

                }else{

                    view.showError(data.message);

                }

            },
            error: function(xhr, error){

                view.showError(error.message);

            }
        });


    };

    var prepareData = function(data){

        var tmp = [];

        $.each(data, function(index, val){

            console.log(index, ' - ', val);

            for(var i in val.course_info){

                console.log(i, ' - ', val.course_info[i]);

            }

            try{

                var course = new Course(val.course_info);
                tmp[index] = course;

            }catch(error){

                console.log('Object malformed');

            }

        });

        console.log(tmp)
        renderData(tmp);

    };

    var renderData = function(data){

        setTimeout(function(){

            var course = data.shift();
            view.showCourse(course);

            if(data.length > 0){

                setTimeout(arguments.callee, 25);

            }else{

                view.showLoader(false);

            }

        }, 50);

    };

    var doSearchCourses = function(str){



    };


    return {

        init: doInit,
        getUserCourses: doGetUserCourses,
        searchCourses: doSearchCourses

    };

}));