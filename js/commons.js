(function($) {
    'use strict';
    Function.prototype.method = function (name, func) {
        if(!(name in this.prototype)) {
            this.prototype[name] = func;
        }
        return this;
    };
    /**Returns a randomly chosen element from an array.*/
    Array.method('choose', function() {
        return this[Number.random(0, this.length)];
    });

    Number.random = function(a,b) {
        return a + Math.round((b - a) * Math.random());
    };
}());