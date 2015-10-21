var Modernizr = require("modernizr");
var transEndEventName = function() {
    var transEndEventNames = {
        'WebkitTransition' : 'webkitTransitionEnd',
        'MozTransition' : 'transitionend',
        'OTransition' : 'oTransitionEnd',
        'msTransition' : 'MSTransitionEnd',
        'transition' : 'transitionend'
    };
    // transition end event name
    return transEndEventNames[Modernizr.prefixed('transition')];
}();
var supportTransitions = Modernizr.csstransitions;

module.exports = {
    /**
     * Get browser dependent event names. (Uses Modernizr)
     *
     * @method getTransEndEventName
     * @return {String} TransitionEnd event name of the current browser
     */
    getTransEndEventName : function() {
        return transEndEventName;
    },

    /**
     * Checks of transitions support is available.
     *
     * @method checkTransitionSupport
     * @return {Boolean}
     */
    getTransitionSupport : function() {
        // transitions support available?
        return supportTransitions;
    }
};