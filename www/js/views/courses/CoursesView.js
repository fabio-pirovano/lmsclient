;define('views/courses/CoursesView', ['appframework', 'mustache', 'controllers/Courses', 'i18n!nls/courses', 'routers/coursesrouter'], (function($, mustache, controller, courses, router){

    var ALTERNATE_COLORS_CLASSES = ['even', 'odd'];
    var courseTemplate, currentSeatch;
    var $coursesSearch, $courses;

    var doInit = function(data){

        router.init();

        $coursesSearch = $('#user-courses-search');
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

    var doShowCourse = function(data, index){

        data.rowColorKind = ALTERNATE_COLORS_CLASSES[index];

        console.log(ALTERNATE_COLORS_CLASSES, index)

        var html = mustache.to_html(courseTemplate, data);
        $courses.html($courses.html() + html);

    };

    var doClearCourses = function(){

        $courses.html('');

    };

    var onCourseSearch = function(evt){

        var filter = this.value,
            filterLenght = filter.length;

        if(currentSeatch){

            clearTimeout(currentSeatch);

        }

        currentSeatch = setTimeout(function(){

            $courses.find('li').each(function(i, e){

                var sel = $(e).find('div strong').text().toLowerCase().trim();
                var query = filter.toLowerCase();

                if(sel.indexOf(query) === -1){

                    $(e).hide();

                } else {

                    $(e).show();

                }

            });

        }, 300);

    };

    var doInitCoursesInteraction = function(status){

        if(status){

            $courses.find('li').bind('tap', onCourseSelection);
            $coursesSearch.bind('input', onCourseSearch);


        }else{

            $courses.find('li').unbind('tap', onCourseSelection);
            $coursesSearch.unbind('input', onCourseSearch);

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

        var target = $(this);

        var url         = target.attr('data-url'),
            idCourse    = url.match(/idCourse=([^&]*)/)[1],
            thumb        = target.find('img').attr('src'),
            name       = target.find('strong').text();

        localStorage.setItem('currentCourseName', name);
        localStorage.setItem('currentCourseThumb', thumb);

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