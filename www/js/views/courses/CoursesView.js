;define('views/courses/CoursesView', ['appframeworkui', 'controllers/Courses'], (function($ui, courses){

    var doInit = function(data){

        var user = data.getUser();

        courses.init(this);

        // TODO make it multi language
        $ui.showMask('Loading...');
        courses.getUserCourses(user);

    };

    var doShowError = function(msg){

        $ui.popup(msg);

    };

    var doShowCourses = function(data){

        for(var course in data){

            console.log(course);


        }

    };

    var doClearCourses = function(){



    };

    return{

        init: doInit,
        showError: doShowError,
        showCourses: doShowCourses,
        clearCourses: doClearCourses

    }

}));