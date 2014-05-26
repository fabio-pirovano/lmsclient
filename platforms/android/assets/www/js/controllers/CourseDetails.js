;define('controllers/CourseDetails', ['appframework', 'core/Constants', 'model/CourseItem', 'model/DataProvider', 'i18n!nls/courses'], (function ($, Constants, CourseItem, dataProvider, courses) {

    var token, key, view, detailsStack, currentCourseId;

    var init = function (currentToken, userKey, v) {

        token = currentToken;
        key = userKey;
        view = v;

        detailsStack = [];

    };

    var manageStack = function (data, push) {

        if (push) {

            detailsStack.push(data);
            $.ui.pushHistory('course-details', 'course-details?stack=', 'up', detailsStack.length);

        } else {

            detailsStack.pop();

        }

        if(detailsStack.length > 0){

            $(window).bind('hashchange', onDetailsStatusChange);

        }else{

            $(window).unbind('hashchange', onDetailsStatusChange);

        }

    };

    var onCourseFolderDetails = function (data) {

        var currentData = JSON.parse(data);

        if (currentData.success === true) {

            manageStack(view.currentData(), true);

            var results = [];

            // console.log('course details', currentData);

            for (var i = 0, tot = currentData.objects.length; i < tot; i++) {

                var item = new CourseItem(currentCourseId, currentData.objects[i].id_scormitem, currentData.objects[i].locked, currentData.objects[i].title, currentData.objects[i].type);
                results.push(item);

            }

            view.showLoader(false);
            view.refreshData(results);

        } else {

            view.showError(data.message);

        }

    };

    var onCourseFolderDetailsError = function (xhr, error) {

        view.showError(error.message);

    };

    var getFolderDetails = function (courseID, organizationID) {

        currentCourseId = courseID;

        // console.log('getFolderDetails', currentCourseId, organizationID, this, this.view, this.token, this.key);
        view.showLoader(true);

        var params =  JSON.stringify({'details': {'action': 'courseFolderDetails', 'idCourse': courseID, 'idOrg': organizationID, 'token': token, 'key': key}});
        dataProvider.fetchData(params, onCourseFolderDetails, onCourseFolderDetailsError);

    };

    var onDetailsStatusChange = function(evt){

        if(window.location.hash == '#' + Constants.COURSES_DETAILS_VIEW){

            view.restoreHTML(detailsStack[0]);
            view.restoreBackButton();

            manageStack(null, false);

        }

        if(detailsStack.length == 0){

            $(window).unbind('hashchange', onDetailsStatusChange);

        }

    };

    var onLearningObject = function (data) {

        var currentData = JSON.parse(data);

        if (currentData.success === true) {

            view.showLoader(false);
            view.openURL(currentData.launch_url);

        } else {

            view.showError(data.message);

        }

    };

    var onLearningObjectError = function (xhr, error) {

        view.showError(error.message);

    };

    var openLearningObject = function (id) {

        view.showLoader(true, courses.loadingCourseItem);

        var params = JSON.stringify({'details': {'action': 'playLearningObject', 'idOrg': id, 'token': token, 'key': key}});
        dataProvider.fetchData(params, onLearningObject, onLearningObjectError);

    };

    return {

        openLearningObject: openLearningObject,
        getFolderDetails: getFolderDetails,
        init: init

    };

}))
;