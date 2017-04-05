function system_alert(message, type)//, title, btn
{
    type = type || 'error';
    /*title = title || false;
    btn = btn || false;*/

    var modal_container = $('#system-modal-container').find('.modal-body').first();
    /*var modalTitle = $('#system-modal-container').find('.modal-title');
    var modalFooter = $('#system-modal-container').find('.modal-footer');*/
    modal_container.children().remove();

    if (message instanceof Object) {
        $.each(
            message,
            function(key, value)
            {
                modal_container.append($('<div>', {class: 'notification ' + type}).append($('<p>', {html: value})));
            }
        );
    } else {
        modal_container.append($('<div>', {class: 'notification ' + type}).append($('<p>', {html: message})));
    }
/*
    if(title) {
        modalTitle.text(title);
    }

    if(btn) {
        modalFooter.append(btn);
    }*/

    $('#system-modal-container').modal();
}