;define('controllers/Courses', ['appframework', 'core/Constants'], (function($, Constants){

    var view;
    var FAKE_DATA = {"0":{"course_info":{"course_id":"16","course_name":"Articulate presenter testing Scorm 1.2 - Scorm 2004","course_description":"<p>Articulate Presenter '13<\/p>","can_enter":{"can":true,"reason":"course_status","expiring_in":false},"course_link":"http:\/\/release61.docebo.info\/doceboLms\/index.php?modname=course&amp;op=aula&amp;idCourse=16","course_thumbnail":"http:\/\/release61.docebo.info\/templates\/standard\/\/images\/course\/course_nologo.png","courseuser_status":"1"}},"1":{"course_info":{"course_id":"13","course_name":"Articulate storyline testing Scorm 1.2 - Scorm 2004","course_description":"<p>Storyline<\/p>","can_enter":{"can":true,"reason":"course_status","expiring_in":false},"course_link":"http:\/\/release61.docebo.info\/doceboLms\/index.php?modname=course&amp;op=aula&amp;idCourse=13","course_thumbnail":"http:\/\/release61.docebo.info\/templates\/standard\/\/images\/course\/course_nologo.png","courseuser_status":"1"}},"success":true};

    var doInit = function(v){

      view = v;

    };

    var doGetUserCourses = function(user){

        $.ajax({

            url: Constants.API_URL,
            type: 'post',
            data: JSON.stringify({'details': {'action': 'userCourses', 'userid': user.id , 'token': user.token }}),
            success: function( data ) {

                if(data.success){

                    console.log( "Sample of data:", data);

                }else{

                    // TODO uncomment for the production
                    // view.showError(data.message);

                    console.log(JSON.parse(FAKE_DATA));
                    view.showCourses(JSON.parse(FAKE_DATA))

                }

            },
            error: function(xhr, error){

                view.showError(error.message);

            }
        });


    };

    var doSearchCourses = function(str){



    };


    return {

        init: doInit,
        getUserCourses: doGetUserCourses,
        searchCourses: doSearchCourses

    };

}));