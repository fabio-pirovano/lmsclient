;define('views/courses/CourseDetailsView', ['appframework', 'mustache', 'i18n!nls/courses'], (function($, mustache, courses){

    var ALTERNATE_COLORS_CLASSES = ['even', 'odd'];
    var detailsTemplate, controller, currentCourseWindow;
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

        $.ui.setTitle(localStorage.getItem('currentCourseName').substr(0, 12) + '...');

        var $thumb  = $courseInfo.find('img').attr('src', ''),
            $course = $courseInfo.find('span').html('');

        require([
            'text!../tpl/course-details-tpl.html'
        ], function(tpl){

            $thumb.attr('src', localStorage.getItem('currentCourseThumb'));
            $course.html('<strong>' + localStorage.getItem('currentCourseName') + '</strong><br>' + localStorage.getItem('currentCourseDescription'));

            detailsTemplate = tpl;
            renderCourseDetails(data.objects);

        });

    };

    var renderCourseDetails = function(data){

        console.log('renderCourseDetails ', data);

        var html;

        data.forEach(function (val, index){

            val.rowColorKind = ALTERNATE_COLORS_CLASSES[index % 2];

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

        $.ui.setBackButtonText(courses.goBack);
        renderCourseDetails(data);

    };

    var restoreHTML = function(html){

        $courseItems.html(html);

    };

    var restoreBackButton = function(){

        $.ui.setBackButtonText(courses.myCourses);

    };

    var openURL = function(url){

        currentCourseWindow = window.open(url, '_blank', 'location=no');
        currentCourseWindow.addEventListener('exit', function() { alert(event.url); });

    };

    return{

        init: doInit,
        dispose: doDispose,
        showError: doShowError,
        showLoader: doShowLoader,
        currentData: getCurrentData,
        restoreHTML: restoreHTML,
        restoreBackButton: restoreBackButton,
        refreshData: refreshData,
        openURL: openURL

    };

}));