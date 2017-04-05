/*!
 * Bootstrap v4.0.0-alpha.6 (https://getbootstrap.com)
 * Copyright 2011-2017 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */

if (typeof jQuery === 'undefined') {
    throw new Error('Bootstrap\'s JavaScript requires jQuery. jQuery must be included before Bootstrap\'s JavaScript.')
}

+function ($) {
    var version = $.fn.jquery.split(' ')[0].split('.')
    if ((version[0] < 2 && version[1] < 9) || (version[0] == 1 && version[1] == 9 && version[2] < 1) || (version[0] >= 4)) {
        throw new Error('Bootstrap\'s JavaScript requires at least jQuery v1.9.1 but less than v4.0.0')
    }
}(jQuery);


+function () {

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

    var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

    function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

    function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    /**
     * --------------------------------------------------------------------------
     * Bootstrap (v4.0.0-alpha.6): util.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
     * --------------------------------------------------------------------------
     */

    var Util = function ($) {

        /**
         * ------------------------------------------------------------------------
         * Private TransitionEnd Helpers
         * ------------------------------------------------------------------------
         */

        var transition = false;

        var MAX_UID = 1000000;

        var TransitionEndEvent = {
            WebkitTransition: 'webkitTransitionEnd',
            MozTransition: 'transitionend',
            OTransition: 'oTransitionEnd otransitionend',
            transition: 'transitionend'
        };

        // shoutout AngusCroll (https://goo.gl/pxwQGp)
        function toType(obj) {
            return {}.toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
        }

        function isElement(obj) {
            return (obj[0] || obj).nodeType;
        }

        function getSpecialTransitionEndEvent() {
            return {
                bindType: transition.end,
                delegateType: transition.end,
                handle: function handle(event) {
                    if ($(event.target).is(this)) {
                        return event.handleObj.handler.apply(this, arguments); // eslint-disable-line prefer-rest-params
                    }
                    return undefined;
                }
            };
        }

        function transitionEndTest() {
            if (window.QUnit) {
                return false;
            }

            var el = document.createElement('bootstrap');

            for (var name in TransitionEndEvent) {
                if (el.style[name] !== undefined) {
                    return {
                        end: TransitionEndEvent[name]
                    };
                }
            }

            return false;
        }

        function transitionEndEmulator(duration) {
            var _this = this;

            var called = false;

            $(this).one(Util.TRANSITION_END, function () {
                called = true;
            });

            setTimeout(function () {
                if (!called) {
                    Util.triggerTransitionEnd(_this);
                }
            }, duration);

            return this;
        }

        function setTransitionEndSupport() {
            transition = transitionEndTest();

            $.fn.emulateTransitionEnd = transitionEndEmulator;

            if (Util.supportsTransitionEnd()) {
                $.event.special[Util.TRANSITION_END] = getSpecialTransitionEndEvent();
            }
        }

        /**
         * --------------------------------------------------------------------------
         * Public Util Api
         * --------------------------------------------------------------------------
         */

        var Util = {

            TRANSITION_END: 'bsTransitionEnd',

            getUID: function getUID(prefix) {
                do {
                    // eslint-disable-next-line no-bitwise
                    prefix += ~~(Math.random() * MAX_UID); // "~~" acts like a faster Math.floor() here
                } while (document.getElementById(prefix));
                return prefix;
            },
            getSelectorFromElement: function getSelectorFromElement(element) {
                var selector = element.getAttribute('data-target');

                if (!selector) {
                    selector = element.getAttribute('href') || '';
                    selector = /^#[a-z]/i.test(selector) ? selector : null;
                }

                return selector;
            },
            reflow: function reflow(element) {
                return element.offsetHeight;
            },
            triggerTransitionEnd: function triggerTransitionEnd(element) {
                $(element).trigger(transition.end);
            },
            supportsTransitionEnd: function supportsTransitionEnd() {
                return Boolean(transition);
            },
            typeCheckConfig: function typeCheckConfig(componentName, config, configTypes) {
                for (var property in configTypes) {
                    if (configTypes.hasOwnProperty(property)) {
                        var expectedTypes = configTypes[property];
                        var value = config[property];
                        var valueType = value && isElement(value) ? 'element' : toType(value);

                        if (!new RegExp(expectedTypes).test(valueType)) {
                            throw new Error(componentName.toUpperCase() + ': ' + ('Option "' + property + '" provided type "' + valueType + '" ') + ('but expected type "' + expectedTypes + '".'));
                        }
                    }
                }
            }
        };

        setTransitionEndSupport();

        return Util;
    }(jQuery);

    /**
     * --------------------------------------------------------------------------
     * Bootstrap (v4.0.0-alpha.6): modal.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
     * --------------------------------------------------------------------------
     */

    var Modal = function ($) {

        /**
         * ------------------------------------------------------------------------
         * Constants
         * ------------------------------------------------------------------------
         */

        var NAME = 'modal';
        var VERSION = '4.0.0-alpha.6';
        var DATA_KEY = 'bs.modal';
        var EVENT_KEY = '.' + DATA_KEY;
        var DATA_API_KEY = '.data-api';
        var JQUERY_NO_CONFLICT = $.fn[NAME];
        var TRANSITION_DURATION = 300;
        var BACKDROP_TRANSITION_DURATION = 150;
        var ESCAPE_KEYCODE = 27; // KeyboardEvent.which value for Escape (Esc) key

        var Default = {
            backdrop: true,
            keyboard: true,
            focus: true,
            show: true
        };

        var DefaultType = {
            backdrop: '(boolean|string)',
            keyboard: 'boolean',
            focus: 'boolean',
            show: 'boolean'
        };

        var Event = {
            HIDE: 'hide' + EVENT_KEY,
            HIDDEN: 'hidden' + EVENT_KEY,
            SHOW: 'show' + EVENT_KEY,
            SHOWN: 'shown' + EVENT_KEY,
            FOCUSIN: 'focusin' + EVENT_KEY,
            RESIZE: 'resize' + EVENT_KEY,
            CLICK_DISMISS: 'click.dismiss' + EVENT_KEY,
            KEYDOWN_DISMISS: 'keydown.dismiss' + EVENT_KEY,
            MOUSEUP_DISMISS: 'mouseup.dismiss' + EVENT_KEY,
            MOUSEDOWN_DISMISS: 'mousedown.dismiss' + EVENT_KEY,
            CLICK_DATA_API: 'click' + EVENT_KEY + DATA_API_KEY
        };

        var ClassName = {
            SCROLLBAR_MEASURER: 'modal-scrollbar-measure',
            BACKDROP: 'modal-backdrop',
            OPEN: 'modal-open',
            FADE: 'fade',
            SHOW: 'show'
        };

        var Selector = {
            DIALOG: '.modal-dialog',
            DATA_TOGGLE: '[data-toggle="modal"]',
            DATA_DISMISS: '[data-dismiss="modal"]',
            FIXED_CONTENT: '.fixed-top, .fixed-bottom, .is-fixed, .sticky-top'
        };

        /**
         * ------------------------------------------------------------------------
         * Class Definition
         * ------------------------------------------------------------------------
         */

        var Modal = function () {
            function Modal(element, config) {
                _classCallCheck(this, Modal);

                this._config = this._getConfig(config);
                this._element = element;
                this._dialog = $(element).find(Selector.DIALOG)[0];
                this._backdrop = null;
                this._isShown = false;
                this._isBodyOverflowing = false;
                this._ignoreBackdropClick = false;
                this._isTransitioning = false;
                this._originalBodyPadding = 0;
                this._scrollbarWidth = 0;
            }

            // getters

            // public

            Modal.prototype.toggle = function toggle(relatedTarget) {
                return this._isShown ? this.hide() : this.show(relatedTarget);
            };

            Modal.prototype.show = function show(relatedTarget) {
                var _this9 = this;

                if (this._isTransitioning) {
                    throw new Error('Modal is transitioning');
                }

                if (Util.supportsTransitionEnd() && $(this._element).hasClass(ClassName.FADE)) {
                    this._isTransitioning = true;
                }
                var showEvent = $.Event(Event.SHOW, {
                    relatedTarget: relatedTarget
                });

                $(this._element).trigger(showEvent);

                if (this._isShown || showEvent.isDefaultPrevented()) {
                    return;
                }

                this._isShown = true;

                this._checkScrollbar();
                this._setScrollbar();

                $(document.body).addClass(ClassName.OPEN);

                this._setEscapeEvent();
                this._setResizeEvent();

                $(this._element).on(Event.CLICK_DISMISS, Selector.DATA_DISMISS, function (event) {
                    return _this9.hide(event);
                });

                $(this._dialog).on(Event.MOUSEDOWN_DISMISS, function () {
                    $(_this9._element).one(Event.MOUSEUP_DISMISS, function (event) {
                        if ($(event.target).is(_this9._element)) {
                            _this9._ignoreBackdropClick = true;
                        }
                    });
                });

                this._showBackdrop(function () {
                    return _this9._showElement(relatedTarget);
                });
            };

            Modal.prototype.hide = function hide(event) {
                var _this10 = this;

                if (event) {
                    event.preventDefault();
                }

                if (this._isTransitioning) {
                    throw new Error('Modal is transitioning');
                }

                var transition = Util.supportsTransitionEnd() && $(this._element).hasClass(ClassName.FADE);
                if (transition) {
                    this._isTransitioning = true;
                }

                var hideEvent = $.Event(Event.HIDE);
                $(this._element).trigger(hideEvent);

                if (!this._isShown || hideEvent.isDefaultPrevented()) {
                    return;
                }

                this._isShown = false;

                this._setEscapeEvent();
                this._setResizeEvent();

                $(document).off(Event.FOCUSIN);

                $(this._element).removeClass(ClassName.SHOW);

                $(this._element).off(Event.CLICK_DISMISS);
                $(this._dialog).off(Event.MOUSEDOWN_DISMISS);

                if (transition) {
                    $(this._element).one(Util.TRANSITION_END, function (event) {
                        return _this10._hideModal(event);
                    }).emulateTransitionEnd(TRANSITION_DURATION);
                } else {
                    this._hideModal();
                }
            };

            Modal.prototype.dispose = function dispose() {
                $.removeData(this._element, DATA_KEY);

                $(window, document, this._element, this._backdrop).off(EVENT_KEY);

                this._config = null;
                this._element = null;
                this._dialog = null;
                this._backdrop = null;
                this._isShown = null;
                this._isBodyOverflowing = null;
                this._ignoreBackdropClick = null;
                this._originalBodyPadding = null;
                this._scrollbarWidth = null;
            };

            // private

            Modal.prototype._getConfig = function _getConfig(config) {
                config = $.extend({}, Default, config);
                Util.typeCheckConfig(NAME, config, DefaultType);
                return config;
            };

            Modal.prototype._showElement = function _showElement(relatedTarget) {
                var _this11 = this;

                var transition = Util.supportsTransitionEnd() && $(this._element).hasClass(ClassName.FADE);

                if (!this._element.parentNode || this._element.parentNode.nodeType !== Node.ELEMENT_NODE) {
                    // don't move modals dom position
                    document.body.appendChild(this._element);
                }

                this._element.style.display = 'block';
                this._element.removeAttribute('aria-hidden');
                this._element.scrollTop = 0;

                if (transition) {
                    Util.reflow(this._element);
                }

                $(this._element).addClass(ClassName.SHOW);

                if (this._config.focus) {
                    this._enforceFocus();
                }

                var shownEvent = $.Event(Event.SHOWN, {
                    relatedTarget: relatedTarget
                });

                var transitionComplete = function transitionComplete() {
                    if (_this11._config.focus) {
                        _this11._element.focus();
                    }
                    _this11._isTransitioning = false;
                    $(_this11._element).trigger(shownEvent);
                };

                if (transition) {
                    $(this._dialog).one(Util.TRANSITION_END, transitionComplete).emulateTransitionEnd(TRANSITION_DURATION);
                } else {
                    transitionComplete();
                }
            };

            Modal.prototype._enforceFocus = function _enforceFocus() {
                var _this12 = this;

                $(document).off(Event.FOCUSIN) // guard against infinite focus loop
                    .on(Event.FOCUSIN, function (event) {
                        if (document !== event.target && _this12._element !== event.target && !$(_this12._element).has(event.target).length) {
                            _this12._element.focus();
                        }
                    });
            };

            Modal.prototype._setEscapeEvent = function _setEscapeEvent() {
                var _this13 = this;

                if (this._isShown && this._config.keyboard) {
                    $(this._element).on(Event.KEYDOWN_DISMISS, function (event) {
                        if (event.which === ESCAPE_KEYCODE) {
                            _this13.hide();
                        }
                    });
                } else if (!this._isShown) {
                    $(this._element).off(Event.KEYDOWN_DISMISS);
                }
            };

            Modal.prototype._setResizeEvent = function _setResizeEvent() {
                var _this14 = this;

                if (this._isShown) {
                    $(window).on(Event.RESIZE, function (event) {
                        return _this14._handleUpdate(event);
                    });
                } else {
                    $(window).off(Event.RESIZE);
                }
            };

            Modal.prototype._hideModal = function _hideModal() {
                var _this15 = this;

                this._element.style.display = 'none';
                this._element.setAttribute('aria-hidden', 'true');
                this._isTransitioning = false;
                this._showBackdrop(function () {
                    $(document.body).removeClass(ClassName.OPEN);
                    _this15._resetAdjustments();
                    _this15._resetScrollbar();
                    $(_this15._element).trigger(Event.HIDDEN);
                });
            };

            Modal.prototype._removeBackdrop = function _removeBackdrop() {
                if (this._backdrop) {
                    $(this._backdrop).remove();
                    this._backdrop = null;
                }
            };

            Modal.prototype._showBackdrop = function _showBackdrop(callback) {
                var _this16 = this;

                var animate = $(this._element).hasClass(ClassName.FADE) ? ClassName.FADE : '';

                if (this._isShown && this._config.backdrop) {
                    var doAnimate = Util.supportsTransitionEnd() && animate;

                    this._backdrop = document.createElement('div');
                    this._backdrop.className = ClassName.BACKDROP;

                    if (animate) {
                        $(this._backdrop).addClass(animate);
                    }

                    $(this._backdrop).appendTo(document.body);

                    $(this._element).on(Event.CLICK_DISMISS, function (event) {
                        if (_this16._ignoreBackdropClick) {
                            _this16._ignoreBackdropClick = false;
                            return;
                        }
                        if (event.target !== event.currentTarget) {
                            return;
                        }
                        if (_this16._config.backdrop === 'static') {
                            _this16._element.focus();
                        } else {
                            _this16.hide();
                        }
                    });

                    if (doAnimate) {
                        Util.reflow(this._backdrop);
                    }

                    $(this._backdrop).addClass(ClassName.SHOW);

                    if (!callback) {
                        return;
                    }

                    if (!doAnimate) {
                        callback();
                        return;
                    }

                    $(this._backdrop).one(Util.TRANSITION_END, callback).emulateTransitionEnd(BACKDROP_TRANSITION_DURATION);
                } else if (!this._isShown && this._backdrop) {
                    $(this._backdrop).removeClass(ClassName.SHOW);

                    var callbackRemove = function callbackRemove() {
                        _this16._removeBackdrop();
                        if (callback) {
                            callback();
                        }
                    };

                    if (Util.supportsTransitionEnd() && $(this._element).hasClass(ClassName.FADE)) {
                        $(this._backdrop).one(Util.TRANSITION_END, callbackRemove).emulateTransitionEnd(BACKDROP_TRANSITION_DURATION);
                    } else {
                        callbackRemove();
                    }
                } else if (callback) {
                    callback();
                }
            };

            // ----------------------------------------------------------------------
            // the following methods are used to handle overflowing modals
            // todo (fat): these should probably be refactored out of modal.js
            // ----------------------------------------------------------------------

            Modal.prototype._handleUpdate = function _handleUpdate() {
                this._adjustDialog();
            };

            Modal.prototype._adjustDialog = function _adjustDialog() {
                var isModalOverflowing = this._element.scrollHeight > document.documentElement.clientHeight;

                if (!this._isBodyOverflowing && isModalOverflowing) {
                    this._element.style.paddingLeft = this._scrollbarWidth + 'px';
                }

                if (this._isBodyOverflowing && !isModalOverflowing) {
                    this._element.style.paddingRight = this._scrollbarWidth + 'px';
                }
            };

            Modal.prototype._resetAdjustments = function _resetAdjustments() {
                this._element.style.paddingLeft = '';
                this._element.style.paddingRight = '';
            };

            Modal.prototype._checkScrollbar = function _checkScrollbar() {
                this._isBodyOverflowing = document.body.clientWidth < window.innerWidth;
                this._scrollbarWidth = this._getScrollbarWidth();
            };

            Modal.prototype._setScrollbar = function _setScrollbar() {
                var bodyPadding = parseInt($(Selector.FIXED_CONTENT).css('padding-right') || 0, 10);

                this._originalBodyPadding = document.body.style.paddingRight || '';

                if (this._isBodyOverflowing) {
                    document.body.style.paddingRight = bodyPadding + this._scrollbarWidth + 'px';
                }
            };

            Modal.prototype._resetScrollbar = function _resetScrollbar() {
                document.body.style.paddingRight = this._originalBodyPadding;
            };

            Modal.prototype._getScrollbarWidth = function _getScrollbarWidth() {
                // thx d.walsh
                var scrollDiv = document.createElement('div');
                scrollDiv.className = ClassName.SCROLLBAR_MEASURER;
                document.body.appendChild(scrollDiv);
                var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
                document.body.removeChild(scrollDiv);
                return scrollbarWidth;
            };

            // static

            Modal._jQueryInterface = function _jQueryInterface(config, relatedTarget) {
                return this.each(function () {
                    var data = $(this).data(DATA_KEY);
                    var _config = $.extend({}, Modal.Default, $(this).data(), (typeof config === 'undefined' ? 'undefined' : _typeof(config)) === 'object' && config);

                    if (!data) {
                        data = new Modal(this, _config);
                        $(this).data(DATA_KEY, data);
                    }

                    if (typeof config === 'string') {
                        if (data[config] === undefined) {
                            throw new Error('No method named "' + config + '"');
                        }
                        data[config](relatedTarget);
                    } else if (_config.show) {
                        data.show(relatedTarget);
                    }
                });
            };

            _createClass(Modal, null, [{
                key: 'VERSION',
                get: function get() {
                    return VERSION;
                }
            }, {
                key: 'Default',
                get: function get() {
                    return Default;
                }
            }]);

            return Modal;
        }();

        /**
         * ------------------------------------------------------------------------
         * Data Api implementation
         * ------------------------------------------------------------------------
         */

        $(document).on(Event.CLICK_DATA_API, Selector.DATA_TOGGLE, function (event) {
            var _this17 = this;

            var target = void 0;
            var selector = Util.getSelectorFromElement(this);

            if (selector) {
                target = $(selector)[0];
            }

            var config = $(target).data(DATA_KEY) ? 'toggle' : $.extend({}, $(target).data(), $(this).data());

            if (this.tagName === 'A' || this.tagName === 'AREA') {
                event.preventDefault();
            }

            var $target = $(target).one(Event.SHOW, function (showEvent) {
                if (showEvent.isDefaultPrevented()) {
                    // only register focus restorer if modal will actually get shown
                    return;
                }

                $target.one(Event.HIDDEN, function () {
                    if ($(_this17).is(':visible')) {
                        _this17.focus();
                    }
                });
            });

            Modal._jQueryInterface.call($(target), config, this);
        });

        /**
         * ------------------------------------------------------------------------
         * jQuery
         * ------------------------------------------------------------------------
         */

        $.fn[NAME] = Modal._jQueryInterface;
        $.fn[NAME].Constructor = Modal;
        $.fn[NAME].noConflict = function () {
            $.fn[NAME] = JQUERY_NO_CONFLICT;
            return Modal._jQueryInterface;
        };

        return Modal;
    }(jQuery);

    /**
     * --------------------------------------------------------------------------
     * Bootstrap (v4.0.0-alpha.6): tab.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
     * --------------------------------------------------------------------------
     */

    var Tab = function ($) {

        /**
         * ------------------------------------------------------------------------
         * Constants
         * ------------------------------------------------------------------------
         */

        var NAME = 'tab';
        var VERSION = '4.0.0-alpha.6';
        var DATA_KEY = 'bs.tab';
        var EVENT_KEY = '.' + DATA_KEY;
        var DATA_API_KEY = '.data-api';
        var JQUERY_NO_CONFLICT = $.fn[NAME];
        var TRANSITION_DURATION = 150;

        var Event = {
            HIDE: 'hide' + EVENT_KEY,
            HIDDEN: 'hidden' + EVENT_KEY,
            SHOW: 'show' + EVENT_KEY,
            SHOWN: 'shown' + EVENT_KEY,
            CLICK_DATA_API: 'click' + EVENT_KEY + DATA_API_KEY
        };

        var ClassName = {
            DROPDOWN_MENU: 'dropdown-menu',
            ACTIVE: 'active',
            DISABLED: 'disabled',
            FADE: 'fade',
            SHOW: 'show'
        };

        var Selector = {
            A: 'a',
            LI: 'li',
            DROPDOWN: '.dropdown',
            LIST: 'ul:not(.dropdown-menu), ol:not(.dropdown-menu), nav:not(.dropdown-menu)',
            FADE_CHILD: '> .nav-item .fade, > .fade',
            ACTIVE: '.active',
            ACTIVE_CHILD: '> .nav-item > .active, > .active',
            DATA_TOGGLE: '[data-toggle="tab"], [data-toggle="pill"]',
            DROPDOWN_TOGGLE: '.dropdown-toggle',
            DROPDOWN_ACTIVE_CHILD: '> .dropdown-menu .active'
        };

        /**
         * ------------------------------------------------------------------------
         * Class Definition
         * ------------------------------------------------------------------------
         */

        var Tab = function () {
            function Tab(element) {
                _classCallCheck(this, Tab);

                this._element = element;
            }

            // getters

            // public

            Tab.prototype.show = function show() {
                var _this20 = this;

                if (this._element.parentNode && this._element.parentNode.nodeType === Node.ELEMENT_NODE && $(this._element).hasClass(ClassName.ACTIVE) || $(this._element).hasClass(ClassName.DISABLED)) {
                    return;
                }

                var target = void 0;
                var previous = void 0;
                var listElement = $(this._element).closest(Selector.LIST)[0];
                var selector = Util.getSelectorFromElement(this._element);

                if (listElement) {
                    previous = $.makeArray($(listElement).find(Selector.ACTIVE));
                    previous = previous[previous.length - 1];
                }

                var hideEvent = $.Event(Event.HIDE, {
                    relatedTarget: this._element
                });

                var showEvent = $.Event(Event.SHOW, {
                    relatedTarget: previous
                });

                if (previous) {
                    $(previous).trigger(hideEvent);
                }

                $(this._element).trigger(showEvent);

                if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) {
                    return;
                }

                if (selector) {
                    target = $(selector)[0];
                }

                this._activate(this._element, listElement);

                var complete = function complete() {
                    var hiddenEvent = $.Event(Event.HIDDEN, {
                        relatedTarget: _this20._element
                    });

                    var shownEvent = $.Event(Event.SHOWN, {
                        relatedTarget: previous
                    });

                    $(previous).trigger(hiddenEvent);
                    $(_this20._element).trigger(shownEvent);
                };

                if (target) {
                    this._activate(target, target.parentNode, complete);
                } else {
                    complete();
                }
            };

            Tab.prototype.dispose = function dispose() {
                $.removeClass(this._element, DATA_KEY);
                this._element = null;
            };

            // private

            Tab.prototype._activate = function _activate(element, container, callback) {
                var _this21 = this;

                var active = $(container).find(Selector.ACTIVE_CHILD)[0];
                var isTransitioning = callback && Util.supportsTransitionEnd() && (active && $(active).hasClass(ClassName.FADE) || Boolean($(container).find(Selector.FADE_CHILD)[0]));

                var complete = function complete() {
                    return _this21._transitionComplete(element, active, isTransitioning, callback);
                };

                if (active && isTransitioning) {
                    $(active).one(Util.TRANSITION_END, complete).emulateTransitionEnd(TRANSITION_DURATION);
                } else {
                    complete();
                }

                if (active) {
                    $(active).removeClass(ClassName.SHOW);
                }
            };

            Tab.prototype._transitionComplete = function _transitionComplete(element, active, isTransitioning, callback) {
                if (active) {
                    $(active).removeClass(ClassName.ACTIVE);

                    var dropdownChild = $(active.parentNode).find(Selector.DROPDOWN_ACTIVE_CHILD)[0];

                    if (dropdownChild) {
                        $(dropdownChild).removeClass(ClassName.ACTIVE);
                    }

                    active.setAttribute('aria-expanded', false);
                }

                $(element).addClass(ClassName.ACTIVE);
                element.setAttribute('aria-expanded', true);

                if (isTransitioning) {
                    Util.reflow(element);
                    $(element).addClass(ClassName.SHOW);
                } else {
                    $(element).removeClass(ClassName.FADE);
                }

                if (element.parentNode && $(element.parentNode).hasClass(ClassName.DROPDOWN_MENU)) {

                    var dropdownElement = $(element).closest(Selector.DROPDOWN)[0];
                    if (dropdownElement) {
                        $(dropdownElement).find(Selector.DROPDOWN_TOGGLE).addClass(ClassName.ACTIVE);
                    }

                    element.setAttribute('aria-expanded', true);
                }

                if (callback) {
                    callback();
                }
            };

            // static

            Tab._jQueryInterface = function _jQueryInterface(config) {
                return this.each(function () {
                    var $this = $(this);
                    var data = $this.data(DATA_KEY);

                    if (!data) {
                        data = new Tab(this);
                        $this.data(DATA_KEY, data);
                    }

                    if (typeof config === 'string') {
                        if (data[config] === undefined) {
                            throw new Error('No method named "' + config + '"');
                        }
                        data[config]();
                    }
                });
            };

            _createClass(Tab, null, [{
                key: 'VERSION',
                get: function get() {
                    return VERSION;
                }
            }]);

            return Tab;
        }();

        /**
         * ------------------------------------------------------------------------
         * Data Api implementation
         * ------------------------------------------------------------------------
         */

        $(document).on(Event.CLICK_DATA_API, Selector.DATA_TOGGLE, function (event) {
            event.preventDefault();
            Tab._jQueryInterface.call($(this), 'show');
        });

        /**
         * ------------------------------------------------------------------------
         * jQuery
         * ------------------------------------------------------------------------
         */

        $.fn[NAME] = Tab._jQueryInterface;
        $.fn[NAME].Constructor = Tab;
        $.fn[NAME].noConflict = function () {
            $.fn[NAME] = JQUERY_NO_CONFLICT;
            return Tab._jQueryInterface;
        };

        return Tab;
    }(jQuery);

}();
