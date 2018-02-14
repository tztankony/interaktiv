(function($) {
    'use strict';
    /**Overriding the API.*/
    $.extend(window.TZ.API, {
        /**Finds the given Answers.*/
        getGivenAnswers: function(probId) {

        },
        /**Shows the results panel.*/
        showResults: function (e) {
            var correctAnswers = window.atob($(e.currentTarget).data('bear')),
                givenAnswers = this.API.getGivenAnswers(),
                isCorrect = (correctAnswers === givenAnswers),
                answerStatus = isCorrect ? 'ok' : 'fail';

            $('body').removeClass('answered ok fail').addClass('answered ' + answerStatus);
            $("#bear").find(".answer." + answerStatus).html(TZ.answers[answerStatus].choose());
            TZ.sound.stop();
            TZ.sound.play(answerStatus);
        },
        /**Try the problem again.*/
        retryProblem: function (e) {},
        /**
         * Flashes all the correct answers.
         * @param e
         */
        showCorrectAnswer: function (e) {}
    });
    /****Sets up the Draggability on SVG elements****/

    /**Page specific on Load*/
    $(function() {
        $('.persons > .person').draggable();
        $('.dropfield > .centerzone').droppable();
    });
}(jQuery));