(function () {
    var reasons_option = {
        horizontal: 1,
        itemNav: 'basic',
        smart: 1,
        activateOn: 'click',
        activateMiddle: 1,
        mouseDragging: 1,
        touchDragging: 1,
        releaseSwing: 1,
        elasticBounds: 1,
        prev: jQuery(".reasons__prev"),
        next: jQuery(".reasons__next"),
        speed: 300,
        startAt: 0,
        keyboardNavBy: 'items'
    }; // > 1599

    var reasons_option2 = {
        horizontal: 1,
        itemNav: 'forceCentered',
        smart: 1,
        activateOn: 'click',
        activateMiddle: 1,
        mouseDragging: 1,
        touchDragging: 1,
        releaseSwing: 1,
        elasticBounds: 1,
        prev: jQuery(".reasons__prev"),
        next: jQuery(".reasons__next"),
        speed: 300,
        startAt: 6,
        keyboardNavBy: 'items'
    };  // < 1599

    var real_option = reasons_option;
    var sly_reasons = new Sly('#reasons', real_option).init();
    jQuery(document).ready(function () {
        function sliderInit() {
            if (jQuery(document).width() > 1599) {
                if (real_option !== reasons_option) {
                    sly_reasons.destroy();
                    real_option = reasons_option;
                    sly_reasons = new Sly('#reasons', real_option).init();
                }
            } else {
                if (real_option !== reasons_option2) {
                    sly_reasons.destroy();
                    real_option = reasons_option2;
                    sly_reasons = new Sly('#reasons', real_option).init();
                    sly_reasons.on('moveStart', function () {
                        jQuery(".reasons__nav").css({zIndex: '-1'});
                    });
                    sly_reasons.on('moveEnd', function () {
                        jQuery(".reasons__nav").css({zIndex: '1'});
                    });
                }
            }
            sly_reasons.reload();
        }

        sliderInit();

        jQuery(window).resize(function () {
            sliderInit();
        });
    });
})();
