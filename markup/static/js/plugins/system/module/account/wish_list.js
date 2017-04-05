/**
 * This function is necessary to add property to wish list
 * @param event
 */
function addToWishList(event)
{
    event.preventDefault();

    var url = $(this).attr('href');
    var element = $(this);

    $.post(
        url,
        {},
        function(response)
        {
            if (response.success == true) {
                if (element.hasClass('liked')) {
                    element.removeClass('liked');
                } else {
                    element.addClass('liked');
                }
            } else {
                system_alert(response.message);
            }
        },
        'json'
    );
}


/**
 * This function is necessary to remove property from wish list
 * @param event
 */
function removeFromWishList(event)
{
    event.preventDefault();

    var url = $(this).attr('href');
    var element = $(this);

    $.post(
        url,
        {},
        function(response)
        {
            if (response.success == true) {
                element.closest('.property-container').remove();
            } else {
                system_alert(response.message);
            }
        },
        'json'
    );
}

/**
 * This function is necessary to change notes for wish list
 * @param event
 */
function changeNote(event)
{
    event.preventDefault();

    var url = $(this).data('remoteUrl');
    var note = $(this).val();

    $.post(
        url,
        {note: note},
        function(response)
        {
            if (response.success == true) {
                // Success, note is changed
            } else {
                system_alert(response.message);
            }
        },
        'json'
    );
}