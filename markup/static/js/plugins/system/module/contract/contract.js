var date_format = 'mm/dd/yyyy';
var rates = [];
var busy_at = [];
var contract_edit = false;
var need_transactions = false;

/**
 * This function is necessary to handle calendar's days
 *
 * variables:
 *      busy_at
 *      rates
 * are global
 *
 * @param day
 * @param Array
 */
function calendarBeforeShowDay(day)
{
    var result = true;
    var title = '';
    var day_class = 'contract-day';

    var timestamp = (day.getTime() - day.getTimezoneOffset()*60000)/1000;
    var role = $(this).data('role');

    if (rates[timestamp] === undefined) {
        result = false;
    } else {
        /**
         * rate_info structure:
         *
         * integer rate
         * integer min_stay
         * integer max_stay
         */
        var rate_info = rates[timestamp];

        title = translate_formatted(translate.TEXT_PROPERTY_CALENDAR_POPUP_PLACEHOLDER, [rate_info.rate, rate_info.min_stay]);

        if (busy_at[timestamp] !== undefined) {
            var busyness = busy_at[timestamp];

            switch (role) {
                case 'arrival':
                    if (role == 'arrival' && busyness.arrival == false && busyness.departure == true) {
                        day_class = day_class + ' departure';
                        result = true;
                    } else if (role == 'arrival' && busyness.arrival == true && busyness.departure == false) {
                        day_class = day_class + ' arrival';
                        result = false;
                    } else {
                        result = false;
                    }

                    break;

                case 'departure':
                    if (role == 'departure' && busyness.arrival == true && busyness.departure == false) {
                        day_class = day_class + ' arrival';
                        result = true;
                    } else if (role == 'departure' && busyness.arrival == false && busyness.departure == true) {
                        day_class = day_class + ' departure';
                        result = false;
                    } else {
                        result = false;
                    }

                    break;
            }

            if (busyness.arrival == true && busyness.departure == true) {
                day_class = day_class + ' arrival departure';
                result = false;
            }
        }
    }

    day_class = day_class + ' ' + (result === true ? 'available' : 'disabled');
    return [result, day_class, title];
}


/**
 * This function handles days after close in calendar
 * @param day
 */
function calendarAfterCloseDay(day)
{
    var date_arrival = $('.contract-datepicker-input[data-role="arrival"]').val() !== '' ? new Date($('.contract-datepicker-input[data-role="arrival"]').val()) : null;
    var date_arrival_timestamp = date_arrival !== null ? (date_arrival.getTime() - date_arrival.getTimezoneOffset()*60000)/1000 : null;

    var rate = date_arrival_timestamp !== null ? rates[date_arrival_timestamp] : null;

    var date_departure = $('.contract-datepicker-input[data-role="departure"]').val() !== '' ? new Date($('.contract-datepicker-input[data-role="departure"]').val()) : null;
    var date_departure_timestamp = date_departure !== null ? (date_departure.getTime() - date_departure.getTimezoneOffset()*60000)/1000 : null;

    if ((date_arrival_timestamp !== null && date_departure_timestamp !== null) && date_departure_timestamp < date_arrival_timestamp) {
        $('.contract-datepicker-input[data-role="arrival"]').val(date_departure.format(date_format));
        $('.contract-datepicker-input[data-role="departure"]').val(date_arrival.format(date_format));

        date_arrival =  new Date($('.contract-datepicker-input[data-role="arrival"]').val());
        date_arrival_timestamp = (date_arrival.getTime() - date_arrival.getTimezoneOffset()*60000)/1000;

        rate = rates[date_arrival_timestamp];

        date_departure =  new Date($('.contract-datepicker-input[data-role="departure"]').val());
        date_departure_timestamp = (date_departure.getTime() - date_departure.getTimezoneOffset()*60000)/1000;

        var min_timestamp = date_arrival_timestamp + rate.min_stay*60*60*24;
        if (date_departure_timestamp < min_timestamp) {
            date_departure = new Date();
            date_departure.setTime(min_timestamp*1000);

            date_departure_timestamp = (date_departure.getTime() - date_departure.getTimezoneOffset()*60000)/1000;
            $('.contract-datepicker-input[data-role="departure"]').val(date_departure.format(date_format));
        }
    }

    if (date_arrival_timestamp !== null && date_departure_timestamp === null) {
        date_departure = new Date();
        date_departure.setTime((date_arrival_timestamp + rate.min_stay*60*60*24)*1000);

        date_departure_timestamp = (date_departure.getTime() - date_departure.getTimezoneOffset()*60000)/1000;
        $('.contract-datepicker-input[data-role="departure"]').val(date_departure.format(date_format));
    }

    if (date_arrival_timestamp === null && date_departure_timestamp !== null) {
        rate = date_departure_timestamp !== null ? rates[date_departure_timestamp] : null;

        date_arrival = new Date();
        date_arrival.setTime((date_departure_timestamp - rate.min_stay*60*60*24)*1000);

        date_arrival_timestamp = (date_arrival.getTime() - date_arrival.getTimezoneOffset()*60000)/1000;
        $('.contract-datepicker-input[data-role="arrival"]').val(date_arrival.format(date_format));
    }

    $('#contract-date-arrival-timestamp').val(date_arrival_timestamp);
    $('#contract-date-departure-timestamp').val(date_departure_timestamp);

    if (contract_edit === true) {
        checkBeforeEdit();
    } else {
        checkBeforeLock();
    }
}

