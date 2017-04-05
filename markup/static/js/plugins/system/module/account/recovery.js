/**
 * This function is necessary to validate registration form for ajax request
 *
 * @returns {boolean}
 */
function account_recovery(form)
{
    var url = $(form).attr('action');
    var parentBtn = $(form).find('.js-submit-action');
    parentBtn.addClass('spinner--active');
    $.post(
        url,
        $(form).serialize(),
        function(response)
        {
            if (response.success == true) {
                $('.modal').modal('hide');
                $('#codeSent').modal('show');
                //system_alert(response.message, 'success', 'Code sent', '<button type="button" class="btn btn--size-s" data-dismiss="modal">Ok</button>');
            } else {
                $('.modal').modal('hide');
                $('#sendingFailed').modal('show');
                //system_alert(response.message, 'error', 'Sending failed', '<a class="btn btn--size-s" href="#tryAgain" data-toggle="modal" data-target="#tryAgain">Try again</a>');
            }
            parentBtn.removeClass('spinner--active');
        },
        'json'
    );

    return false;
}