var date_format = 'mm/dd/yyyy';

var busy_at_create = [];
var busy_at_edit = [];


/**
 * This function is necessary to handle calendar's days
 *
 * @param day
 * @param Array
 */
function calendarBeforeShowDayCreate(day) {
    return calendarBeforeShowDay(day, busy_at_create, $(this));
}

/**
 * This function is necessary to handle calendar's days
 *
 * @param day
 * @param Array
 */
function calendarBeforeShowDayEdit(day) {
    return calendarBeforeShowDay(day, busy_at_edit, $(this));
}

/**
 * This function is necessary to handle calendar's days
 *
 * @param day
 * @param busy_at
 * @param Array
 */
function calendarBeforeShowDay(day, busy_at, input)
{
    var result = true;
    var title = '';
    var day_class = 'contract-day';

    // Fix for day.getTime() after close calendar
    if (day instanceof Date) {
        var timestamp = (day.getTime() - day.getTimezoneOffset()*60000)/1000;
        var role = $(input).data('role');

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

        day_class = day_class + ' ' + (result === true ? 'available' : 'disabled');
        return [result, day_class, title];
    }

    return null;
}

var date_arrival_timestamp_global = null;
var date_departure_timestamp_global = null;

/**
 * This function handles days after close in calendar
 * @param day
 */
function calendarAfterCloseDayCreate(day) {
    calendarAfterCloseDay(day, '.contract-datepicker-input');
}

/**
 * This function handles days after close in calendar
 * @param day
 */
function calendarAfterCloseDayEdit(day) {
    calendarAfterCloseDay(day, '.contract-datepicker-input-edit');
}


/**
 * This function handles days after close in calendar
 * @param day
 */
function calendarAfterCloseDay(day, selector)
{
    var date_arrival = $(selector + '[data-role="arrival"]').val() !== '' ? new Date($(selector + '[data-role="arrival"]').val()) : null;
    var date_arrival_timestamp = date_arrival !== null ? (date_arrival.getTime() - date_arrival.getTimezoneOffset()*60000)/1000 : null;

    var date_departure = $(selector + '[data-role="departure"]').val() !== '' ? new Date($(selector + '[data-role="departure"]').val()) : null;
    var date_departure_timestamp = date_departure !== null ? (date_departure.getTime() - date_departure.getTimezoneOffset()*60000)/1000 : null;

    if ((date_arrival_timestamp !== null && date_departure_timestamp !== null) && date_departure_timestamp < date_arrival_timestamp) {
        $(selector + '[data-role="arrival"]').val(date_departure.format(date_format));
        $(selector + '[data-role="departure"]').val(date_arrival.format(date_format));

        date_arrival =  new Date($(selector + '[data-role="arrival"]').val());
        date_arrival_timestamp = (date_arrival.getTime() - date_arrival.getTimezoneOffset()*60000)/1000;

        date_departure =  new Date($(selector + '[data-role="departure"]').val());
        date_departure_timestamp = (date_departure.getTime() - date_departure.getTimezoneOffset()*60000)/1000;

        var min_timestamp = date_arrival_timestamp + 2*60*60*24;
        if (date_departure_timestamp < min_timestamp) {
            date_departure = new Date();
            date_departure.setTime(min_timestamp*1000);

            date_departure_timestamp = (date_departure.getTime() - date_departure.getTimezoneOffset()*60000)/1000;
            $(selector + '[data-role="departure"]').val(date_departure.format(date_format));
        }
    }

    if (date_arrival_timestamp !== null && date_departure_timestamp === null) {
        date_departure = new Date();

        date_departure.setTime((date_arrival_timestamp + 2*60*60*24)*1000);
        date_departure_timestamp = (date_departure.getTime() - date_departure.getTimezoneOffset()*60000)/1000;

        $(selector + '[data-role="departure"]').val(date_departure.format(date_format));
    }

    if (date_arrival_timestamp === null && date_departure_timestamp !== null) {
        date_arrival = new Date();

        date_arrival.setTime((date_departure_timestamp - 2*60*60*24)*1000);
        date_arrival_timestamp = (date_arrival.getTime() - date_arrival.getTimezoneOffset()*60000)/1000;

        $(selector + '[data-role="arrival"]').val(date_arrival.format(date_format));
    }

    $('.contract-date-arrival-timestamp').val(date_arrival_timestamp);
    $('.contract-date-departure-timestamp').val(date_departure_timestamp);

    date_arrival_timestamp_global = date_arrival_timestamp;
    date_departure_timestamp_global = date_departure_timestamp;
}

