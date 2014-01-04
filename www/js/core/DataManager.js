;define('core/DataManager', [], (function(){

    var that = this;
    var events = {USER_LOGGED_IN: 'onUserLoggedIn', COURSE_OPENED: 'onCourseOpened', PUSH_NOTIFICATION_STATUS: 'onPushNotificationStatus'};
    var user, currentCourse, pushNotification;

    var onUserLoggedIn = function(evt) {

        user = evt.detail.user;

    };

    var onCourseOpened = function(evt) {

        currentCourse = evt.detail.course;

    };

    var onPushNotificationStatus = function(evt) {

        pushNotification = evt.detail.usePushNotification;

    };

    var init = function(){

        that.addEventListener(events.USER_LOGGED_IN, onUserLoggedIn);
        that.addEventListener(events.USER_LOGGED_IN, onCourseOpened);
        that.addEventListener(events.USER_LOGGED_IN, onPushNotificationStatus);

    };

    var dispose = function(){

        that.removeEventListener(events.USER_LOGGED_IN, onUserLoggedIn);
        that.removeEventListener(events.USER_LOGGED_IN, onCourseOpened);
        that.removeEventListener(events.USER_LOGGED_IN, onPushNotificationStatus);

    };

    return{

        getUser: function(){return user;},
        getCourse: function(){return currentCourse;},
        getPushNotifications: function(){return pushNotification;},
        dispose: dispose,
        init: init,
        events: events

    }

}));