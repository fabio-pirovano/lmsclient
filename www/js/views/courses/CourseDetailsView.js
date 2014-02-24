;define('views/courses/CourseDetailsView', ['appframework', 'mustache', 'i18n!nls/courses', 'core/Constants'], (function($, mustache, courses, Constants){

    var detailsTemplate, controller, currentCurseWindow;
    var $courseDetails, $courseInfo, $courseItems;

    var doInit = function(data){

        var token = data.token;
        var key = data.key;

        var view = this;

        require(['controllers/CourseDetails'], function(module){

            controller = module;
            module.init(token, key, view);

        });

        $courseDetails  = $('#course-details');
        $courseInfo     = $('#course-info');
        $courseItems    = $('#course-items');

        $.ui.setTitle(localStorage.getItem('currentCourseName'));

        var $thumb  = $courseInfo.find('img').attr('src', ''),
            $course = $courseInfo.find('span').text('');

        require([
            'text!../tpl/course-details-tpl.html'
        ], function(tpl){

            $thumb.attr('src', localStorage.getItem('currentCourseThumb'));
            $course.text(localStorage.getItem('currentCourseName'));

            detailsTemplate = tpl;
            renderCourseDetails(data.objects);

        });

    };

    var renderCourseDetails = function(data){

        console.log('renderCourseDetails ', data);

        var html;

        data.forEach(function (val){

            html = mustache.to_html(detailsTemplate, val);
            $courseItems.html($courseItems.html() + html);

            console.log(val);

        });

        initInteraction();

    };

    var onItemSelection = function(evt){

        evt.preventDefault();

        var $selectedItem = $(this);

        var isFolder     = $selectedItem.attr('data-folder') == 'true',
            courseId     = $selectedItem.attr('data-course'),
            organization = $selectedItem.attr('data-organization');

        if(isFolder){

            controller.getFolderDetails(courseId, organization);

        }else{

            controller.openLearningObject(organization);

        }

        console.log(isFolder, courseId, organization);

    };

    var initInteraction = function(){

        $courseItems.find('li').bind('tap', onItemSelection);

    };

    var doDispose = function(){

        $courseItems.find('li').unbind('tap', onItemSelection);

    };

    var doShowError = function(msg){

        if(msg){

            $.ui.popup(msg);

        }

    };

    var doShowLoader = function(status, message){

        if(status){

            $.ui.showMask(message || courses.loading);

        }else{

            $.ui.hideMask();

        }

    };

    var getCurrentData = function(){

        return $courseItems.html();

    };

    var refreshData = function(data){

        $courseItems.html('');
        renderCourseDetails(data);

    };

    var openURL = function(url){

        currentCurseWindow = window.open(url, '_blank', 'location=no');
        currentCurseWindow.addEventListener('exit', function() { alert(event.url); });

    };

    return{

        init: doInit,
        dispose: doDispose,
        showError: doShowError,
        showLoader: doShowLoader,
        currentData: getCurrentData,
        refreshData: refreshData,
        openURL: openURL

    };

}));