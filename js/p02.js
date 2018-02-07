(function($) {
    'use strict';
    var resizeTimer = 0, resizeStarted = false;
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
        $('#' + probId + ' div.arrow').each(function(){
            results.push(this.id.replace(/^arrow-/,'').split('_'));
        });
        return sortArrayOfArray(results);
    };
    function sortArrayOfArray(aa) {
        aa = aa.sort();
        for(var i = 0; i < aa.length; i++) {
            aa.splice(i, 1, aa[i].sort());
        }
        return aa;
    }
    function showResults(e) {
        var correctAnswers = sortArrayOfArray(JSON.parse(window.atob($(e.currentTarget).data('bear')))),
            givenAnswers = getGivenAnswers('p02'),
            isCorrect = (correctAnswers.toString() === givenAnswers.toString()),
            answerStatus = isCorrect ? 'ok' : 'fail';

        $('body').removeClass('answered ok fail').addClass('answered ' + answerStatus);
        $('#bear .answer.' + answerStatus).html(answers[answerStatus].choose());
        sound.stop();
        sound.play(answerStatus);
    };

    function retryProblem(e) {
        $('.panel .connectable').removeClass('flash').attr('data-connectedto','[]');
        $('.arrow').remove();
        $('body').removeClass('answered ok fail');
        $('label.flash').removeClass('flash');
    }

    /**
     * Flashes all the correct answers.
     * @param e
     */
    function showCorrectAnswer(e) {
        if($('.arrow.flash').length > 0) {
            $('.panel .connectable').removeClass('flash').attr('data-connectedto','[]');
            $('.arrow').remove();
            return;
        }
        var correctAnswers = JSON.parse(window.atob($('#btnShowResults').data('bear')));
        $('.panel .connectable').removeClass('flash').attr('data-connectedto','[]');
        $('.arrow').remove();
        $.each(correctAnswers, function(){
            addArrow($('#' + this[0]), $('#' + this[1]));
        });
        $('.arrow').addClass('flash');
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

    function addArrow($source, $dest) {
        var sO = $source.position(), dO = $dest.position(),
          sH = $source.outerHeight(), sW = $source.outerWidth(), dH = $dest.outerHeight(), dW = $dest.outerWidth(),
          sX = sO.left + sW,
          sY = sO.top + sH/2,
          dX = dO.left,
          dY = dO.top + dH/2,
          X = dX - sX,
          Y = dY - sY,
          w = Math.sqrt(X*X + Y*Y),
          alpha = Math.atan(Y/X)*(180/Math.PI),
          arrowId = 'arrow-' + $source.attr('id') + '_' + $dest.attr('id'),
          $arrowFound = $('#' + arrowId),
          $arrow = ($arrowFound.length > 0 ? $arrowFound : $('<div/>',{'id': arrowId, 'class':'arrow'}).appendTo('#p02 .panel.connectables'));


        console.info('Drawing the Arrow between: ', $source.text(), ' ===> ', $dest.text());
        $arrow.css({top: sY, left: sX, width: w, 'transform-origin':'0 50%', transform: 'rotate(' + alpha + 'deg)'}).show();
    }

    function removeArrow($source, $dest) {
        console.info('Removing the Arrow between: ', $source.text(), ' ===> ', $dest.text());
        var arrowId = 'arrow-' + $source.attr('id') + '_' + $dest.attr('id');
        $('#' + arrowId).remove();
    }
    function clearAllArrows() {
        $('[id^="arrow-"]').hide();
    }
    function redrawAllArrows() {
        var itemIds=[];
        $('[id^="arrow-"]').each(function(){
            itemIds = this.id.replace('arrow-','').split('_');
            addArrow($('#'+ itemIds[0]), $('#'+ itemIds[1]))
        });
    }
    function stopFlashing($items, delayMs) {
        window.setTimeout(function(){$items.removeClass('flash')},delayMs);
    }

    function toggleConnection($sourceItem, $destinationItem) {
        var sourceConnections = $sourceItem.data('connectedto'),
            destinationConnections = $destinationItem.data('connectedto'),
            sourceId = $sourceItem.attr('id'),
            destinationId = $destinationItem.attr('id'),
            indexOfSourceInDestination = destinationConnections.indexOf(sourceId),
            indexOfDestinationInSource = sourceConnections.indexOf(destinationId),
            areConnected = (indexOfDestinationInSource !== -1 && indexOfSourceInDestination !== -1);

        console.info('Toggling connection for pairs: ', sourceId, ' --> ', destinationId);
        if(areConnected) { //drop the connection
            console.info(sourceId, ' is connected to ', destinationId, ' ==> disconnecting...');
            sourceConnections.splice(indexOfDestinationInSource, 1);
            destinationConnections.splice(indexOfSourceInDestination, 1);
            removeArrow($sourceItem, $destinationItem);
        } else { //connect them
            console.info(sourceId, ' is NOT YET connected to ', destinationId, ' ==> connecting...');
            sourceConnections.push(destinationId);
            destinationConnections.push(sourceId);
            addArrow($sourceItem, $destinationItem);
        }
        $sourceItem.attr('data-connectedto', '[' + sourceConnections.join(',') + ']');
        $destinationItem.attr('data-connectedto', '[' + destinationConnections.join(',') + ']');
        stopFlashing($sourceItem.add($destinationItem), 1000);
    }

    function onConnectableClick(e) {
        var $clickedItem = $(e.currentTarget),
            $holder=$clickedItem.closest('.item-holder'),
            $pairHolder = $($holder.data('pair')),
            $flashingPair = $pairHolder.find('.flash'),
            isThisFlashing = $clickedItem.is('.flash'),
            isPairFlashing = !!$flashingPair.length,
            shouldToggleConnection = (!isThisFlashing && isPairFlashing),
            $sourceItem=$(), $destinationItem=$();

        $clickedItem.siblings().removeClass('flash');
        $clickedItem.toggleClass('flash');

        if(shouldToggleConnection) {
            $sourceItem = ($clickedItem.is('.source') ? $clickedItem : $flashingPair);
            $destinationItem = ($clickedItem.is('.destination') ? $clickedItem : $flashingPair);
            toggleConnection($sourceItem, $destinationItem);
        }
    }
    /**On Page Load.*/
    $(function(){
      $(window).on('resize', function(e) {
        if(!resizeStarted){
            resizeStarted = true;
            $(window).trigger('resizeStarted');
        }
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
          resizeStarted = false;
          $(window).trigger('resizeEnded');
        }, 200);
      });

      $('#btnExit').on('click', followUrl);
      $('#btnShowResults').on('click', showResults);
      $('#btnRetry').on('click', retryProblem);
      $('#btnShowCorrectAnswer').on('click', showCorrectAnswer);
      $('.connectable').on('click', onConnectableClick);
      $('html').on('click', '.answered .choice label', stopAnswer);
      $(window).on('resizeStarted', clearAllArrows);
        $(window).on('resizeEnded', redrawAllArrows);
      //Load all possible answers:
      $.getJSON('data/answers.json').success(function(answersFromFile){
          answers = answersFromFile;
      });
    });
}(jQuery));