(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery'],function(jQuery){
      // Also create a global in case some scripts
      // that are loaded still are looking for
      // a global even when an AMD loader is in use.
      return (root.Material = factory(jQuery));
    });
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory(require('jquery'));
  } else {
    // Browser globals (root is window)
    root.Material = factory(jQuery);
  }
}(this, function ($) {
/* jshint node:true, es5:false, esnext:true, unused: false */

"use strict";

var _supportCssAnimations = (function () {
  var el = document.createElement("Material"),
      animEndEvents = {
    WebkitAnimation: "webkitAnimationEnd",
    MozAnimation: "animationend",
    OAnimation: "oAnimationEnd oanimationend",
    animation: "animationend"
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
    _isTouch = ("ontouchstart" in window);

var Material = function Material() {
  var _this = this;
  var $container = arguments[0] === undefined ? $("body") : arguments[0];
  return (function () {
    _this.supportCssAnimations = _supportCssAnimations;
    _this.$container = $container;
    _this.bind();
  })();
};

/**
 * 	Get the right mouse/finger coordinates
 */

Material.prototype.getCoordinates = function (e) {
  return e.originalEvent.targetTouches ? e.originalEvent.targetTouches[0] : e;
};

/**
 *  Append the ripple to the body and let it grow
 */

Material.prototype.generateRipple = function (e) {
  var $el, $ripple, d, x, y, pointer;

  pointer = this.getCoordinates(e);

  $el = $(e.currentTarget);
  // Create the DOM node to generate the ripple effect
  $ripple = $("<span class=\"ripple\"></span>");

  // append it to the element clicked
  $el.prepend($ripple);

  //use $el's width or height whichever is larger for the diameter to make a circle which can cover the entire element.
  d = Math.max($el.outerWidth(), $el.outerHeight());
  $ripple.css({
    height: d,
    width: d
  });

  //get click coordinates
  //logic = click coordinates relative to page - $el's position relative to page - half of self height/width to make it controllable from the center;
  x = pointer.pageX - $el.offset().left - d / 2;
  y = pointer.pageY - $el.offset().top - d / 2;

  //set the position and add class .animate
  $ripple.css({
    top: "" + y + "px",
    left: "" + x + "px"
  }).addClass("animate")
  // remove the element once the animation is finished
  .one(this.supportCssAnimations.end, function (e) {
    // browse to the page if this is a link
    if ($el[0].tagName === "A") {
      window.location.href = $el[0].href;
    }

    $ripple.remove();
  });
};

/**
 *  Bind the UI touch/click events
 */

Material.prototype.bind = function () {
  var _this2 = this;


  if (!this.supportCssAnimations) {
    return;
  }

  this.$container.on("" + (_isTouch ? "touchstart" : "mousedown") + ".material", ".ui-effects-material", function (e) {
    return _this2.generateRipple(e);
  });
};

/**
 *  Kill the the UI touch/click events
 */

Material.prototype.unbind = function () {
  if (!this.supportCssAnimations) {
    return;
  }
  this.$container.off(".material");
};
	return Material;
}));