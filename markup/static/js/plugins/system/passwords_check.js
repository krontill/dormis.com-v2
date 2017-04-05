/**
 * Функция для проверки идентичности введенных паролей.
 *
 *      проверка осуществляется по полям с id - #password и #password_repeat
 *
 * @return {boolean}
 */
function passwords_check()
{
    if ($('#password').val() != $('#password_repeat').val()) {
        $('#password-error').removeClass('hidden');
        return false;
    }

    return true;
}