;define('views/courses/CoursesView', ['appframework', 'mustache', 'controllers/Courses', 'i18n!nls/courses'], (function($, mustache, controller, courses){

    var courseTemplate;
    var $courses;

    var doInit = function(data){

        $courses = $('#user-courses');

        var user = data.getUser();
        controller.init(this);

        require([
            'text!../tpl/course-tpl.html'
        ], function(tpl){

            courseTemplate = tpl;
            controller.getUserCourses(user);

        });

    };

    var doShowError = function(msg){

        console.log('doShowError', msg);

        if(msg){

            $.ui.popup(msg);

        }

    };

    var doShowCourse = function(data){

        var html = mustache.to_html(courseTemplate, data);
        $courses.html($courses.html() + html);

    };

    var doClearCourses = function(){



    };

    var doShowLoader = function(status){

        if(status){

            $.ui.showMask(courses.loading);

        }else{

            $.ui.hideMask();

        }

    };

    return{

        init: doInit,
        showError: doShowError,
        showCourse: doShowCourse,
        clearCourses: doClearCourses,
        showLoader: doShowLoader

    }

}));