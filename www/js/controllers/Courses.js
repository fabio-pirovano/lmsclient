;define('controllers/Courses', ['appframework', 'core/Constants', 'model/Course', 'model/DetailsFactory', 'i18n!nls/courses'], (function($, Constants, Course, DetailsFactory, courses){

    var that = this;
    var view;
    var token, key, courseList;
    var courseLoaded;
    var LOCALIZED_STATUSES = [courses.notStarted, courses.inProgress, courses.completed];

    var doInit = function(v){

      view = v;

    };

    var doGetUserCourses = function(user){

        token = user.token;
        key = user.getUsername;

        if(courseLoaded)return;

        $.ajax({

            url: Constants.API_URL,
            type: 'post',
            data: JSON.stringify({'details': {'action': 'userCourses', 'userid': user.id , 'token': token , 'key': key}}),
            success: function( data ) {

                var currentData = JSON.parse(data);

                if(currentData.success === true){

                    view.showLoader(true);
                    prepareCoursesData(currentData);
                    courseLoaded = true;

                }else{

                    showError(data.message);

                }

            },
            error: function(xhr, error){

                view.showError(error.message);

            }
        });

    };

    var showError = function (message) {

        view.showLoader(false);
        view.showError(message);

    };

    var doGetCourseDetails = function(id){

        view.showLoader(true, courses.loadingCourse);

        $.ajax({

            url: Constants.API_URL,
            type: 'post',
            data: JSON.stringify({'details': {'action': 'courseDetails', 'idCourse': id , 'token': token , 'key': key}}),
            success: function( data ) {

                var currentData = JSON.parse(data);

                if(currentData.success === true){

                    console.log(currentData.objects);
                    var event = new CustomEvent(Constants.DETAIL_VIEW_EVENT, {detail: {view: Constants.COURSES_DETAILS_VIEW, module: Constants.COURSES_DETAILS_MODULE,
                                                                              data: {token: token, key: key, objects: DetailsFactory.create(id, currentData.objects)}, push: true}});
                    that.dispatchEvent(event);

                    view.showLoader(false);

                }else{

                    showError(data.message);

                }

            },
            error: function(xhr, error){

                showError(error.message);

            }
        });

    };

    var prepareCoursesData = function(data){

        var tmp = [];

        $.each(data, function(index, val){

            try{

                var course = new Course(val.course_info);
                course.status = LOCALIZED_STATUSES[course.status];

                tmp[index] = course;

            }catch(error){

                console.log('Object malformed');

            }

        });

        console.log(tmp);
        courseList = tmp;
        renderData(courseList);

    };

    var renderData = function(data){

        setTimeout(function(){

            var course = data.shift();

            view.showCourse(course);

            if(data.length > 0){

                setTimeout(arguments.callee, 50);

            }else{

                view.showLoader(false);
                view.initCoursesInteraction(true);

            }

        }, 50);

    };

    var doSearchCourses = function(str){

        // TODO implement server side research in the next version

    };


    return {

        init: doInit,
        getUserCourses: doGetUserCourses,
        searchCourses: doSearchCourses,
        getCourseDetails: doGetCourseDetails

    };

}));