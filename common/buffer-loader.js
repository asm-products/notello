
var BufferLoader = function (context, urlList, callback) {
    'use strict';

    this.context = context;
    this.urlList = urlList;
    this.onload = callback;
    this.bufferList = [];
    this.loadCount = 0;
};

BufferLoader.prototype.loadBuffer = function (url, index) {
    'use strict';

    // Load buffer asynchronously
    var request = new XMLHttpRequest(),
        loader = this;

    request.open('GET', url, true);
    request.responseType = 'arraybuffer';

    request.onload = function () {
        // Asynchronously decode the audio file data in request.response
        loader.context.decodeAudioData(
            request.response,
            function (buffer) {
                if (buffer) {

                    loader.bufferList[index] = buffer;
                    loader.loadCount += 1;
                    if (loader.loadCount === loader.urlList.length) {

                        loader.onload(loader.bufferList);
                    }
                }
            },
            function (error) {
                // TODO: handle error
            }
        );
    };

    request.onerror = function () {
        // TODO: handle request error
    };

    request.send();
};

BufferLoader.prototype.load = function () {
    'use strict';

    var i,
        max;

    for (i = 0, max = this.urlList.length; i < max; i += 1) {
        this.loadBuffer(this.urlList[i], i);
    }
};

module.exports = BufferLoader;
