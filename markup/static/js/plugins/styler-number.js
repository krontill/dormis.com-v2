/*
 * jQuery Form Styler v1.7.3
 * https://github.com/Dimox/jQueryFormStyler
 *
 * Copyright 2012-2015 Dimox (http://dimox.name/)
 * Released under the MIT license.
 *
 * Date: 2015.09.05
 *
 * ONLY NUMBER, other kill.
 */

;(function(factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // CommonJS
        module.exports = factory(require('jquery'));
    } else {
        factory(jQuery);
    }
}(function($) {

    'use strict';

    var pluginName = 'styler',
        defaults = {
            idSuffix: '-styler',

            onFormStyled: function() {}
        };

    function Plugin(element, options) {
        this.element = element;
        this.options = $.extend({}, defaults, options);
        this.init();
    }

    Plugin.prototype = {

        // инициализация
        init: function() {

            var el = $(this.element);
            var opt = this.options;

            // checkbox
            if (el.is(':checkbox')) {
                // radio
            } else if (el.is(':radio')) {
                // file
            } else if (el.is(':file')) {
                // end file
            } else if (el.is('input[type="number"]')) {

                var numberOutput = function() {

                    var number = $('<div class="jq-number"><div class="jq-number__spin minus"></div><div class="jq-number__spin plus"></div></div>');
                    el.after(number).prependTo(number).wrap('<div class="jq-number__field"></div>');

                    if (el.is(':disabled')) number.addClass('disabled');

                    var min,
                        max,
                        step,
                        timeout = null,
                        interval = null;
                    if (el.attr('min') !== undefined) min = el.attr('min');
                    if (el.attr('max') !== undefined) max = el.attr('max');
                    if (el.attr('step') !== undefined && $.isNumeric(el.attr('step')))
                        step = Number(el.attr('step'));
                    else
                        step = Number(1);

                    var changeValue = function(spin) {
                        var value = el.val(),
                            newValue;
                        if (!$.isNumeric(value)) {
                            value = 0;
                            el.val('0');
                        }
                        if (spin.is('.minus')) {
                            newValue = parseInt(value, 10) - step;
                            if (step > 0) newValue = Math.ceil(newValue / step) * step;
                        } else if (spin.is('.plus')) {
                            newValue = parseInt(value, 10) + step;
                            if (step > 0) newValue = Math.floor(newValue / step) * step;
                        }
                        if ($.isNumeric(min) && $.isNumeric(max)) {
                            if (newValue >= min && newValue <= max) {
                                el.val(newValue);
                                el.trigger('change');
                            }
                        } else if ($.isNumeric(min) && !$.isNumeric(max)) {
                            if (newValue >= min) {
                                el.val(newValue);
                                el.trigger('change');
                            }
                        } else if (!$.isNumeric(min) && $.isNumeric(max)) {
                            if (newValue <= max) {
                                el.val(newValue);
                                el.trigger('change');
                            }
                        } else {
                            el.val(newValue);
                            el.trigger('change');
                        }
                    };

                    if (!number.is('.disabled')) {
                        number.on('mousedown', 'div.jq-number__spin', function() {
                            var spin = $(this);
                            changeValue(spin);
                            timeout = setTimeout(function(){
                                interval = setInterval(function(){ changeValue(spin); }, 40);
                            }, 350);
                        }).on('mouseup mouseout', 'div.jq-number__spin', function() {
                            clearTimeout(timeout);
                            clearInterval(interval);
                        });
                        el.on('focus.styler', function() {
                            number.addClass('focused');
                        })
                            .on('blur.styler', function() {
                                number.removeClass('focused');
                                var newValue = el.val();
                                if ($.isNumeric(min) && $.isNumeric(max)) {
                                    if (+newValue <= +min) {
                                        el.val(min);
                                    }
                                    if (+newValue >= +max) {
                                        el.val(max);
                                    }
                                } else if ($.isNumeric(min) && !$.isNumeric(max)) {
                                    if (+newValue <= +min) el.val(min);
                                } else if (!$.isNumeric(min) && $.isNumeric(max)) {
                                    if (+newValue >= +max) el.val(max);
                                } else {
                                    el.val(newValue);
                                }
                            });
                    }

                }; // end numberOutput()

                numberOutput();

                // обновление при динамическом изменении
                el.on('refresh', function() {
                    el.off('.styler').closest('.jq-number').before(el).remove();
                    numberOutput();
                });

                // end number

                // select
            } else if (el.is('select')) {
                // reset
            } else if (el.is(':reset')) {

            } // end reset

        }, // init: function()

        // деструктор
        destroy: function() {

            var el = $(this.element);

            if (el.is('input[type="number"]')) {
                el.removeData('_' + pluginName).off('.styler refresh').closest('.jq-number').before(el).remove();
            }

        } // destroy: function()

    }; // Plugin.prototype

    $.fn[pluginName] = function(options) {
        var args = arguments;
        if (options === undefined || typeof options === 'object') {
            return this.each(function() {
                if (!$.data(this, '_' + pluginName)) {
                    $.data(this, '_' + pluginName, new Plugin(this, options));
                }
            })
                // колбек после выполнения плагина
                .promise()
                .done(function() {
                    var opt = $(this[0]).data('_' + pluginName);
                    if (opt) opt.options.onFormStyled.call();
                });
        } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
            var returns;
            this.each(function() {
                var instance = $.data(this, '_' + pluginName);
                if (instance instanceof Plugin && typeof instance[options] === 'function') {
                    returns = instance[options].apply(instance, Array.prototype.slice.call(args, 1));
                }
            });
            return returns !== undefined ? returns : this;
        }
    };

}));