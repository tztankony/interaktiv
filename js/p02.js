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
        console.info('Implement show correct answer...');
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

    function toggleConnection($sourceItem, $destinationItem) {
        var sourceConnections = $sourceItem.data('connectedto'),
            destinationConnections = $destinationItem.data('connectedto'),
            sourceId = $sourceItem.data('id'),
            destinationId = $destinationItem.data('id'),
            sourceIndexIndestination = destinationConnections.indexOf(sourceId),
            destinationIndexInSource = sourceConnections.indexOf(destinationId);

        console.info('Toggling connection for pairs: ', $sourceItem.data('id'), ' --> ', $destinationItem.data('id'));
        if(destinationIndexInSource !== -1 && sourceIndexIndestination !== -1) {
            console.info($sourceItem.data('id'), ' is connected to ', $destinationItem.data('id'), ' ==> disconnecting...');
            sourceConnections.splice(destinationIndexInSource, 1);
            destinationConnections.splice(sourceIndexIndestination, 1);
        } else {
            console.info($sourceItem.data('id'), ' is NOT connected to ', $destinationItem.data('id'), ' ==> connecting...');
            sourceConnections.push(destinationId);
            destinationConnections.push(sourceId);
        }
        $sourceItem.attr('data-connectedto', '[' + sourceConnections.join(',') + ']');
        $destinationItem.attr('data-connectedto', '[' + destinationConnections.join(',') + ']');
    }

    function onConnectableClick(e) {
        var $connectable = $(e.currentTarget),
            $holder=$connectable.closest('.item-holder'),
            $pairHolder = $($holder.data('pair')),
            $flashingPair = $pairHolder.find('.flash'),
            thisIsFlashing = $connectable.is('.flash'),
            pairIsFlashing = !!$flashingPair.length,
            $sourceItem=$(), $destinationItem=$();

        $connectable.siblings().removeClass('flash');
        if(thisIsFlashing) {
            $connectable.removeClass('flash');
            
        } else {
            $connectable.addClass('flash');
            if(pairIsFlashing) {
                $sourceItem = ($connectable.is('.source') ? $connectable : $flashingPair);
                $destinationItem = ($connectable.is('.destination') ? $connectable : $flashingPair);
                toggleConnection($sourceItem, $destinationItem);
            }
        }
    }
    /**On Page Load.*/
    $(function(){
      $('#btnExit').on('click', followUrl);
      $('#btnShowResults').on('click', showResults);
      $('#btnRetry').on('click', retryProblem);
      $('#btnShowCorrectAnswer').on('click', showCorrectAnswer);
      $('.connectable').on('click', onConnectableClick);
      $('html').on('click', '.answered .choice label', stopAnswer);
      //Load all possible answers:
      $.getJSON('data/answers.json').success(function(answersFromFile){
          answers = answersFromFile;
      });
    });
}(jQuery));