(function () {
    $('[data-target="#recoveryBeginModal"]').click(function () {
        $('.modal').modal('hide');
    });
    $("#form-auth").validate({
        rules: {
            auth_email: {
                required: true,
                email: true
            },
            password: {
                required: true,
                minlength: 7
            }
        },
        messages: {
            auth_email: {
                required: "This is a required field.",
                email: "Wrong email address."
            },
            password: {
                required: "This is a required field.",
                minlength: 'Please enter at least 7 characters.'
            }
        },
        submitHandler: function() {
            $('.modal').modal('hide');
        }
    });
})();
