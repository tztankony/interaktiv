(function($) {
    'use strict';

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
            isCorrect = (correctAnswers === givenAnswers);

        $('body').removeClass('answered ok fail').addClass(isCorrect ? 'answered ok' : 'answered fail');
        $('#bear').slideDown();
        sound.play(isCorrect ? 'ok' : 'fail');
    };

    function retryProblem(e) {
        $('#' + $(e.currentTarget).data('pid') + ' :checked').removeAttr('checked');
        $('body').removeClass('answered ok fail');
        $('label.flash').removeClass('flash');
        $('#bear').slideUp();
    }

    function showCorrectAnswer(e) {
        $.each(window.atob($('#btnShowResults').data('bear')).split(','), function(){
            $('#v' + this + '+label').addClass('flash');
        });
    }

    function stopAnswer() {return false;};

    /**On Page Load.*/
    $(function(){
      $('#btnShowResults').on('click', showResults);
      $('#btnRetry').on('click', retryProblem);
      $('#btnShowCorrectAnswer').on('click', showCorrectAnswer);
      $('html').on('click', '.answered label', stopAnswer);
    });
}(jQuery));