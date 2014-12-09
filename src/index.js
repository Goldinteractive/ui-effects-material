/* jshint node:true, es5:false, esnext:true, unused: false */

'use strict';

let $body = $('body'),
	_supportCssAnimations = (function () {
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
	})();

class Material {
	constructor() {
		this.supportCssAnimations = _supportCssAnimations;
		this.bind();
	}
	generateRipple(e) {

		let $el, $ripple, d, x, y, rippleWidth, rippleHeight;

		$el = $(e.currentTarget);

		//create .ripple element if it doesn't exist
		if (!$el.find('.ripple').length) {
			$el.prepend('<span class="ripple"></span>');
		}

		$ripple = $el.find('> .ripple');
		//incase of quick double clicks stop the previous animation
		$ripple.removeClass('animate');

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
				top: `${y}px`,
				left: `${x}px`
			})
			.addClass('animate')
			// remove the element once the animation is finished
			.one(this.supportCssAnimations.end, (e) => $ripple.remove());
	}
	bind() {

		if (!this.supportCssAnimations) {
			return;
		}
		$body.on('click.material', '.ui-effects-material', (e) => this.generateRipple(e));
	}
	unbind() {
		if (!this.supportCssAnimations) {
			return;
		}
		$body.off('.material');
	}
}