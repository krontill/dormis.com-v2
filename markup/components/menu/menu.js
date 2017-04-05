(function () {
    var jQueryscrollTop = jQuery(window).scrollTop();
    switchMenu(jQueryscrollTop);
    jQuery(window).scroll(function () {
        jQueryscrollTop = jQuery(window).scrollTop();
        switchMenu(jQueryscrollTop);
    });

    function switchMenu(jQueryscrollTop) {
        if (jQueryscrollTop > 76) {
            jQuery('.header').addClass('header--color');
            jQuery('.logo').addClass('logo--dark');
            jQuery('.menu').addClass('menu--dark');
            jQuery('.btn__stroke').addClass('btn__stroke--orange');
            jQuery('.select2-container--transparent').addClass('select2-container--transparent-dark');
        } else {
            jQuery('.header').removeClass('header--color');
            jQuery('.logo').removeClass('logo--dark');
            jQuery('.menu').removeClass('menu--dark');
            jQuery('.btn__stroke').removeClass('btn__stroke--orange');
            jQuery('.select2-container--transparent').removeClass('select2-container--transparent-dark');
        }
    }
})();

