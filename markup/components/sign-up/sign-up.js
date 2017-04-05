(function () {
    $("#form-registration").validate({
        rules: {
            email: {
                required: true,
                email: true
            },
            password: {
                minlength: 7,
                required: true,
                letterAndNumber: true
            },
            password_confirm: {
                minlength: 7,
                required: true,
                equalTo: "#password",
                letterAndNumber: true
            }
        },
        messages: {
            email: {
                required: 'This is a required field.',
                email: 'Please enter a valid e-mail address.'
            },
            password: {
                minlength: 'Please enter at least 7 characters.',
                required: 'This is a required field.'
            },
            password_confirm: {
                minlength: 'Please enter at least 7 characters.',
                required: 'This is a required field.',
                equalTo: 'Please enter the same password.'
            }
        },
        submitHandler: function() {
            $('.modal').modal('hide');
        }
    });
})();
