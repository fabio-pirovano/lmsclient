;define('utils/LogoLoader', ['base64'], (function(base64){

    var events = {
                  LOGO_DOWNLOADED: 'logoDownloaded',
                  LOGO_DOWNLOAD_ERROR: 'logoDownloadError',
                  LOGO_READY_TO_USE: 'logoReadyToUse',
                  LOGO_DATA_READY: 'logoDataReady',
                  LOGO_DATA_ERROR: 'logoDataError',
                  FILE_ERROR: 'fileAccessError'
                 };

    var fileSystem, filePath, logoData;
    var that = this;

    var init = function(){

        // console.log('utils/LogoLoader => init', this, that);

        // return;

        window.requestFileSystem(LocalFileSystem.TEMPORARY, 0, function(fs){

            fileSystem = fs;
            filePath = fileSystem.root.fullPath;
            console.log('fileSystem', fileSystem)
            console.log('fileSystem.root', fileSystem.root)

        }, null);

    };

    var loadLogo = function(url){

        // console.log('utils/LogoLoader => loadLogo', this, that);

        var uri = encodeURI(url);

        console.log('URI', uri);
        console.log('========');
        console.log('filePath', filePath);

        var fileTransfer = new FileTransfer();
        var uri = encodeURI(url);

        fileTransfer.onprogress = function(progressEvent) {

            if (progressEvent.lengthComputable) {

                console.log(progressEvent.loaded)

            }

        };

        fileTransfer.download(
            uri,
            filePath + '/' + getFilename(url),
            function(entry) {

                console.log("download complete ******************************: " + entry.fullPath, this);

                var event = new CustomEvent(events.LOGO_DOWNLOADED, {detail: {logoPath: entry.fullPath}});
                that.dispatchEvent(event);

                readLogoData(entry.fullPath, true);

            },
            function(error) {

                console.log("download error source " +  error.source);
                console.log("download error target " +  error.target);
                console.log("download error code"    +  error.code);

                var event = new CustomEvent(events.LOGO_DOWNLOAD_ERROR, {detail: {error: error.code, source: error.source}});
                that.dispatchEvent(event);

            },
            false,
            {
                headers: {
                    "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
                }
            }
        );


    };

    var readLogoData = function(path, destroy){

        fileSystem.root.getFile(path, {create: false, exclusive: true},
                                function (fileEntry) {

                                    fileEntry.file(function (file) {

                                        var reader = new FileReader();

                                        reader.onloadend = function(evt) {

                                            console.log("Read as data URL", this, that);
                                            // console.log(evt.target.result);

                                            logoData = evt.target.result;

                                            var event = new CustomEvent(events.LOGO_DATA_READY, {detail: {logoData: logoData}});
                                            that.dispatchEvent(event);

                                            if(destroy === true){

                                                fileEntry.remove();

                                            }

                                        };

                                        reader.onerror = function(error){

                                            console.log('file reader error', error.code);

                                            var event = new CustomEvent(events.LOGO_DATA_ERROR, {detail: {error: error.code}});
                                            that.dispatchEvent(event);

                                        };

                                        reader.readAsDataURL(file);

                                    }, fileReadingFailure);

                                },
                                fileReadingFailure);

    };

    var fileReadingFailure = function(error){

        console.log("download error source " +  error.source);
        console.log("download error target " +  error.target);
        console.log("download error code"    +  error.code);

        var event = new CustomEvent(events.FILE_ERROR, {detail: {error: error.code, source: error.source}});
        that.dispatchEvent(event);

    };

    var getFilename = function (url){

        if (url){

            var m = (url.match(/[^\\/]+\.[^\\/]+$/) || []).pop();

            if (m && m.length > 1){

                return m;

            }
        }

        return '';

    };

    var getLogoData = function(){

         return logoData;

    };

    return{

        init: init,
        load: loadLogo,
        getLogo: getLogoData,
        events: events

    }

}));