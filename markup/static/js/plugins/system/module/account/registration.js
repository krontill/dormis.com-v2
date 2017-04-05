/**
 * This function is necessary to validate registration form for ajax request
 *
 * @returns {boolean}
 */
function account_registration(form)
{
    if ($('#password').val() != $('#password_repeat').val()) {
        $('#password_repeat').addClass('input--error');
        $('#password_repeat').parent().find('.custom-form-error').text($('#password-error').data('error'));
        return false;
    }

    var url = $(form).attr('action');
    $.post(
        url,
        $(form).serialize(),
        function(response)
        {
            if (response.success == true) {
                location.reload();
            } else {
                if (response.message != null) {
                    $('.modal').modal('hide');
                    system_alert(response.message);
                }

                if (response.data != null) {
                    $.each(
                        response.data,
                        function(key, value)
                        {
                            var id = '#' + key;
                            $(id).addClass('input--error');
                            var error_container = $(id).next();
                            error_container.children().remove();

                            $.each(
                                value,
                                function(error_type, error_message)
                                {
                                    var error = $('<li>');
                                    error.html(error_message);
                                    error_container.append(error);
                                }
                            );
                        }
                    );
                }
            }
        },
        'json'
    );

    return false;
}