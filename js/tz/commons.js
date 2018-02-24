(function ($) {
    'use strict';

    var resizeTimer = 0, resizeStarted = false;
    /**Common API*/
    window.TZ = {
        answers: {"ok": ["Helyes!"], "fail": ["Helytelen!"]},
        sound: new Howl({
            src: ['audio/sounds.mp3', 'audio/sounds.ogg'],
            preload: true,
            sprite: {
                'ok': [0, 3500],
                'fail': [3750, 4326]
            }
        }),
        /**Common API with default implementations.*/
        API: {
            getGivenAnswers: function (problemId) {
                return true;
            },
            showResults: function (evt) {
                return true;
            },
            showCorrectAnswer: function (evt) {
                return true;
            },
            retryProblem: function (evt) {
                return true;
            },
            beforeResize: function(evt) {return true;},

            afterResize: function(evt) {return true;},
            /**
             * Follows the data-url specified on the HTML nlode originating the Event..
             * */
            followUrl: function (e) {
                location.href = $(e.currentTarget).data('url');
            },
            /**
             * Blocks (Prevents) the action bound to the element.
             * @returns {boolean}
             */
            stopAnswer: function () {
                return false;
            }
        }
    };

    Function.prototype.method = function (name, func) {
        if (!(name in this.prototype)) {
            this.prototype[name] = func;
        }
        return this;
    };
    /**Returns a randomly chosen element from an array.*/
    Array.method('choose', function () {
        return this[Number.random(0, this.length)];
    });

    Number.random = function (a, b) {
        return a + Math.round((b - a) * Math.random());
    };

    /**On Page Load.*/
    $(function () {
        $(document).off('.tz')
            .on('click.tz', '#btnExit', TZ.API.followUrl.bind(window.TZ))
            .on('click.tz', '#btnShowResults', TZ.API.showResults.bind(window.TZ))
            .on('click.tz', '#btnRetry', TZ.API.retryProblem.bind(window.TZ))
            .on('click.tz', '#btnShowCorrectAnswer', TZ.API.showCorrectAnswer.bind(window.TZ))
            .on('click.tz', '.answered .choice label', TZ.API.stopAnswer.bind(window.TZ));

        $(window).on('resize', function (e) {
            if (!resizeStarted) {
                resizeStarted = true;
                $(window).trigger('resizeStarted');
            }
            window.clearTimeout(resizeTimer);
            resizeTimer = window.setTimeout(function () {
                resizeStarted = false;
                $(window).trigger('resizeEnded');
            }, 200);
        });
        $(window).on('resizeStarted', window.TZ.API.beforeResize).on('resizeEnded', window.TZ.API.afterResize.bind(window.TZ));

        //Load all possible answers:
        $.getJSON('data/answers.json').success(function (answersFromFile) {
            window.TZ.answers = answersFromFile;
        });
        $(window).trigger('resizeEnded');
    });
}(jQuery));