var check_before_contract_url = null;
var can_lock_dates = false;
var account_authenticated = false;

/**
 * This function is necessary to do check values before create locking
 */
function checkBeforeLock()
{
    /**
     * Function that is necessary to insert fee info to current container
     * @param fee_container
     * @param options
     */
    function insertFeeInto(fee_container, options)
    {
        var wrap = options.wrap || false;
        var prepend = options.prepend || null;

        var template = '' +
            '<span data-role="heading">' + options.title + '</span>' +
            ' ' +
            '<span data-role="value">' + options.value + '</span>' +
        '';

        if (prepend !== null) {
            template = prepend + ' ' + template;
        }

        if (wrap === true) {
            template = '<div class="fee-wrapper">' + template + '</div>';
        }

        fee_container.append(template);
    };

    $.post(
        check_before_contract_url,
        $('#property-search-free-day').serialize(),
        function(response)
        {
            if (response.success == true) {
                can_lock_dates = true;

                $('#contact-fail').addClass('hidden').html('');

                var invoice = $('.invoice.hidden').clone(true);
                var invoice_data = response.data;

                insertFeeInto(
                    invoice.find('[data-container="average_price"]'),
                    {
                        title: translate_formatted(translate.TEXT_CONTRACT_AVERAGE_PRICE_HEADING, [invoice_data.contract_rates.average_price, invoice_data.contract_rates.nights]),
                        value: invoice_data.contract_rates.grand_total
                    }
                );

                var extra_fee_container = invoice.find('[data-container="extra_fee"] > .fee-list');
                if (invoice_data.extra_fee !== undefined) {
                    // Extra fee containers
                    insertFeeInto(
                        extra_fee_container,
                        {
                            title: translate.TEXT_CONTRACT_UTILITY_CHARGES_FREE_HEADING,
                            value: invoice_data.extra_fee.utility_charges_free == true ? translate.TEXT_PROPERTY_UTILITY_CHARGES_FREE : translate.TEXT_PROPERTY_UTILITY_CHARGES_PAYABLE,
                            wrap: true,
                            prepend: '<span class="glyphicon glyphicon-info-sign" title="' + translate.HELP_CONTRACT_UTILITY_CHARGES_FREE + '"></span>'
                        }
                    );

                    if (invoice_data.extra_fee.adult_fee_amount != 0) {
                        insertFeeInto(
                            extra_fee_container,
                            {
                                title: translate.TEXT_CONTRACT_EXTRA_FEE_ADULT_HEADING,
                                value: invoice_data.extra_fee.adult_fee_amount,
                                wrap: true,
                                prepend: '<span class="glyphicon glyphicon-info-sign" title="' + translate.HELP_CONTRACT_EXTRA_FEE_ADULT + '"></span>'
                            }
                        );
                    }

                    if (invoice_data.extra_fee.teen_fee_amount != 0) {
                        insertFeeInto(
                            extra_fee_container,
                            {
                                title: translate.TEXT_CONTRACT_EXTRA_FEE_TEEN_HEADING,
                                value: invoice_data.extra_fee.teen_fee_amount,
                                wrap: true,
                                prepend: '<span class="glyphicon glyphicon-info-sign" title="' + translate.HELP_CONTRACT_EXTRA_FEE_TEEN + '"></span>'
                            }
                        );
                    }

                    if (invoice_data.extra_fee.child_fee_amount != 0) {
                        insertFeeInto(
                            extra_fee_container,
                            {
                                title: translate.TEXT_CONTRACT_EXTRA_FEE_CHILD_HEADING,
                                value: invoice_data.extra_fee.child_fee_amount,
                                wrap: true,
                                prepend: '<span class="glyphicon glyphicon-info-sign" title="' + translate.HELP_CONTRACT_EXTRA_FEE_CHILD + '"></span>'
                            }
                        );
                    }

                    if (invoice_data.extra_fee.baby_fee_amount != 0) {
                        insertFeeInto(
                            extra_fee_container,
                            {
                                title: translate.TEXT_CONTRACT_EXTRA_FEE_BABY_HEADING,
                                value: invoice_data.extra_fee.baby_fee_amount,
                                wrap: true,
                                prepend: '<span class="glyphicon glyphicon-info-sign" title="' + translate.HELP_CONTRACT_EXTRA_FEE_BABY + '"></span>'
                            }
                        );
                    }

                    if (invoice_data.extra_fee.security_deposit != 0) {
                        insertFeeInto(
                            extra_fee_container,
                            {
                                title: translate.TEXT_CONTRACT_SECURITY_DEPOSIT_HEADING,
                                value: invoice_data.extra_fee.security_deposit,
                                wrap: true,
                                prepend: '<span class="glyphicon glyphicon-info-sign" title="' + translate.HELP_CONTRACT_SECURITY_DEPOSIT + '"></span>'
                            }
                        );
                    }

                    if (invoice_data.extra_fee.grand_total != 0) {
                        insertFeeInto(
                            extra_fee_container,
                            {
                                title: translate.TEXT_CONTRACT_EXTRA_FEE_GRAND_TOTAL_HEADING,
                                value: invoice_data.extra_fee.grand_total,
                                wrap: true
                            }
                        );
                    }
                } else {
                    extra_fee_container.remove();
                }

                var custom_fee_container = invoice.find('[data-container="custom_fee"] > .fee-list');
                if (invoice_data.custom_fee !== undefined) {
                    // Custom fee containers
                    $.each(
                        invoice_data.custom_fee.fees,
                        function(key, custom_fee_info)
                        {
                            insertFeeInto(
                                custom_fee_container,
                                {
                                    title: custom_fee_info.title,
                                    value: custom_fee_info.amount,
                                    wrap: true
                                }
                            );
                        }
                    );

                    if (invoice_data.custom_fee.grand_total != 0) {
                        insertFeeInto(
                            custom_fee_container,
                            {
                                title: translate.TEXT_CONTRACT_CUSTOM_FEE_GRAND_TOTAL_HEADING,
                                value: invoice_data.custom_fee.grand_total,
                                wrap: true
                            }
                        );
                    }
                } else {
                    custom_fee_container.remove();
                }

                insertFeeInto(
                    invoice.find('[data-container="grand_total"]'),
                    {
                        title: translate.TEXT_CONTRACT_GRAND_TOTAL_HEADING,
                        value: invoice_data.grand_total
                    }
                );

                insertFeeInto(
                    invoice.find('[data-container="tourist_fee"]'),
                    {
                        title: translate.TEXT_CONTRACT_TOURIST_COMMISSION_HEADING,
                        value: invoice_data.tourist_fee
                    }
                );

                insertFeeInto(
                    invoice.find('[data-container="commission"]'),
                    {
                        title: translate.TEXT_CONTRACT_COMMISSION_HEADING,
                        value: invoice_data.commission
                    }
                );

                insertFeeInto(
                    invoice.find('[data-container="outstanding_amount"]'),
                    {
                        title: translate.TEXT_CONTRACT_OUTSTANDING_AMOUNT_HEADING,
                        value: invoice_data.outstanding_amount
                    }
                );

                invoice.removeClass('hidden');
                if ($('#contact-invoice-container').find('.invoice').length > 0) {
                    $('#contact-invoice-container').removeClass('hidden').find('.invoice').replaceWith(invoice);
                } else {
                    $('#contact-invoice-container').removeClass('hidden').append(invoice);
                }
            } else {
                can_lock_dates = false;

                $('#contact-fail').removeClass('hidden').html(response.message);
                $('#contact-invoice-container').addClass('hidden').children().remove();
            }
        },
        'json'
    );
}


