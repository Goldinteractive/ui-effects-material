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

var $body = $("body"), _supportCssAnimations = (function () {
  var el = document.createElement("Material"), animEndEvents = {
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
})();

var Material = (function () {
  var Material = function Material() {
    this.supportCssAnimations = _supportCssAnimations;
    this.bind();
  };

  Material.prototype.generateRipple = function (e) {
    var $el, $ripple, d, x, y, rippleWidth, rippleHeight;

    $el = $(e.currentTarget);

    //create .ripple element if it doesn't exist
    if (!$el.find(".ripple").length) {
      $el.prepend("<span class=\"ripple\"></span>");
    }

    $ripple = $el.find("> .ripple");
    //incase of quick double clicks stop the previous animation
    $ripple.removeClass("animate");

    rippleWidth = $ripple.width();
    rippleHeight = $ripple.height();

    //set size of .ripple
    if (!rippleWidth && !rippleHeight) {
      //use $el's width or height whichever is larger for the diameter to make a circle which can cover the entire element.
      d = Math.max($el.outerWidth(), $el.outerHeight());
      $ripple.css({
        height: d,
        width: d
      });
    }

    //get click coordinates
    //logic = click coordinates relative to page - $el's position relative to page - half of self height/width to make it controllable from the center;
    x = e.pageX - $el.offset().left - (rippleWidth || d) / 2;
    y = e.pageY - $el.offset().top - (rippleHeight || d) / 2;

    //set the position and add class .animate
    $ripple.css({
      top: "" + y + "px",
      left: "" + x + "px"
    }).addClass("animate")
    // remove the element once the animation is finished
    .one(this.supportCssAnimations.end, function (e) {
      return $ripple.remove();
    });
  };

  Material.prototype.bind = function () {
    var _this = this;


    if (!this.supportCssAnimations) {
      return;
    }
    $body.on("click.material", ".ui-effects-material", function (e) {
      return _this.generateRipple(e);
    });
  };

  Material.prototype.unbind = function () {
    if (!this.supportCssAnimations) {
      return;
    }
    $body.off(".material");
  };

  return Material;
})();
	return Material;
}));