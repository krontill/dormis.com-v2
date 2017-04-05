(function () {
    $("#form-recovery").validate({
        rules: {
            email_recovery: {
                required: true,
                email: true
            }
        },
        messages: {
            email: {
                required: 'This is a required field.',
                email: 'Please enter a valid e-mail address.'
            }
        },
        submitHandler: function () {
            $('.modal').modal('hide');
            $('#codeSent').modal('show');
        }
    });

    $("#account-verification").validate({
        rules: {
            verification_email: {
                required: true,
                email: true
            },
            verification_code: {
                minlength: 10,
                required: true
            }
        },
        messages: {
            verification_email: {
                required: 'This is a required field.',
                email: 'Please enter a valid e-mail address.'
            },
            verification_code: {
                minlength: 'Please enter at least 10 characters.',
                required: 'This is a required field.'
            }
        },
        submitHandler: function () {
            $('.modal').modal('hide');
            $('#newPasswordModal').modal('show');
        }
    });

    $("#form-recovery-new-password").validate({
        rules: {
            email_verification: {
                required: true,
                email: true
            },
            password_new: {
                minlength: 7,
                required: true,
                letterAndNumber: true
            },
            password_new_confirm: {
                minlength: 7,
                required: true,
                equalTo: "#password_new",
                letterAndNumber: true
            }
        },
        messages: {
            email_verification: {
                required: 'This is a required field.',
                email: 'Please enter a valid e-mail address.'
            },
            password_new: {
                minlength: 'Please enter at least 7 characters.',
                required: 'This is a required field.'
            },
            password_new_confirm: {
                minlength: 'Please enter at least 7 characters.',
                required: 'This is a required field.',
                equalTo: 'Please enter the same password.'
            }
        },
        submitHandler: function () {
            $('.modal').modal('hide');
            $('#recoveryDoneModal').modal('show');
        }
    });

})();
