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

// ------------------------------------------------ GALERY -------------------------------------------------------------
/**
 * This function is necessary to reset property gallery sorting
 */
function resetGallerySorting()
{
    var property_slide_list = $('.property-slide');
    property_slide_list.each(
        function(number)
        {
            $(this).attr('data-sort', number + 1);
        }
    );
}

/**
 * This function is necessary to move slide position up
 */
function moveSlideUp()
{
    var property_slide = $(this).closest('.property-slide');
    var prev_slide = property_slide.prev();

    if (prev_slide.length === 1) {
        prev_slide.insertAfter(property_slide);
        resetGallerySorting();
    }
}


/**
 * This function is necessary to move slide position down
 */
function moveSlideDown()
{
    var property_slide = $(this).closest('.property-slide');
    var next_slide = property_slide.next();

    if (next_slide.length === 1) {
        property_slide.insertAfter(next_slide);
        resetGallerySorting();
    }
}


var slide_wait_for_delete = [];

/**
 * This function is necessary to delete slides from property gallery
 * @param event
 */
function deleteSlide(event)
{
    event.preventDefault();

    var url = $(this).attr('href');
    var remote = $(this).data('remote');

    var property_slide = $(this).closest('.property-slide');

    if (remote === true) {
        $.post(
            url,
            {},
            function(response)
            {
                if (response.success == true) {
                    property_slide.remove();
                    resetGallerySorting();
                } else {
                    system_alert(response.message);
                }
            },
            'json'
        );
    } else {
        slide_wait_for_delete.push(property_slide.data('id'));
        property_slide.remove();

        resetGallerySorting();
    }
}


/**
 * This function is necessary to set slide as main for property
 * @param event
 */
function setAsMainSlide(event)
{
    var url = $(this).data('url');
    var checked = $(this).prop('checked');

    if (checked === true) {
        $('.btn-main-slide:checked').prop('checked', false);
        $(this).prop('checked', true);

        $.post(
            url,
            {},
            function(response)
            {
                if (response.success == true) {

                } else {
                    system_alert(response.message);
                }
            },
            'json'
        );
    }
}
// ------------------------------------------------ GALERY -------------------------------------------------------------