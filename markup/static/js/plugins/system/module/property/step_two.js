/**
 * This function is necessary to show confirmation dialog for published properties
 */
function showSaveNotification()
{
    var confirmed = $.cookie('confirm_the_changes');
    if (confirmed === undefined || confirmed == 0) {
        $('#property-save-confirmation').modal({
            backdrop: 'static'
        });
    }
}


/**
 * Function that is necessary to agree with rules about saving properties after publish
 */
function agreeWithRules() {
    var checked = $('#show-again-confirm-window').prop('checked');

    $.cookie('confirm_the_changes', checked == true ? 1 : 0, {expires : 30});
    $('#property-save-confirmation').modal('hide');
}


/**
 * Function is necessary to popup notification to user about instant payment
 */
function confirmInstantPayment() {
    var length = $('input#property_instant_payment:checkbox:checked').length;
    if (length === 1) {
        if (!confirm(translate.TEXT_PROPERTY_INSTANT_PAYMENT_CONFIRM)) {
            $('input#property_instant_payment:checkbox:checked').prop('checked', false);
        }
    }
}

// ---------------------------------------- CUSTOM FEES ----------------------------------------------
var max_custom_fees = 10;
var increment = null;

/**
 * This function is necessary to add new custom fees to form
 */
function addNewCustomFee()
{
    var count = $('.custom-fee').length;
    increment = increment === null || count == 0 ? count + 1 : increment;

    function getRandomId()
    {
        var text = '';
        var alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (var i = 0; i < 36; i++) {
            text += alphabet.charAt(Math.floor(Math.random()*alphabet.length));
        }

        return text;
    }

    if (count < max_custom_fees) {
        var template = $('#custom_fee_template').data('template');
        template = template.replace(/__index__/g, increment);
        template = template.replace(/__counter__/g, increment);
        template = template.replace(/__random_id__/g, getRandomId());

        var custom_fee = $(template);
        custom_fee.find('.delete-custom-fee-button').click(deleteCustomFee);

        $('.custom-fee-container').append(custom_fee);

        if (count + 1 == max_custom_fees) {
            $('.button-add-custom-fee').addClass('disabled');
        }

        increment++;
    }
}


/**
 * This function is necessary to add new custom fees to form
 */
function deleteCustomFee(event)
{
    event.preventDefault();

    var is_remote = $(this).data('remote');
    if (is_remote !== false && is_remote !== undefined) {
        var url = $(this).attr('href');

        $.post(
            url,
            {},
            function (response)
            {
                if (response.success == true) {
                    // Custom fee is deleted
                } else {
                    system_alert(response.message);
                }
            },
            'json'
        );
    }

    var custom_fee = $(this).closest('.custom-fee');
    custom_fee.remove();

    var count = $('.custom-fee').length;
    if (count < max_custom_fees) {
        $('.button-add-custom-fee').removeClass('disabled');
    }
}
// ---------------------------------------- CUSTOM FEES ----------------------------------------------


// -------------------------------------------- RATES ------------------------------------------------
var current_rate_type = null;
var rate_has_error = false;

/**
 * This function is necessary to do check of errors
 *
 * @returns {boolean}
 */
function checkForErrors()
{
    var result = false;
    if ($('.rates-calendar-week > .day.has-error').length === 0) {
        result = true;
        rate_has_error = false;
    }

    return result;
}

/**
 * This function is necessary to handle rates calendar for properties at step two.
 */
function rateCalendarHandler()
{
    var from = $('#from').val() !== '' ? new Date($('#from').val()) : null;
    var till = $('#till').val() !== '' ? new Date($('#till').val()) : null;

    from = from !== null ? from.getTime()/1000 : null;
    till = till !== null ? till.getTime()/1000 : null;

    var value = $('#' + current_rate_type).val();
    var data_attribute = 'data-' + current_rate_type.split('_').join('-');

    var input_list = $('.day-input:not(.disabled)').filter(
        function() {
            var timestamp = $(this).data('timestamp');
            var result = false;

            if (from === null && till === null) {
                result = true;
            } else if (from === null && till !== null) {
                if (timestamp <= till) {
                    result = true;
                }
            } else if (from !== null && till === null) {
                if (timestamp >= from) {
                    result = true;
                }
            } else if (from !== null && till !== null) {
                if (timestamp >= from && timestamp <= till) {
                    result = true;
                }
            }

            return result;
        }
    );

    input_list.val(value);
    input_list.attr(data_attribute, value);
}

/**
 * This function is necessary for collecting rates from calendar.
 * @returns {Array}
 */
