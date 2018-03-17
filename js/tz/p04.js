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
            dropZoneR, //0.2 * Math.min(dropFieldWidth, dropFielHeight);
            midCirc = {l:0,t:0,x:0,y:0,r:0},
            centerZoneWidth, centerZoneHeight,
            ellipseA =0, ellipseB =0;

        $svgs.height(svgHeight);
        dropFieldHeight = $dropField.height();
        dropFieldUnit = Math.min(dropFieldWidth, dropFieldHeight);
        centerZoneWidth = 0.25 * dropFieldUnit;
        centerZoneHeight = 0.25 * dropFieldUnit;
        $centerzone.css({width: centerZoneWidth, height: centerZoneHeight}),
        midCirc = {x:dropFieldWidth/2,y: dropFieldHeight/2, r:centerZoneWidth/2, l:0, t: 0};
        midCirc.l = midCirc.x - midCirc.r;

        midCirc.t = midCirc.y - midCirc.r;
        $centerzone.css({left: midCirc.l, top: midCirc.t});

        ellipseA = 0.75 * dropFieldWidth/2;
        ellipseB = 0.75 * dropFieldHeight/2;
        dropZoneR = 0.25 * ellipseB;

        console.log('centerzonePos(x,y): ', midCirc);
        $('#p04 .dropfield .dz').each(function(i, dz){
            var $dz = $(dz),
                dzLeft = midCirc.x + ellipseA * Math.cos(i*Math.PI/6) - dropZoneR,
                dzTop = midCirc.y - ellipseB * Math.sin(i*Math.PI/6) - dropZoneR;

            $dz.css({width: 2 * dropZoneR, height: 2 * dropZoneR, left: dzLeft, top:dzTop});
        });
        $('#p04 .dropfield .dz').show();
    }
    /**Page specific on Load*/
    $(function() {

    });
}(jQuery));