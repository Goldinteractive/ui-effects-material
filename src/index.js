/* jshint node:true, es5:false, esnext:true, unused: false */

'use strict';

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
	_isTouch = 'ontouchstart' in window;

class Material {
	constructor($container = $('body')) {
		this.supportCssAnimations = _supportCssAnimations;
		this.$container = $container;
		this.bind();
	}
	/**
	 * 	Get the right mouse/finger coordinates
	 */
	getCoordinates(e) {
		return e.originalEvent.targetTouches ? e.originalEvent.targetTouches[0] : e;
	}
	/**
	 *  Append the ripple to the body and let it grow
	 */
	generateRipple(e) {

		var $el, $ripple, d, x, y, pointer;

		pointer = this.getCoordinates(e);

		$el = $(e.currentTarget);
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
		//logic = click coordinates relative to page - $el's position relative to page - half of self height/width to make it controllable from the center;
		x = pointer.pageX - $el.offset().left - d / 2;
		y = pointer.pageY - $el.offset().top - d / 2;

		//set the position and add class .animate
		$ripple.css({
				top: `${y}px`,
				left: `${x}px`
			})
			.addClass('animate')
			// remove the element once the animation is finished
			.one(this.supportCssAnimations.end, (e) => $ripple.remove());
	}
	/**
	 *  Bind the UI touch/click events
	 */
	bind() {

		if (!this.supportCssAnimations) {
			return;
		}
		this.$container.on(`${(_isTouch ? 'touchstart': 'mousedown')}.material`, '.ui-effects-material', (e) => this.generateRipple(e));
	}
	/**
	 *  Kill the the UI touch/click events
	 */
	unbind() {
		if (!this.supportCssAnimations) {
			return;
		}
		this.$container.off('.material');
	}
}