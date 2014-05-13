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

        window.requestFileSystem(LocalFileSystem.TEMPORARY, (1024 * 1024 * 10), function(fs){

            fileSystem = fs;
            filePath = fileSystem.root.toURL();
            console.log('fileSystem', fileSystem)
            console.log('fileSystem.root', fileSystem.root.toURL());

        }, null);

    };

    var loadLogo = function(url){

        var fileTransfer = new FileTransfer(),
            uri = encodeURI(url),
            fileName = getFilename(url),
            event;

        console.log('URI', uri);
        console.log('========', fileName);
        console.log('filePath', filePath);

        fileTransfer.onprogress = function(progressEvent) {

            if (progressEvent.lengthComputable) {

                console.log(progressEvent.loaded)

            }

        };

        fileTransfer.download(
            uri,
            filePath + '/' + fileName,
            function(entry) {

                console.log("download complete ******: " + entry.toURL());

                event = new CustomEvent(events.LOGO_DOWNLOADED, {detail: {logoPath: entry.toURL()}});
                that.dispatchEvent(event);

                readLogoData(fileName, true);

            },
            function(error) {

                event = new CustomEvent(events.LOGO_DOWNLOAD_ERROR, {detail: {error: error.code, source: error.source}});
                that.dispatchEvent(event);

                console.log('download error source ' +  error.source);
                console.log('download error target ' +  error.target);
                console.log('download error code '   +  error.code);

            },
            false,
            {
                headers: {
                    'Authorization': 'Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=='
                }
            }
        );

    };

    var readLogoData = function(path, destroy){

        fileSystem.root.getFile(path, {create: false, exclusive: false},
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

                                    }, fileEntryFailure);

                                },
                                fileReadingFailure);

    };

    var fileEntryFailure = function(error){

        console.log('error with the fileEntry, code: ' +  error.code);

        var event = new CustomEvent(events.FILE_ERROR, {detail: {error: error.code}});
        that.dispatchEvent(event);

    };

    var fileReadingFailure = function(error){

        console.log('error reading file, code: ' +  error.code);

        var event = new CustomEvent(events.FILE_ERROR, {detail: {error: error.code}});
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