;define('model/CourseItem', [], function(){

    function CourseItem(id, organization, locked, title, type){

        this.courseId       = id;
        this.organization   = organization;
        this.isLocked       = locked;
        this.title          = title;
        this.courseType     = type;
        this.isFolder       = type === 'folder';

    }

    return CourseItem;

});
