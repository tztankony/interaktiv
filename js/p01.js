(function($) {
    'use strict';
    var answers = {"ok": ["Helyes!"], "fail": ["Helytelen!"]};
    var sound = new Howl({
        src: ['audio/sounds.mp3', 'audio/sounds.ogg'],
        sprite: {
            'ok': [0, 3500],
            'fail': [3750, 4326]
        }
    });
    function getGivenAnswers(probId) {
        var results = [];
        $('#' + probId + ' :checked').each(function(){
            results.push(this.id.replace(/\D/g,''));
        });
        return results.join(',');
    };

    function showResults(e) {
        var correctAnswers = window.atob($(e.currentTarget).data('bear')),
            givenAnswers = getGivenAnswers('p01'),
            isCorrect = (correctAnswers === givenAnswers),
            answerStatus = isCorrect ? 'ok' : 'fail';

        $('body').removeClass('answered ok fail').addClass('answered ' + answerStatus);
        $('#bear .answer.' + answerStatus).html(answers[answerStatus].choose());
        sound.stop();
        sound.play(answerStatus);
    };

    function retryProblem(e) {
        $('#' + $(e.currentTarget).data('pid') + ' :checked').removeAttr('checked');
        $('body').removeClass('answered ok fail');
        $('label.flash').removeClass('flash');
    }

    /**
     * Flashes all the correct answers.
     * @param e
     */
    function showCorrectAnswer(e) {
        $.each(window.atob($('#btnShowResults').data('bear')).split(','), function(){
            $('#v' + this + '+label').addClass('flash');
        });
    }

    /**
     * Blocks (Prevents) the action bound to the element.
     * @returns {boolean}
     */
    function stopAnswer() {return false;};

    /**
     * Follows the url specified in the data-url attribute.
     * @param e
     */
    function followUrl(e) {location.href = $(e.currentTarget).data('url');};

    /**On Page Load.*/
    $(function(){
      $('#btnExit').on('click', followUrl);
      $('#btnShowResults').on('click', showResults);
      $('#btnRetry').on('click', retryProblem);
      $('#btnShowCorrectAnswer').on('click', showCorrectAnswer);
      $('html').on('click', '.answered .choice label', stopAnswer);
      //Load all possible answers:
      $.getJSON('data/answers.json').success(function(answersFromFile){
          answers = answersFromFile;
      });
    });
}(jQuery));