(function (document, $, undefined)
{
    $.upload_zone = function (options)
    {
        var options = options || {};
        var file_list = {};

        if (options.container === undefined) {
            throw new Error('There isn\'t drop zone container selector (setup in options).');
        }

        var container = $(options.container);
        if (container.get(0) === undefined) {
            throw new Error('Cannot find any element in DOM with selector - "'+ options.container +'"');
        }

        if (options.url === undefined) {
            throw new Error('Upload url isn\'t setup.');
        }
        var url = options.url;

        var media_upload_zone_container = container.append($('<div>', {class: 'media_upload_zone_container'})).children('.media_upload_zone_container');
        var media_upload_zone = media_upload_zone_container.append($('<div>', {class: 'media-upload-zone'})).children('.media-upload-zone');
        media_upload_zone.html(translate.TEXT_PROPERTY_DRAG_AND_DROP);

        media_upload_zone_container.parent().css('position', 'relative').append($('<div>', {class: 'upload-zone-overlay hidden'}));

        function upload()
        {
            $('.upload-zone-overlay').removeClass('hidden');

            var form_data = new FormData;
            $.each(file_list, function(key, file)
            {
                form_data.append(key, file, file.name);

                var AI = key;
                file_list[AI] = null;
                delete file_list[AI];
            });

            $.ajax({
                url: url,
                type: 'POST',
                data: form_data,
                cache: false,
                processData: false, // Don't process the files
                contentType: false, // Set content type to false as jQuery will tell the server its a query string request
                dataType: 'json',
                success: function(response)
                {
                    if (response.success === true) {
                        $('.upload-zone-overlay').addClass('hidden');

                        if (options.callback !== undefined && options.callback.success !== undefined && options.callback.success instanceof Function) {
                            var callback = options.callback.success;
                            callback(response.data, response.message);
                        }
                    } else {
                        $('.upload-zone-overlay').addClass('hidden');
                        if (options.callback !== undefined && options.callback.fail !== undefined && options.callback.fail instanceof Function) {
                            var callback = options.callback.fail;
                            callback(response);
                        }
                    }
                },
                error: function(jqXHR, textStatus, errorThrown)
                {
                    $('.upload-zone-overlay').addClass('hidden');
                    system_alert('Ajax error: ' + textStatus);
                    throw new Error('Ajax error: ' + textStatus);
                }
            });
        }

        media_upload_zone.on('dragover', function(event) {
            event.preventDefault();
            event.stopPropagation();
            $(this).addClass('dragging');
        });

        media_upload_zone.on('dragleave', function(event) {
            event.preventDefault();
            event.stopPropagation();
            $(this).removeClass('dragging');
        });

        var AI = 0;
        if (options.input_element !== undefined) {
            $(options.input_element).on('change',
                function(event)
                {
                    event.preventDefault();
                    event.stopPropagation();

                    $(this).removeClass('dragging');

                    $.each($(this).prop('files'),
                        function(key, file)
                        {
                            file_list[AI] = file;
                            AI++;
                        }
                    );

                    upload();
                }
            );
        }

        media_upload_zone.on('drop',
            function(event)
            {
                event.preventDefault();
                event.stopPropagation();

                $(this).removeClass('dragging');

                $.each(event.originalEvent.dataTransfer.files,
                    function(key, file)
                    {
                        file_list[AI] = file;
                        AI++;
                    }
                );

                upload();
            }
        );
    }
})(document, jQuery);