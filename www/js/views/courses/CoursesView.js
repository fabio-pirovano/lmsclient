;define('views/courses/CoursesView', ['appframework', 'mustache', 'controllers/Courses', 'i18n!nls/courses', 'routers/courserouter'], (function($, mustache, controller, courses, router){

    var courseTemplate;
    var $courses;

    var doInit = function(data){

        router.init();

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

        $courses.html('');

    };

    var doInitCoursesInteraction = function(status){

      if(status){

          $courses.find('li').bind('tap', onCourseSelection);


      }else{

          $courses.find('li').unbind('tap', onCourseSelection);

      }

    };

    var doShowLoader = function(status, message){

        if(status){

            $.ui.showMask(message || courses.loading);

        }else{

            $.ui.hideMask();

        }

    };

    var onCourseSelection = function(evt){

        evt.preventDefault();

        var url = $(this).attr('data-url'),
            idCourse = url.match(/idCourse=([^&]*)/)[1];

        controller.getCourseDetails(idCourse);

    };

    return{

        init: doInit,
        showError: doShowError,
        showCourse: doShowCourse,
        clearCourses: doClearCourses,
        showLoader: doShowLoader,
        initCoursesInteraction: doInitCoursesInteraction

    }

}));