/**
 * This function is necessary to do check values before edit contract
 */
function checkBeforeEdit()
{
    /**
     * Function that is necessary to insert fee info to current container
     * @param fee_container
     * @param options
     */
    function insertFeeInto(fee_container, options)
    {
        var wrap = options.wrap || false;
        var prepend = options.prepend || null;

        var template = '' +
            '<span data-role="heading">' + options.title + '</span>' +
            ' ' +
            '<span data-role="value">' + options.value + '</span>' +
            '';

        if (prepend !== null) {
            template = prepend + ' ' + template;
        }

        if (wrap === true) {
            template = '<div class="fee-wrapper">' + template + '</div>';
        }

        fee_container.append(template);
    };

    var data = $('#' + contract_form_id).serialize();

    $.post(
        check_before_contract_url,
        data,
        function(response)
        {
            if (response.success == true) {
                can_lock_dates = true;

                $('#contact-fail').addClass('hidden').html('');

                var invoice = $('.invoice.hidden').clone(true);
                var invoice_data = response.data;

                var has_changes = !(invoice_data.refund == null && invoice_data.extra_payment == null);
                need_transactions = has_changes;

                insertFeeInto(
                    invoice.find('[data-container="average_price"]'),
                    {
                        title: translate_formatted(translate.TEXT_CONTRACT_AVERAGE_PRICE_HEADING, [invoice_data.contract_rates.average_price, invoice_data.contract_rates.nights]),
                        value: invoice_data.contract_rates.grand_total
                    }
                );

                var extra_fee_container = invoice.find('[data-container="extra_fee"] > .fee-list');
                if (invoice_data.extra_fee !== undefined) {
                    // Extra fee containers
                    insertFeeInto(
                        extra_fee_container,
                        {
                            title: translate.TEXT_CONTRACT_UTILITY_CHARGES_FREE_HEADING,
                            value: invoice_data.extra_fee.utility_charges_free == true ? translate.TEXT_PROPERTY_UTILITY_CHARGES_FREE : translate.TEXT_PROPERTY_UTILITY_CHARGES_PAYABLE,
                            wrap: true,
                            prepend: '<span class="glyphicon glyphicon-info-sign" title="' + translate.HELP_CONTRACT_UTILITY_CHARGES_FREE + '"></span>'
                        }
                    );

                    if (invoice_data.extra_fee.adult_fee_amount != 0) {
                        insertFeeInto(
                            extra_fee_container,
                            {
                                title: translate.TEXT_CONTRACT_EXTRA_FEE_ADULT_HEADING,
                                value: invoice_data.extra_fee.adult_fee_amount,
                                wrap: true,
                                prepend: '<span class="glyphicon glyphicon-info-sign" title="' + translate.HELP_CONTRACT_EXTRA_FEE_ADULT + '"></span>'
                            }
                        );
                    }

                    if (invoice_data.extra_fee.teen_fee_amount != 0) {
                        insertFeeInto(
                            extra_fee_container,
                            {
                                title: translate.TEXT_CONTRACT_EXTRA_FEE_TEEN_HEADING,
                                value: invoice_data.extra_fee.teen_fee_amount,
                                wrap: true,
                                prepend: '<span class="glyphicon glyphicon-info-sign" title="' + translate.HELP_CONTRACT_EXTRA_FEE_TEEN + '"></span>'
                            }
                        );
                    }

                    if (invoice_data.extra_fee.child_fee_amount != 0) {
                        insertFeeInto(
                            extra_fee_container,
                            {
                                title: translate.TEXT_CONTRACT_EXTRA_FEE_CHILD_HEADING,
                                value: invoice_data.extra_fee.child_fee_amount,
                                wrap: true,
                                prepend: '<span class="glyphicon glyphicon-info-sign" title="' + translate.HELP_CONTRACT_EXTRA_FEE_CHILD + '"></span>'
                            }
                        );
                    }

                    if (invoice_data.extra_fee.baby_fee_amount != 0) {
                        insertFeeInto(
                            extra_fee_container,
                            {
                                title: translate.TEXT_CONTRACT_EXTRA_FEE_BABY_HEADING,
                                value: invoice_data.extra_fee.baby_fee_amount,
                                wrap: true,
                                prepend: '<span class="glyphicon glyphicon-info-sign" title="' + translate.HELP_CONTRACT_EXTRA_FEE_BABY + '"></span>'
                            }
                        );
                    }

                    if (invoice_data.extra_fee.security_deposit != 0) {
                        insertFeeInto(
                            extra_fee_container,
                            {
                                title: translate.TEXT_CONTRACT_SECURITY_DEPOSIT_HEADING,
                                value: invoice_data.extra_fee.security_deposit,
                                wrap: true,
                                prepend: '<span class="glyphicon glyphicon-info-sign" title="' + translate.HELP_CONTRACT_SECURITY_DEPOSIT + '"></span>'
                            }
                        );
                    }

                    if (invoice_data.extra_fee.grand_total != 0) {
                        insertFeeInto(
                            extra_fee_container,
                            {
                                title: translate.TEXT_CONTRACT_EXTRA_FEE_GRAND_TOTAL_HEADING,
                                value: invoice_data.extra_fee.grand_total,
                                wrap: true
                            }
                        );
                    }

                    if (has_changes === true  && (invoice_data.extra_fee.grand_total != 0 || invoice_data.extra_fee.grand_total_old != 0)) {
                        insertFeeInto(
                            invoice.find('[data-container="extra_fee_grand_total_old"]'),
                            {
                                title: translate.TEXT_CONTRACT_EXTRA_FEE_GRAND_TOTAL_OLD_HEADING,
                                value: invoice_data.extra_fee.grand_total_old
                            }
                        );
                    }
                } else {
                    extra_fee_container.remove();
                }

                var custom_fee_container = invoice.find('[data-container="custom_fee"] > .fee-list');
                if (invoice_data.custom_fee !== undefined) {
                    // Custom fee containers
                    $.each(
                        invoice_data.custom_fee.fees,
                        function(key, custom_fee_info)
                        {
                            insertFeeInto(
                                custom_fee_container,
                                {
                                    title: custom_fee_info.title,
                                    value: custom_fee_info.amount,
                                    wrap: true
                                }
                            );
                        }
                    );

                    if (invoice_data.custom_fee.grand_total != 0) {
                        insertFeeInto(
                            custom_fee_container,
                            {
                                title: translate.TEXT_CONTRACT_CUSTOM_FEE_GRAND_TOTAL_HEADING,
                                value: invoice_data.custom_fee.grand_total,
                                wrap: true
                            }
                        );
                    }

                    if (has_changes === true && (invoice_data.custom_fee.grand_total != 0 || invoice_data.custom_fee.grand_total_old != 0)) {
                        insertFeeInto(
                            invoice.find('[data-container="custom_fee_grand_total_old"]'),
                            {
                                title: translate.TEXT_CONTRACT_CUSTOM_FEE_GRAND_TOTAL_OLD_HEADING,
                                value: invoice_data.custom_fee.grand_total_old,
                                wrap: true
                            }
                        );
                    }
                } else {
                    custom_fee_container.remove();
                }

                insertFeeInto(
                    invoice.find('[data-container="grand_total"]'),
                    {
                        title: translate.TEXT_CONTRACT_GRAND_TOTAL_HEADING,
                        value: invoice_data.grand_total
                    }
                );

                if (has_changes) {
                    insertFeeInto(
                        invoice.find('[data-container="grand_total_old"]'),
                        {
                            title: translate.TEXT_CONTRACT_GRAND_TOTAL_OLD_HEADING,
                            value: invoice_data.grand_total_old
                        }
                    );
                }

                insertFeeInto(
                    invoice.find('[data-container="tourist_fee"]'),
                    {
                        title: translate.TEXT_CONTRACT_TOURIST_COMMISSION_HEADING,
                        value: invoice_data.tourist_fee
                    }
                );

                insertFeeInto(
                    invoice.find('[data-container="commission"]'),
                    {
                        title: translate.TEXT_CONTRACT_COMMISSION_HEADING,
                        value: invoice_data.commission
                    }
                );

                if (has_changes) {
                    insertFeeInto(
                        invoice.find('[data-container="tourist_fee_old"]'),
                        {
                            title: translate.TEXT_CONTRACT_TOURIST_COMMISSION_OLD_HEADING,
                            value: invoice_data.tourist_fee_old
                        }
                    );

                    insertFeeInto(
                        invoice.find('[data-container="commission_old"]'),
                        {
                            title: translate.TEXT_CONTRACT_COMMISSION_OLD_HEADING,
                            value: invoice_data.commission_old
                        }
                    );

                    if (invoice_data.refund != null) {
                        insertFeeInto(
                            invoice.find('[data-container="refund"]'),
                            {
                                title: translate.TEXT_CONTRACT_REFUND_HEADING,
                                value: invoice_data.refund
                            }
                        );

                        if (invoice_data.refund_commission != null) {
                            insertFeeInto(
                                invoice.find('[data-container="refund_commission"]'),
                                {
                                    title: translate.TEXT_CONTRACT_REFUND_COMMISSION_HEADING,
                                    value: invoice_data.refund_commission
                                }
                            );
                        }
                    }

                    if (invoice_data.extra_payment != null) {
                        insertFeeInto(
                            invoice.find('[data-container="extra_payment"]'),
                            {
                                title: translate.TEXT_CONTRACT_EXTRA_PAYMENT_HEADING,
                                value: invoice_data.extra_payment
                            }
                        );
                    }
                }

                insertFeeInto(
                    invoice.find('[data-container="outstanding_amount"]'),
                    {
                        title: translate.TEXT_CONTRACT_OUTSTANDING_AMOUNT_HEADING,
                        value: invoice_data.outstanding_amount
                    }
                );

                invoice.removeClass('hidden');
                if ($('#contact-invoice-container').find('.invoice').length > 0) {
                    $('#contact-invoice-container').removeClass('hidden').find('.invoice').replaceWith(invoice);
                } else {
                    $('#contact-invoice-container').removeClass('hidden').append(invoice);
                }
            } else {
                can_lock_dates = false;

                $('#contact-fail').removeClass('hidden').html(response.message);
                $('#contact-invoice-container').addClass('hidden').children().remove();
            }
        },
        'json'
    );
}


/**
 * This function is necessary to submit contract create form
 *
 * @returns {boolean}
 */
function submitContractCreateForm()
{
    if (account_authenticated == false) {
        system_alert(translate.ALERT_CONTRACT_PLEASE_DO_LOGIN);
        return false;
    }

    return can_lock_dates;
}


var contract_form_id = null;


/**
 * This function is necessary to submit contract edit form
 *
 * @returns {boolean}
 */
function submitContractEditForm()
{
    return can_lock_dates;
}
