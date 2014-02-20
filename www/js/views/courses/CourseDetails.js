;define('views/courses/CourseDetails', ['appframework', 'mustache'], (function($, mustache){

    var detailsTemplate;
    var $courseItems;

    var doInit = function(data){

        $courseItems = $('#course-items');

        require([
            'text!../tpl/course-details-tpl.html'
        ], function(tpl){

            detailsTemplate = tpl;
            renderCourseDetails(data);

        });

    };

    var renderCourseDetails = function(data){

        var html;

        data.items.forEach(function (val){

            val.course_id = data.course_id;
            val.course_id = data.course_id;

            html = mustache.to_html(detailsTemplate, val);
            $courseItems.html($courseItems.html() + html);

            console.log(val);

        });

    };

    return{

        init: doInit

    };

}));