(function () {

    function onChangeCity() {
        var objForm = jQuery('form[name="search-panel"]');
        var city = jQuery('#city option:selected').val();

        var newaction = '/'; //city != '' ? '/rental/' + city + '/' : '/rental/';

        if (city == -1) {
            newaction = '/';
        }

        if (city != -1 && city != '') {
            jQuery('#send-button').removeClass('dis');
        } else {
            jQuery('#send-button').addClass('dis');
        }

        objForm.attr('action', newaction);
    }

    jQuery(document).ready(function () {
        jQuery('#city').bind('change', onChangeCity);
        jQuery('#send-button').bind('click', function () {

            var city = jQuery('#city option:selected').val();
            var arrivalDate = jQuery('#arrival-date').val();
            var departureDate = jQuery('#departure-date').val();

            if (city == "-1" || city == '') {
                jQuery('.js-select2-city').select2("open");
                return false;
            } else if (arrivalDate == '') {
                jQuery('#arrival-date').click();
                return false;
            } else if (departureDate == '') {
                jQuery('#departure-date').click();
                return false;
            } else {
                jQuery('#city').attr("disabled", "disabled");
                jQuery('.search-panel__btn-wrap').addClass("spinner--active");
            }

        });
    });

})();
