;define('model/CourseItem', [], function(){

    function CourseItem(id, organization, locked, title, type, folder){

        this.courseId       = id;
        this.organization   = organization;
        this.isLocked       = locked;
        this.title          = title;
        this.courseType     = type;
        this.isFolder       = folder;

    }

    return CourseItem;

});
