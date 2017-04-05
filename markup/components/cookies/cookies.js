(function () {
    var showCookiesMessage = Cookies.get('cookies-message');

    if (!showCookiesMessage) {
        jQuery('#cookiesMessage').css({'display': 'block'});
    }

    jQuery('#closeCookiesMessage').bind('click', function () {
        Cookies.set('cookies-message', '1');
        jQuery('#cookiesMessage').css({'display': 'none'});
    });
})();