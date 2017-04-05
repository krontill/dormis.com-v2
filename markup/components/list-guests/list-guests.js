(function () {

    $('.select2-guestnumber-click').click(function (event) {
        event.stopPropagation();
        if ($('.list-guests').is(':visible')) {
            $(this).removeClass('select2-container--open');
            $('.list-guests').hide();
        } else {
            $(this).addClass('select2-container--open');
            $('.list-guests').show();
        }
    });

    $(".page__wrapper").click(function (event) {
        if ($('.list-guests').is(':visible')) {
            $('.select2-guestnumber-click').removeClass('select2-container--open');
            $('.list-guests').hide();
        }
    });

    sumGuests();
    function sumGuests() {
        var sumGuests = 0;
        $('.list-guests .styler-number').each(function () {
            sumGuests += +$(this).val();
        });
        $('#select2-guestnumber-container').html(sumGuests);
        $('#guestnumbers').val(sumGuests);

        $('#guests-adult-hidden').val($('#guests-adult').val());
        $('#guests-teens-hidden').val($('#guests-teens').val());
        $('#guests-child-hidden').val($('#guests-child').val());
        $('#guests-babies-hidden').val($('#guests-babies').val());
    }

    $(".list-guests").click(function (event) {
        event.stopPropagation();
    });

    $('.list-guests .styler-number').on("change paste keyup touchsend", function () {
        sumGuests();
    });

    $('.list-guests .jq-number__spin').on("click touchsend", function () {
        sumGuests();// click - / +
    });

})();
