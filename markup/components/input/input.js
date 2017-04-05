(function () {
    $('.input').on('focus', function () {
        if ($(this).hasClass('input--error')) {
            $(this).removeClass('input--error');
            $(this).parent().find('.custom-form-error').empty();
        }
    });
})();