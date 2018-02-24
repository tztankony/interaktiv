(function($) {
    'use strict';
    /**Overriding the API.*/
    $.extend(window.TZ.API, {
        /**Finds the given Answers.*/
        getGivenAnswers: function(probId) {},
        /**Shows the results panel.*/
        showResults: function (e) {
            var correctAnswers = window.atob($(e.currentTarget).data('bear')),
                givenAnswers = this.API.getGivenAnswers(),
                isCorrect = (correctAnswers === givenAnswers),
                answerStatus = isCorrect ? 'ok' : 'fail';

            $('body').removeClass('answered ok fail').addClass('answered ' + answerStatus);
            $(window).trigger('resizeEnded');
            $("#bear").find(".answer." + answerStatus).html(TZ.answers[answerStatus].choose());
            TZ.sound.stop();
            TZ.sound.play(answerStatus);
        },
        /**Try the problem again.*/
        retryProblem: function (e) {
            $('body').removeClass('answered ok fail');
            $('label.flash').removeClass('flash');
            $(window).trigger('resizeEnded');
        },
        /**
         * Flashes all the correct answers.
         * @param e
         */
        showCorrectAnswer: function (e) {},
        /**Hide all arrows before the window gets resized.*/
        beforeResize: function (evt) {
            $('#p04 .dropfield .dz').hide();
        },

        /**Hide all arrows before the window gets resized.*/
        afterResize: function (evt) {
            redrawDropZones();
        }
    });
    /****Private methods****/
    function redrawDropZones() {
        var $problem = $('#p04'),
            $svgs =  $problem.find('.svgs'),
            $centerzone = $problem.find('.centerzone'),
            $bear =$('#bear'),
            $dropField = $problem.find('.dropfield'),
            descHeight = $problem.find('.description').outerHeight(true),
            buttonsHeight = $problem.find('.buttons').outerHeight(true),
            bearHeight = ($bear.is(':visible') ? $bear.outerHeight(true) : 0),
            dropFieldWidth = $dropField.width(),
            svgHeight = $problem.height() - (descHeight + buttonsHeight + bearHeight),
            dropFieldHeight,
            dropFieldUnit,
            dropZoneWidth, //0.2 * Math.min(dropFieldWidth, dropFielHeight);
            midCirc = {l:0,t:0,x:0,y:0,r:0},
            centerZoneWidth, centerZoneHeight;

        $svgs.height(svgHeight);
        dropFieldHeight = $dropField.height();
        dropFieldUnit = Math.min(dropFieldWidth, dropFieldHeight);
        dropZoneWidth = 0.15 * dropFieldUnit;
        centerZoneWidth = 0.25 * dropFieldUnit;
        centerZoneHeight = 0.25 * dropFieldUnit;
        $centerzone.css({width: centerZoneWidth, height: centerZoneHeight});
        midCirc = {l:(dropFieldWidth - $centerzone.width())/2, t: (dropFieldHeight - $centerzone.height())/2, x:dropFieldWidth/2,y: dropFieldHeight/2, r:centerZoneWidth/2};

        $centerzone.css({left: midCirc.l, top: midCirc.t});

        console.log('centerzonePos(x,y): ', midCirc);
        $('#p04 .dropfield .dz').each(function(){
            var $dz = $(this),
                dzleft = midCirc.x + midCirc.r * Math.cos(i*Math.PI/6),
                dzTop = midCirc.y - midCirc.r * Math.sin(i*Math.PI/6);
            $dz.css({width: dropZoneWidth, height: dropZoneWidth, left: dzLeft, top:dzTop});
        });
        $('#p04 .dropfield .dz').show();
    }
    /**Page specific on Load*/
    $(function() {
        $('.persons > .person').draggable();
        $('.dropfield > .dz').droppable();
    });
}(jQuery));