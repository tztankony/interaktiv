(function($) {
    'use strict';
    /**Overriding the API.*/
    $.extend(window.TZ.API, {
        /**Finds the given Answers.*/
        getGivenAnswers: function() {
            var probId = $('body').attr('data-problemid'), results = [];
            $('[data-problemid="' + probId + '"] :checked').each(function(){
                results.push(this.id.replace(/\D/g,''));
            });
            return results.join(',');
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
        retryProblem: function (e) {
            $('[data-problemid="' + $(e.currentTarget).data('pid') + '"] :checked').removeAttr('checked');
            $('body').removeClass('answered ok fail');
            $('label.flash').removeClass('flash');
        },
        /**
         * Flashes all the correct answers.
         * @param e
         */
        showCorrectAnswer: function () {
            $.each(window.atob($('#btnShowResults').data('bear')).split(','), function(){
                $('#v' + this + '+label').toggleClass('flash');
            });
        }
    });
}(jQuery));