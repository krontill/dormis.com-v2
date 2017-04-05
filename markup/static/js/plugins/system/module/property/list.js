/**
 * Function is necessary to popup notification to user about property activation
 */
function confirmPropertyActivation() {
    return confirm(translate.TEXT_PROPERTY_ACTIVATION_CONFIRM);
}


/**
 * Function is necessary to popup notification to user about property deactivation
 */
function confirmPropertyDeactivation() {
    return confirm(translate.TEXT_PROPERTY_DEACTIVATION_CONFIRM);
}


/**
 * This function is necessary to search properties in list (without ajax) by data attributes
 * @param event
 */
function searchPropertyInList(event)
{
    var search_value = $('#property_search_input').val().replace(/\s+/g, ' ').trim();
    if (search_value == '') {
        $('.property-container').removeClass('hidden');
    } else {
        $('.property-container').filter(
            function()
            {
                var property_title = $(this).data('title').toLowerCase();
                if (~property_title.indexOf(search_value.toLocaleLowerCase())) {
                    $(this).removeClass('hidden');
                } else {
                    $(this).addClass('hidden');
                }

                return true;
            }
        );
    }
}


/**
 * This function is necessary to apply sorting to properties list
 * @param event
 */
function applySorting(event)
{
    event.preventDefault();

    var filter_by = $(this).data('filter');
    var filter_direction = $(this).data('direction') != '' ?  $(this).data('direction') : 'asc';

    $('.sorting').data('direction', '');
    $('.sorting').attr('data-direction', '');

    function applySorting(current, next)
    {
        var data_current = $(current).data(filter_by);
        var data_next = $(next).data(filter_by);

        var multiplier = filter_direction === 'desc' ? -1 : 1;
        return (data_current < data_next) ? -1*multiplier : (data_current > data_next) ? 1*multiplier : 0;
    }

    $('.property-container').sort(applySorting).appendTo('.property-list > .row');
    $(this).data('direction', filter_direction === 'asc' ? 'desc' : 'asc');

    // is necessary only for css
    $(this).attr('data-direction', filter_direction === 'asc' ? 'desc' : 'asc');
}