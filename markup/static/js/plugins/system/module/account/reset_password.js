/**
 * This function is necessary to validate reset password form
 *
 * @returns {boolean}
 */
function account_reset_password(form)
{
    if ($('#reset_password').val() != $('#reset_password_repeat').val()) {
        $('#reset-password-error').removeClass('hidden');
        return false;
    }

    return true;
}