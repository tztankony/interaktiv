(function($) {
    'use strict';
    /**Overriding the API.*/
    $.extend(window.TZ.API, {
        /**Finds the given Answers.*/
        getGivenAnswers: function(probId) {},
        /**Shows the results panel.*/
        showResults: function (e) {},
        /**Try the problem again.*/
        retryProblem: function (e) {},
        /**
         * Flashes all the correct answers.
         * @param e
         */
        showCorrectAnswer: function (e) {}
    });
}(jQuery));