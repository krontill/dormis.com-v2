(function () {
    $('.styler-number').styler({
        onFormStyled: function () {
            $('.list-guests .styler-number').each(function () {
                disMinMax($(this));
                $(this).on('change', function () {
                    disMinMax($(this));
                });
            });
        }
    });

    function disMinMax(el) {
        if (el.val() == el.attr('min')) {
            el.closest('.jq-number').find('.minus').addClass('dis');
        } else {
            el.closest('.jq-number').find('.minus').removeClass('dis');
        }
    }

})();