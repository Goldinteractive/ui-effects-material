(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery'],function(jQuery) {
      // Also create a global in case some scripts
      // that are loaded still are looking for
      // a global even when an AMD loader is in use.
      return (root.Material = factory(jQuery))
    })
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory(require('jquery'))
  } else {
    // Browser globals (root is window)
    root.Material = factory(jQuery)
  }
}(this, function ($) {'use strict';

var _supportCssAnimations = (function () {
  var el = document.createElement('Material'),
      animEndEvents = {
    WebkitAnimation: 'webkitAnimationEnd',
    MozAnimation: 'animationend',
    OAnimation: 'oAnimationEnd oanimationend',
    animation: 'animationend'
  };

  for (var name in animEndEvents) {
    if (el.style[name] !== undefined) {
      return {
        end: animEndEvents[name]
      };
    }
  }

  return false;
})(),

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
_debounce = function _debounce(func, wait, immediate) {
  var timeout;
  return function () {
    var context = this,
        args = arguments;
    var later = function later() {
      timeout = null;
      if (!immediate) {
        func.apply(context, args);
      }
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) {
      func.apply(context, args);
    }
  };
},
    _isTouch = 'ontouchstart' in window;

function Material() {
  var _this = this;

  var $container = arguments.length <= 0 || arguments[0] === undefined ? $('body') : arguments[0];

  /**
   *  Get the right mouse/finger coordinates
   */

  this.getCoordinates = function (e) {

    return e.originalEvent.targetTouches ? e.originalEvent.targetTouches[0] : e;
  };

  /**
   *  Append the ripple to the body and let it grow
   */

  this.generateRipple = function (e) {

    var deferredRedirect, $el, $link, $ripple, d, x, y, pointer;

    pointer = _this.getCoordinates(e);

    $el = $(e.currentTarget);
    $link = $el[0].tagName === 'A' ? $el : $(e.target);

    deferredRedirect = $link[0].tagName === 'A' && !$el.hasClass('bypass');

    if (deferredRedirect) {
      e.preventDefault();
    }

    // Create the DOM node to generate the ripple effect
    $ripple = $('<span class="ripple"></span>');

    // append it to the element clicked
    $el.prepend($ripple);

    //use $el's width or height whichever is larger for the diameter to make a circle which can cover the entire element.
    d = Math.max($el.outerWidth(), $el.outerHeight());
    $ripple.css({
      height: d,
      width: d
    });

    //get click coordinates
    //logic = click coordinates relative to page - $el's position relative to page - half of self height/width to make it controllable from the center
    x = pointer.pageX - $el.offset().left - d / 2;
    y = pointer.pageY - $el.offset().top - d / 2;

    //set the position and add class .animate
    $ripple.css({
      top: y + 'px',
      left: x + 'px'
    }).addClass('animate')
    // remove the element once the animation is finished
    .one(_this.supportCssAnimations.end, function (e) {

      // browse to the page if this is a link
      if (deferredRedirect) {
        window.location.href = $link[0].href;
      }

      $ripple.remove();
    });
  };

  /**
   *  Bind the UI touch/click events
   */

  this.bind = function () {

    if (!_this.supportCssAnimations) {
      return;
    }

    _this.$container.on('click.material dbclick.material', '.ui-effects-material', _debounce(function (e) {
      return _this.generateRipple(e);
    }, 150, true));
  };

  /**
   *  Kill the the UI touch/click events
   */

  this.unbind = function () {

    if (!_this.supportCssAnimations) {
      return;
    }
    _this.$container.off('.material');
  };

  this.supportCssAnimations = _supportCssAnimations;
  this.$container = $container;
  this.bind();

  return this;
}

	return Material
}));