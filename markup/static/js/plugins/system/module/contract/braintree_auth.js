var braintree_auth = {
    authorization: '',
    form: '',
    submit: '',
    create: function (authorization, form) {
        braintree_auth.authorization = authorization;
        braintree_auth.form = document.forms[form];
        braintree_auth.submit = braintree_auth.form.elements['submitButton'];

        braintree.client.create({
            authorization: braintree_auth.authorization
        }, function (clientErr, clientInstance) {
            if (clientErr) {
                //console.log('Error client authorization to payment provider, please contact site administrator');
                return;
            }

            braintree.dataCollector.create({
                client: clientInstance,
                kount: true
            }, function (error, dataCollectorInstance) {
                if (error) {
                    return;
                }
                // At this point, you should access the dataCollectorInstance.deviceData value and provide it
                // to your server, e.g. by injecting it into your form as a hidden input.
                var device_data = dataCollectorInstance;
                var device_data_element = braintree_auth.form.elements['device-data'];
                device_data_element.value = device_data.deviceData;
            });

            braintree.hostedFields.create(
                {
                    client: clientInstance,
                    fields: {
                        number: {
                            selector: '#card-number'
                        },
                        cvv: {
                            selector: '#cvv'
                        },
                        expirationDate: {
                            selector: '#expiration-date',
                            placeholder: 'MM / YYYY'
                        }
                    }
                },
                function (hostedFieldsErr, hostedFieldsInstance)
                {
                    if (hostedFieldsErr) {
                        // Handle error in Hosted Fields creation
                        //console.log('Handle error in Hosted Fields creation');
                        return;
                    }

                    braintree_auth.form.addEventListener('submit', function (event) {
                        event.preventDefault();

                        if (!need_transactions) {
                            braintree_auth.form.submit();
                        }

                        hostedFieldsInstance.tokenize(function (tokenizeErr, payload) {
                            if (tokenizeErr) {
                                // Handle error in Hosted Fields tokenization

                                //console.log('You need to enter correct payment data');

                                return;
                            }

                            var payment_method_nonce_element = braintree_auth.form.elements['payment-method-nonce'];
                            payment_method_nonce_element.value = payload.nonce;
                            braintree_auth.form.submit();
                        });
                    }, false);
                }
            );
        });
    }
};