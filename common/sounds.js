var BufferLoader = require('./buffer-loader');

var play = (function () {

    var context,
        bufferLoader,
        sounds = {},
        go = function (i) {

            return function () {

                var source = context.createBufferSource();
                source.connect(context.destination);
                source.buffer = i;
                source.start(0);
            };
        },
        finishedLoading = function (bufferList) {

            sounds.bongos = go(bufferList[0]);
            sounds.swoosh = go(bufferList[1]);
        },
        retVal = function (sound) {

            if (sounds[sound]) {
                sounds[sound]();
            }
        };

    // Fix up prefixing
    window.AudioContext = window.AudioContext || window.webkitAudioContext;

    if (window.AudioContext) {

        context = new AudioContext();

        bufferLoader = new BufferLoader(
            context,
            [
                'https://s3-us-west-2.amazonaws.com/static-omaj/bongos.mp3',
                'https://s3-us-west-2.amazonaws.com/static-omaj/swoosh.mp3'
            ],
            finishedLoading
        );

        bufferLoader.load();
    }

    return retVal;

}());

var sounds = {

    'play': play
};

module.exports = sounds;
