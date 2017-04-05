/**
 * This function is necessary to validate auth form for ajax request
 *
 * @returns {boolean}
 */
function account_auth(form)
{
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
                            var id = '#auth_' + key;
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