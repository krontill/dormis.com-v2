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
 * This function is necessary to fill selects with hours and minutes at step one
 * @param selector
 */
function fillTimeFor(selector)
{
    var value = $(selector).val();
    var time = value.split(':');

    var hours = $('.property_time_selector[data-target="' + selector.split('#')[1] + '"][data-role="hours"]');
    var hours_option = hours.children('option[value="' + time[0] + '"]').first();
    hours_option.attr('selected', true);

    var minutes = $('.property_time_selector[data-target="' + selector.split('#')[1] + '"][data-role="minutes"]');
    var minutes_option = minutes.children('option[value="' + time[1] + '"]').first();
    minutes_option.attr('selected', true);
}


/**
 * This function sets time to hidden inputs at step one
 * @param event
 */
function setTime(event)
{
    var target = '#' + $(this).data('target');
    var role = $(this).data('role');

    var other_selector = $('.property_time_selector[data-role="' + (role === 'hours' ? 'minutes' : 'hours') + '"][data-target="' + $(this).data('target') + '"]');

    var time = [];
    time.push($(this).val());
    time.push(other_selector.val());

    if (role !== 'hours') {
        time.reverse();
    }

    $(target).val(time.join(':'));
}
