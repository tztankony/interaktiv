(function ($) {
    'use strict';

    var resizeTimer = 0, resizeStarted = false;
    /**Common API*/
    window.TZ = {
        answers: {
            "ok": [
                "Helyesen válaszoltál!",
                "Helyes!",
                "Válaszod helyes!"
            ],
            "fail": [
                "Helytelenül válaszoltál!",
                "Helytelen!",
                "Válaszod hibás!"
            ]
        },
        sound: {play: $.noop, stop: $.noop},
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
            },
			playSound: function (soundId) {
				//TZ.sound[soundId].pause();
				TZ.sound[soundId].play();
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
			.on('click.tz', '.answered .clickable', TZ.API.stopAnswer.bind(window.TZ))		
            .on('click.tz', '#btnExit', TZ.API.followUrl.bind(window.TZ))
            .on('click.tz', '#btnShowResults', TZ.API.showResults.bind(window.TZ))
            .on('click.tz', '#btnRetry', TZ.API.retryProblem.bind(window.TZ))
            .on('click.tz', '#btnShowCorrectAnswer', TZ.API.showCorrectAnswer.bind(window.TZ));

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
		window.TZ.sound = {"ok": $('#sndOk')[0], "fail": $('#sndFail')[0]}
        $(window).trigger('resizeEnded');
    });
}(jQuery));