function getRatesFromCalendar()
{
    var rates = [];

    var timestamp_begin = null;
    var timestamp_last = null;

    var prev_rate = null;
    var prev_min_stay = null;
    var prev_max_stay = null;

    var input_list = $('.day-input:not(.disabled)');
    var total = input_list.length;

    input_list.each(
        function(i)
        {
            var timestamp = $(this).data('timestamp');
            var rate = $(this).data('rate');
            var min_stay = $(this).data('minStay');
            var max_stay = $(this).data('maxStay');

            // Init timestamps
            timestamp_begin = timestamp_begin === null ? timestamp : timestamp_begin;
            timestamp_last = timestamp_last === null ? timestamp : timestamp_last;

            prev_rate = prev_rate === null ? rate : prev_rate;
            prev_min_stay = prev_min_stay === null ? min_stay : prev_min_stay;
            prev_max_stay = prev_max_stay === null ? max_stay : prev_max_stay;

            var last_one = total === (i + 1) ? true : false;

            if (rate === prev_rate && min_stay === prev_min_stay && max_stay === prev_max_stay) {
                if (!last_one) {
                    timestamp_last = timestamp;
                    prev_rate = rate;
                    prev_min_stay = min_stay;
                    prev_max_stay = max_stay;
                } else {
                    rates.push([timestamp_begin, timestamp, rate, min_stay, max_stay].join(':'));
                }
            } else {
                if (!last_one) {
                    rates.push([timestamp_begin, timestamp_last, prev_rate, prev_min_stay, prev_max_stay].join(':'));

                    timestamp_begin = timestamp;
                    timestamp_last = timestamp;
                    prev_rate = rate;
                    prev_min_stay = min_stay;
                    prev_max_stay = max_stay;
                } else {
                    rates.push([timestamp_begin, timestamp_last, prev_rate, prev_min_stay, prev_max_stay].join(':'));
                    rates.push([timestamp, timestamp, rate, min_stay, max_stay].join(':'));
                }
            }
        }
    );

    return rates;
}

/**
 * This function is necessary to collect rates after submitting rates form
 * @returns {boolean}
 */
function submitRatesForm()
{
    if (!checkForErrors()) {
        system_alert(translate.ALERT_PROPERTY_INVALID_RATES);
        return false;
    } else {
        var rates = getRatesFromCalendar();
        $('#property_rates_json').val(JSON.stringify(rates));

        return true;
    }
}

/**
 * This function is necessary to validate number
 *
 * @param val
 * @param max
 * @returns {*|boolean}
 */
function isValidNumber(val, max) {
    return ((isNumeric(val)) && (val > 0) && (val < max) && ((val ^ 0) == val));
}

/**
 * This function is necessary to check for numeric value
 *
 * @param n
 * @returns {boolean}
 */
function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}


/**
 * This function is necessary for document.ready at step two (property edit)
 */
function stepTwoReady()
{
    $('#rates_calendar_form').submit(
        function(event)
        {
            event.preventDefault();
            rateCalendarHandler();
        }
    );

    $('.day-input:not(.disabled)').keyup(
        function (event)
        {
            var data_attribute = 'data-' + current_rate_type.split('_').join('-');
            var value = $.trim($(this).val());

            if (value < 1 || !isValidNumber(value, 9999)) {
                rate_has_error = true;
                $(this).parent().addClass('has-error');
                $(this).val('');
            } else {
                $(this).parent().removeClass('has-error');
                checkForErrors();
            }

            $(this).attr(data_attribute, value);
        }
    );

    $('input[name="rate_type"]').change(
        function(event)
        {
            var rate_type = current_rate_type = $(this).val();

            $('.rate-type-input').val(0);
            $('.rate-type').addClass('hidden');
            $('.rate-type[data-type="' + rate_type + '"]').removeClass('hidden');

            var data_attribute = 'data-' + rate_type.split('_').join('-');
            $('.day-input').each(
                function()
                {
                    $(this).val($(this).attr(data_attribute));
                }
            );
        }
    );
    $('input[name="rate_type"]:checked').change();

    $('.rates-calendar-years > li.year').click(
        function(event)
        {
            if (!$(this).hasClass('active') && !rate_has_error) {
                $('.rates-calendar-years > li.year').removeClass('active');
                $(this).addClass('active');

                var year = $(this).data('year');
                $('.rates-calendar-months > li.month').removeClass('shown');
                $('.rates-calendar-months > li.month[data-year="' + year + '"]').addClass('shown');

                $('.rates-calendar-months > li.month:not(.disabled)[data-year="' + year + '"]').first().click();
            }
        }
    );
    $('.rates-calendar-months > li.month').click(
        function(event)
        {
            if (!$(this).hasClass('active') && !rate_has_error) {
                $('.rates-calendar-months > li.month').removeClass('active');
                $(this).addClass('active');

                var year = $(this).data('year');
                var month = $(this).data('month')

                $('.rates-calendar-week').removeClass('shown');
                $('.rates-calendar-week[data-year="' + year + '"][data-month="' + month + '"]').addClass('shown');
            }
        }
    );
}
// -------------------------------------------- RATES ------------------------------------------------