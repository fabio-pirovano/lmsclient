;define('views/courses/CourseDetailsView', ['appframework', 'mustache'], (function($, mustache){

    var detailsTemplate;
    var $courseDetails, $courseInfo, $courseItems;

    var doInit = function(data){

        $courseDetails  = $('#course-details');
        $courseInfo     = $('#course-info');
        $courseItems    = $('#course-items');

        $courseDetails.attr('title', localStorage.getItem('currentCourseName'));

        var $thumb  = $courseInfo.find('img').attr('src', ''),
            $course = $courseInfo.find('span').text('');

        require([
            'text!../tpl/course-details-tpl.html'
        ], function(tpl){

            $thumb.attr('src', localStorage.getItem('currentCourseThumb'));
            $course.text(localStorage.getItem('currentCourseName'));

            detailsTemplate = tpl;
            renderCourseDetails(data);

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

        var $item = $(this);

        var isFolder     = $item.attr('data-folder') == 'true',
            courseId     = $item.attr('data-course'),
            organization = $item.attr('data-organization');

        if(isFolder){


        }else{



        }

        console.log(isFolder, courseId, organization);

    };

    var initInteraction = function(){

        $courseItems.find('li').bind('tap', onItemSelection);

    };

    var doDispose = function(){

        $courseItems.find('li').unbind('tap', onItemSelection);

    };

    return{

        init: doInit,
        dispose: doDispose

    };

}));