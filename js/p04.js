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
    function setupDragDrop($svgCtx) {
        var droppables = $svgCtx.find('#allNames > g'),
            overlapThreshold = "50%";

//we'll call onDrop() when a Draggable is dropped on top of one of the "droppables", and it'll make it "flash" (blink opacity). Obviously you can do whatever you want in this function.
        function onDrop(dragged, dropped) {
            TweenMax.fromTo(dropped, 0.1, {opacity:1}, {opacity:0, repeat:3, yoyo:true});
        }

        Draggable.create(droppables, {
            bounds:window,
            onDrag: function(e) {
                var i = droppables.length;
                while (--i > -1) {
                    if (this.hitTest(droppables[i], overlapThreshold)) {
                        $(droppables[i]).addClass("highlight");
                    } else {
                        $(droppables[i]).removeClass("highlight");
                    }

                    /* ALTERNATE TEST: you can use the static Draggable.hitTest() method for even more flexibility, like passing in a mouse event to see if the mouse is overlapping with the element...
                    if (Draggable.hitTest(droppables[i], e) && droppables[i] !== this.target) {
                      $(droppables[i]).addClass("highlight");
                    } else {
                      $(droppables[i]).removeClass("highlight");
                    }
                    */
                }
            },
            onDragEnd:function(e) {
                var i = droppables.length;
                while (--i > -1) {
                    if (this.hitTest(droppables[i], overlapThreshold)) {
                        onDrop(this.target, droppables[i]);
                    }
                }
            }
        });
    }

    /**Page specific on Load*/
    $(function() {
        $('[data-svg]').each(function(){
            var $el = $(this);

            $el.load($el.data('svg'), {}, function(a,b,c){
                console.log('SVG loaded!');
                if($el.is('.svg-box')) {
                    //var draggable = Draggable.create(".person", {type:"x,y"})
                    setupDragDrop($('.svg-box'));
                }
            })
        });
    });
}(jQuery));