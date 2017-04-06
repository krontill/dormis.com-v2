$(window).on('load', function () {
    //Load для того чтобы скрипт не срабатывал при первоначальном скролле при загрузке страницы, когда скролл сработал, а select2 еще нет.
    $(window).scroll(function (e) {
        if($(e.target)[0].parentElement === null) {
            $('.js-select2-city').select2('close');
        }
        $('.js-currency_user').select2('close');
        $('.js-lang_user').select2('close');
        if ($('.list-guests').is(':visible')) {
            $('.select2-guestnumber-click').removeClass('select2-container--open');
            $('.list-guests').hide();
        }
        if ($('#arrival-date').data('daterangepicker').isShowing) {
            $('#arrival-date').data('daterangepicker').hide();
        }
        if ($('#departure-date').data('daterangepicker').isShowing) {
            $('#departure-date').data('daterangepicker').hide();
        }
    });
});
