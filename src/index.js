var _supportCssAnimations = (function () {
    var el = document.createElement('Material'),
      animEndEvents = {
        WebkitAnimation: 'webkitAnimationEnd',
        MozAnimation: 'animationend',
        OAnimation: 'oAnimationEnd oanimationend',
        animation: 'animationend'
      }

    for (var name in animEndEvents) {
      if (el.style[name] !== undefined) {
        return {
          end: animEndEvents[name]
        }
      }
    }

    return false

  })(),
  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _debounce = function (func, wait, immediate) {
    var timeout
    return function () {
      var context = this,
        args = arguments
      var later = function () {
        timeout = null
        if (!immediate)  { func.apply(context, args) }
      }
      var callNow = immediate && !timeout
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
      if (callNow) { func.apply(context, args) }
    }
  },
  _isTouch = 'ontouchstart' in window

function Material($container = $('body')) {

  /**
   *  Get the right mouse/finger coordinates
   */

  this.getCoordinates = (e) => {

    return e.originalEvent.targetTouches ? e.originalEvent.targetTouches[0] : e

  }

  /**
   *  Append the ripple to the body and let it grow
   */

  this.generateRipple = (e) => {

    var deferredRedirect, $el, $link, $ripple, d, x, y, pointer

    pointer = this.getCoordinates(e)

    $el = $(e.currentTarget)
    $link = $el[0].tagName === 'A' ? $el : $(e.target)

    deferredRedirect = $link[0].tagName === 'A' && !$el.hasClass('bypass')

    if (deferredRedirect) {
      e.preventDefault()
    }

    // Create the DOM node to generate the ripple effect
    $ripple = $('<span class="ripple"></span>')

    // append it to the element clicked
    $el.prepend($ripple)

    //use $el's width or height whichever is larger for the diameter to make a circle which can cover the entire element.
    d = Math.max($el.outerWidth(), $el.outerHeight())
    $ripple.css({
      height: d,
      width: d
    })

    //get click coordinates
    //logic = click coordinates relative to page - $el's position relative to page - half of self height/width to make it controllable from the center
    x = pointer.pageX - $el.offset().left - d / 2
    y = pointer.pageY - $el.offset().top - d / 2

    //set the position and add class .animate
    $ripple.css({
        top: `${y}px`,
        left: `${x}px`
      })
      .addClass('animate')
      // remove the element once the animation is finished
      .one(this.supportCssAnimations.end, (e) => {

        // browse to the page if this is a link
        if (deferredRedirect) {
          window.location.href = $link[0].href
        }

        $ripple.remove()

      })

  }

  /**
   *  Bind the UI touch/click events
   */

  this.bind = () => {

    if (!this.supportCssAnimations) {
      return
    }

    this.$container.on('click.material dbclick.material', '.ui-effects-material', _debounce((e) => this.generateRipple(e), 150, true))

  }

  /**
   *  Kill the the UI touch/click events
   */

  this.unbind = () => {

    if (!this.supportCssAnimations) {
      return
    }
    this.$container.off('.material')

  }

  this.supportCssAnimations = _supportCssAnimations
  this.$container = $container
  this.bind()

  return this

}