;define('controllers/CourseDetails', ['appframework', 'core/Constants', 'model/CourseItem'], (function ($, Constants, CourseItem) {

    var token, key, view, detailsStack;

    var init = function (currentToken, userKey, v) {

        token = currentToken;
        key = userKey;
        view = v;

        detailsStack = [];

    };

    var manageStack = function (data, push) {

        if (push) {

            detailsStack.push(data);

        } else {

            detailsStack.pop();

        }

    };

    var getFolderDetails = function (courseID, organizationID) {

        console.log('getFolderDetails', courseID, organizationID, this, this.view, this.token, this.key);
        view.showLoader(true);

        $.ajax({

            url: Constants.API_URL,
            type: 'post',
            data: JSON.stringify({'details': {'action': 'courseFolderDetails', 'idCourse': courseID, 'idOrg': organizationID, 'token': token, 'key': key}}),
            success: function (data) {

                var currentData = JSON.parse(data);

                if (currentData.success === true) {

                    manageStack(view.currentData(), true);

                    // TODO fix this smell, it's the same code of the DetailsFactory.js; the problem is that the factory loads asynchronously the CourseItem module and the result is an empty array
                    var results = [];

                    for (var i = 0, tot = currentData.objects.length; i < tot; i++) {

                        var item = new CourseItem(courseID, currentData.objects[i].id_scormitem, currentData.objects[i].locked, currentData.objects[i].title, currentData.objects[i].type);
                        results.push(item);

                    }

                    view.showLoader(false);
                    view.refreshData(results);

                } else {

                    view.showError(data.message);

                }

            },
            error: function (xhr, error) {

                view.showError(error.message);

            }
        });

    };

    var openLearningObject = function (id) {

        view.showLoader(true);

        $.ajax({

            url: Constants.API_URL,
            type: 'post',
            data: JSON.stringify({'details': {'action': 'playLearningObject', 'idOrg': id, 'token': token, 'key': key}}),
            success: function (data) {

                var currentData = JSON.parse(data);

                if (currentData.success === true) {

                    view.showLoader(false);
                    view.openURL(currentData.launch_url);

                } else {

                    view.showError(data.message);

                }

            },
            error: function (xhr, error) {

                view.showError(error.message);

            }
        });

    };

    return {

        openLearningObject: openLearningObject,
        getFolderDetails: getFolderDetails,
        init: init

    };

}))
;