var blocking_create_form_id = null;
var blocking_edit_form_id = null;

var contract_info_url = null;

var blocking_create_url = null;
var blocking_edit_url = null;
var blocking_cancel_url = null;


/**
 * This function is necessary to init property calendar
 */
function propertyCalendarInit(event)
{
    var date_arrival = null;
    var date_departure = null;

    $('#blocking-create-block').change(
        function(event)
        {
            event.preventDefault();

            if ($(this).prop('checked') == true) {
                $('#' + blocking_create_form_id + ' input:not([type="checkbox"]):not([type="hidden"]):not(.contract-datepicker-input)').prop('disabled', true);
                $('#' + blocking_create_form_id + ' select').prop('disabled', true);
            } else {
                $('#' + blocking_create_form_id + ' input:not([type="checkbox"]):not([type="hidden"]):not(.contract-datepicker-input)').prop('disabled', false);
                $('#' + blocking_create_form_id + ' select').prop('disabled', false);
            }
        }
    );

    $('#blocking-edit-block').change(
        function(event)
        {
            event.preventDefault();

            if ($(this).prop('checked') == true) {
                $('#' + blocking_edit_form_id + ' input:not([type="checkbox"]):not([type="hidden"]):not(.contract-datepicker-input)').prop('disabled', true);
                $('#' + blocking_edit_form_id + ' select').prop('disabled', true);
            } else {
                $('#' + blocking_edit_form_id + ' input:not([type="checkbox"]):not([type="hidden"]):not(.contract-datepicker-input)').prop('disabled', false);
                $('#' + blocking_edit_form_id + ' select').prop('disabled', false);
            }
        }
    );


    /**
     * This function is necessary to get base class of busy day
     *
     * @param object class_list
     * @returns {*}
     */
    function getBaseClass(class_list) {
        var base_class = 'busy';

        if ($.inArray('blocked', class_list) != -1) {
            base_class = 'blocked';
        } else if ($.inArray('pending', class_list) != -1) {
            base_class = 'pending';
        } else if ($.inArray('locked', class_list) != -1) {
            base_class = 'locked';
        } else if ($.inArray('ical', class_list) != -1) {
            base_class = 'ical';
        }

        return base_class;
    };


    /**
     * This function is necessary to get base class of busy day that was before
     *
     * @param object class_list
     * @return {*}
     */
    function getBaseClassBeforeBlocking(class_list)
    {
        var base_class = null;

        if ($.inArray('busy-blocked', class_list) != -1) {
            base_class = 'busy';
        } else if ($.inArray('blocked-blocked', class_list) != -1) {
            base_class = 'blocked';
        } else if ($.inArray('pending-blocked', class_list) != -1) {
            base_class = 'pending';
        } else if ($.inArray('locked-blocked', class_list) != -1) {
            base_class = 'locked';
        } else if ($.inArray('ical-blocked', class_list) != -1) {
            base_class = 'ical';
        }

        return base_class;
    }


    /**
     * This function is necessary to get base class of busy day that was after
     *
     * @param object class_list
     * @return {*}
     */
    function getBaseClassAfterBlocking(class_list)
    {
        var base_class = null;

        if ($.inArray('blocked-busy', class_list) != -1) {
            base_class = 'busy';
        } else if ($.inArray('blocked-blocked', class_list) != -1) {
            base_class = 'blocked';
        } else if ($.inArray('blocked-pending', class_list) != -1) {
            base_class = 'pending';
        } else if ($.inArray('blocked-locked', class_list) != -1) {
            base_class = 'locked';
        } else if ($.inArray('blocked-ical', class_list) != -1) {
            base_class = 'ical';
        }

        return base_class;
    }


    /**
     * This function is necessary to show popup for creation new blocking
     * @param selected
     */
    function showCreationPopup(selected)
    {
        selected.addClass('selected');

        var date = new Date(date_arrival*1000);
        var arrival_date = date.format(date_format);

        $('.contract-datepicker-input[data-role="arrival"]').val(arrival_date);

        var date = new Date(date_departure*1000);
        var departure_date = date.format(date_format);

        $('.contract-datepicker-input[data-role="departure"]').val(departure_date);

        $('.contract-date-arrival-timestamp').val(date_arrival);
        $('.contract-date-departure-timestamp').val(date_departure);

        date_arrival_timestamp_global = date_arrival;
        date_departure_timestamp_global = date_departure;

        $('#blocking-create-modal').modal('show');
    };


    /**
     * This function is necessary to show contract information popup
     */
    function showInformationPopup(data)
    {
        $('#contract-info-controls-container').children().remove();

        $('#contract-arrival-info').html(data.date_arrival);
        $('#contract-departure-info').html(data.date_departure);
        $('#contract-type-info').html(data.contract_type_translate);

        if (data.guest.length < 1) {
            $('#contract-guest-info').html(translate.CORE_NA);
        } else {
            $('#contract-guest-info').html(data.guest.first_name + ' ' + data.guest.last_name);
        }

        date_arrival = date_arrival_timestamp_global = data.date_arrival_timestamp;
        date_departure = date_departure_timestamp_global = data.date_departure_timestamp;

        busy_at_edit = busy_at_create;
        switch (data.contract_type) {
            case 'busy':
            case 'pending':
                var button_view = $('<a>', {
                    href: data.url.view,
                    html: translate.BUTTON_CONTRACT_VIEW_DETAILS
                });

                var button_edit = $('<a>', {
                    href: data.url.edit,
                    html: translate.BUTTON_CONTRACT_EDIT
                });

                $('#contract-info-controls-container').append(button_view);
                $('#contract-info-controls-container').append(button_edit);

                break;

            case 'blocked':
                busy_at_edit = data.property.busy_at;

                if (data.guest.length < 1) {
                    $('#blocking-edit-block').prop('checked', true);

                    $('#' + blocking_edit_form_id + ' input:not([type="checkbox"]):not([type="hidden"]):not(.contract-datepicker-input)').prop('disabled', true);
                    $('#' + blocking_edit_form_id + ' select').prop('disabled', true);
                } else {
                    $('#' + blocking_edit_form_id + ' input:not([type="checkbox"]):not([type="hidden"]):not(.contract-datepicker-input)').prop('disabled', false);
                    $('#' + blocking_edit_form_id + ' select').prop('disabled', false);

                    $('#blocking-edit-block').prop('checked', false);

                    $('#blocking-edit-first-name').val(data.guest.first_name);
                    $('#blocking-edit-last-name').val(data.guest.last_name);
                    $('#blocking-edit-email').val(data.guest.email);
                    $('#blocking-edit-mobile').val(data.guest.mobile);
                }

                $('#blocking-edit-date-arrival').val(data.date_arrival);
                $('.contract-date-arrival-timestamp').val(data.date_arrival_timestamp);
                $('#blocking-edit-date-departure').val(data.date_departure);
                $('.contract-date-departure-timestamp').val(data.date_departure_timestamp);

                $('.blocking-edit-guest-select').each(
                    function()
                    {
                        $(this).children().remove();

                        var role = $(this).data('role');
                        var selected = data[role];

                        for (var i = 0; i <= data.property.max_people; i++) {
                            var option = $('<option>', {
                                value: i,
                                html: i
                            });

                            if (selected == i) {
                                option.prop('selected', true);
                            }

                            $(this).append(option);
                        }
                    }
                );

                $('#blocking-edit-hash').val(data.contract_hash);
                $('#blocking-edit-security-deposit').val(data.security_deposit);
                $('#blocking-edit-outstanding-amount').val(data.outstanding_amount);

                var button_view = $('<a>', {
                    html: translate.BUTTON_CONTRACT_VIEW_DETAILS
                });

                button_view.click(
                    function (event)
                    {
                        event.preventDefault();

                        $('.custom-form-error').children().remove();

                        handler_url = blocking_edit_url;
                        collecting_form_id = blocking_edit_form_id;

                        $('#contract-info-modal').modal('hide');
                        $('#blocking-edit-modal').modal('show');
                    }
                );

                var button_cancel = $('<a>', {
                    html: translate.BUTTON_CONTRACT_CANCEL
                });

                button_cancel.click(
                    function (event)
                    {
                        event.preventDefault();

                        $('.custom-form-error').children().remove();

                        $.post(
                            blocking_cancel_url,
                            {blocking_hash: data.contract_hash},
                            function (response)
                            {
                                if (response.success == true) {
                                    resetSelectedBlockingData();
                                    $('#contract-info-modal').modal('hide');
                                } else {
                                    system_alert(response.message)
                                }
                            },
                            'json'
                        );
                    }
                );

                $('#contract-info-controls-container').append(button_view);
                $('#contract-info-controls-container').append(button_cancel);

                break;
        }

        $('#contract-info-modal').modal('show');
    };

    var handler_url = blocking_create_url;
    var collecting_form_id = blocking_create_form_id;

    /**
     * This function is necessary to reset blocking data before necessary actions
     */
    function resetSelectedBlockingData()
    {
        var first_day = $('.calendar-day.selected').first();
        var first_day_base_class = getBaseClassBeforeBlocking(first_day.attr('class').split(' '));

        if (first_day.hasClass('departure')) {
            first_day.removeClass('blocked')
                .removeClass('arrival')
                .removeClass(first_day_base_class + '-blocked')
                .addClass(first_day_base_class)
                .attr('data-contract', first_day.data('contractBefore'))
                .data('contract', first_day.data('contractBefore'));
        } else {
            first_day.removeClass('blocked')
                .removeClass('arrival')
                .removeClass('busy')
                .attr('data-contract', '')
                .attr('data-contract-before', '')
                .data('contractBefore', '')
                .data('contract', '');
        }

        var last_day = $('.calendar-day.selected').last();
        var last_day_base_class = getBaseClassAfterBlocking(last_day.attr('class').split(' '));

        if (last_day.hasClass('arrival')) {
            last_day.removeClass('blocked')
                .removeClass('departure')
                .removeClass('blocked-' + last_day_base_class)
                .addClass(last_day_base_class)
                .attr('data-contract-before', last_day.data('contract'))
                .data('contractBefore', last_day.data('contract'));
        } else {
            last_day.removeClass('blocked')
                .removeClass('departure')
                .removeClass('busy')
                .attr('data-contract', '')
                .attr('data-contract-before', '')
                .data('contractBefore', '')
                .data('contract', '');
        }

        $('.calendar-day.selected:not(.arrival):not(.departure)').removeClass('blocked')
            .removeClass('departure')
            .removeClass('arrival')
            .removeClass('busy')
            .attr('data-contract', '')
            .attr('data-contract-before', '')
            .data('contractBefore', '')
            .data('contract', '');
    }

    $('.blocking-confirm').click(
        function(event)
        {
            event.preventDefault();

            $('.custom-form-error').children().remove();

            $.post(
                handler_url,
                $('#' + collecting_form_id).serialize(),
                function(response)
                {
                    var creation = handler_url == blocking_create_url;

                    if (response.success == true) {
                        if (!creation) {
                            resetSelectedBlockingData();
                        }

                        if (date_arrival != date_arrival_timestamp_global || date_departure != date_departure_timestamp_global) {
                            // was changed from popup

                            date_arrival = date_arrival_timestamp_global;
                            date_departure = date_departure_timestamp_global;

                            var list = $('.calendar-day').filter(
                                function() {
                                    var timestamp_value = $(this).data('timestamp');
                                    var result = false;

                                    if (timestamp_value >= date_arrival && timestamp_value <= date_departure) {
                                        result = true;
                                    }

                                    return result;
                                }
                            );

                            $('.calendar-day').removeClass('selected');
                            list.addClass('selected');
                        }

                        var day_departure = $('.calendar-day.selected[data-timestamp="' + date_departure + '"]');

                        var day_arrival = $('.calendar-day.selected[data-timestamp="' + date_arrival + '"]');
                        if (day_arrival.hasClass('busy')) {
                            var class_list = day_arrival.attr('class').split(' ');
                            var base_class = getBaseClass(class_list);

                            if (base_class != 'busy' && base_class != 'blocked') {
                                day_arrival.removeClass(base_class);
                            }

                            day_arrival.addClass(base_class + '-blocked');
                        }
                        day_arrival.addClass('arrival').addClass('blocked');
                        day_arrival.attr('data-contract', response.data.contract_id);
                        day_arrival.data('contract', response.data.contract_id);

                        day_departure.addClass('departure');
                        if (day_departure.hasClass('busy')) {
                            var class_list = day_departure.attr('class').split(' ');
                            var base_class = getBaseClass(class_list);

                            day_departure.addClass('blocked-' + base_class);
                        } else {
                            day_departure.addClass('blocked');
                        }

                        $('.calendar-day.selected:not(.arrival.departure)').attr('data-contract', response.data.contract_id);
                        $('.calendar-day.selected:not(.arrival.departure)').data('contract', response.data.contract_id);

                        $('.calendar-day.selected:not(.arrival)').attr('data-contract-before', response.data.contract_id);
                        $('.calendar-day.selected:not(.arrival)').data('contractBefore', response.data.contract_id);

                        $('.calendar-day.selected:not(.arrival.departure)').addClass('blocked');

                        date_arrival = date_arrival_timestamp_global = null;
                        date_departure = date_departure_timestamp_global = null;

                        $('.calendar-day.selected').addClass('busy');

                        $('.calendar-day').removeClass('selected');

                        if (creation) {
                            $('#blocking-create-modal').modal('hide');
                        } else {
                            $('#blocking-edit-modal').modal('hide');
                        }
                    } else {
                        if (response.data != null) {
                            // Validation error

                            $.each(
                                response.data,
                                function(key, value)
                                {
                                    var input_container = $('#' + collecting_form_id + ' [name="' + key + '"]');
                                    var error_container = input_container.next();
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
                        } else {
                            date_arrival = null;
                            date_departure = null;

                            $('.calendar-day').removeClass('selected');

                            $('#blocking-create-modal').modal('hide');
                            system_alert(response.message);
                        }
                    }
                },
                'json'
            );
        }
    );

    $('.calendar-day').click(
        function(event)
        {
            if ($(this).hasClass('busy')) {
                if (($(this).hasClass('departure') && !$(this).hasClass('arrival')) || (!$(this).hasClass('departure') && $(this).hasClass('arrival'))) {
                    var timestamp = $(this).data('timestamp');
                    if (date_arrival !== null && date_departure !== null) {
                        $('.calendar-day.selected').removeClass('selected');
                        date_arrival = date_departure = null;
                    }

                    $(this).addClass('selected');

                    var need_popup = false;
                    if (date_arrival === null) {
                        date_arrival = timestamp;
                    } else if (date_departure === null) {
                        date_departure = timestamp;

                        if (date_departure < date_arrival) {
                            date_departure = date_arrival;
                            date_arrival = timestamp;
                        }

                        need_popup = true;
                    }

                    if (need_popup === true) {
                        var list = $('.calendar-day').filter(
                            function() {
                                var timestamp_value = $(this).data('timestamp');
                                var result = false;

                                if (timestamp_value >= date_arrival && timestamp_value <= date_departure) {
                                    result = true;
                                }

                                return result;
                            }
                        );

                        if (list.not('.departure').not('.arrival').hasClass('busy')) {
                            date_arrival = null;
                            date_departure = null;

                            $('.calendar-day').removeClass('selected');
                        } else {
                            handler_url = blocking_create_url;
                            collecting_form_id = blocking_create_form_id;
                            showCreationPopup(list);
                        }
                    }
                } else {
                    $('.calendar-day').removeClass('selected');

                    var contract_type = getBaseClass($(this).attr('class').split(' '));
                    var contract_hash = $(this).data('contract');

                    $('.calendar-day[data-contract="' + contract_hash + '"]').addClass('selected');
                    $('.calendar-day[data-contract-before="' + contract_hash + '"]').addClass('selected');

                    var data = {
                        contract_type: contract_type,
                        contract_hash: contract_hash
                    };

                    $.post(
                        contract_info_url,
                        data,
                        function (response) {
                            if (response.success == true) {
                                showInformationPopup(response.data);
                            } else {
                                system_alert(response.message);
                            }
                        },
                        'json'
                    );
                }
            } else {
                var timestamp = $(this).data('timestamp');
                if (date_arrival !== null && date_departure !== null) {
                    $('.calendar-day.selected').removeClass('selected');
                    date_arrival = date_departure = null;
                }

                $('.busy').removeClass('selected');
                $(this).addClass('selected');

                if (date_arrival === null) {
                    date_arrival = timestamp;
                } else if (date_departure === null) {
                    date_departure = timestamp;

                    if (date_departure < date_arrival) {
                        date_departure = date_arrival;
                        date_arrival = timestamp;
                    }

                    var list = $('.calendar-day').filter(
                        function() {
                            var timestamp_value = $(this).data('timestamp');
                            var result = false;

                            if (timestamp_value >= date_arrival && timestamp_value <= date_departure) {
                                result = true;
                            }

                            return result;
                        }
                    );

                    if (list.not('.departure').not('.arrival').hasClass('busy')) {
                        date_arrival = null;
                        date_departure = null;

                        $('.calendar-day').removeClass('selected');
                    } else {
                        handler_url = blocking_create_url;
                        collecting_form_id = blocking_create_form_id;

                        showCreationPopup(list);
                    }
                }
            }
        }
    );
}