var booking_list_url = null;
var page = 1;
var limit = 0;

/**
 * This function is necessary to expand pagination for bookings list
 *
 * @param pagination
 */
function expandBookingsListPagination(pagination) {
    page = pagination.current;

    var pagination_container = $('<div>', {
        class: 'booking-list-pagination'
    });

    if (pagination.last != 1) {
        var previous = $('a[data-page].hidden.fake').clone(true);
        previous.removeClass('hidden').removeClass('fake').html('&laquo;');
        pagination_container.append(previous.attr('data-page', pagination.previous == null ? '' : pagination.previous));

        $.each(
            pagination.range,
            function(key, page_number)
            {
                var link = $('a[data-page].hidden.fake').clone(true);
                link.removeClass('hidden').removeClass('fake').html(page_number);
                link.attr('data-page', page_number);

                if (page_number == pagination.current) {
                    link.addClass('selected');
                }

                pagination_container.append(link);
            }
        );

        var next = $('a[data-page].hidden.fake').clone(true);
        next.removeClass('hidden').removeClass('fake').html('&raquo;');
        pagination_container.append(next.attr('data-page', pagination.next == null ? '' : pagination.next));
    }

    $('.booking-list-pagination').replaceWith(pagination_container);
}


/**
 * This function is necessary to expand contract list from ajax response
 *
 * @param contract_list
 */
function expandContractList(contract_list)
{
    var tbody = $('#booking-list-table > tbody');
    tbody.children().remove();

    $.each(
        contract_list,
        function(key, contract)
        {
            var row = $('tr.hidden.fake').clone();
            row.removeClass('fake');

            var need_to_save_role = [];
            $.each(
                contract.url,
                function (role, action_url)
                {
                    need_to_save_role.push(role);
                    row.find('a[data-role="' + role + '"]').attr('href', action_url);
                }
            );

            $.each(
                row.find('a[data-role]'),
                function (element_key, element)
                {
                    var role = $(element).data('role');
                    if (need_to_save_role.indexOf(role) == -1) {
                        element.remove();
                    }
                }
            );

            row.find('td[data-role="property_title"]').html(contract.property.title);
            row.find('td[data-role="tag"]').html(contract.tag);
            row.find('td[data-role="status"]').html(contract.status);
            row.find('td[data-role="date_arrival"]').html(contract.date_arrival);
            row.find('td[data-role="date_departure"]').html(contract.date_departure);
            row.find('td[data-role="guest_first_name"]').html(contract.guest.first_name);
            row.find('td[data-role="guest_last_name"]').html(contract.guest.last_name);
            row.find('td[data-role="guest_phone"]').html(contract.guest.phone);
            row.find('td[data-role="guest_email"]').html(contract.guest.email);
            row.find('td[data-role="outstanding_amount"]').html(contract.outstanding_amount);
            row.find('td[data-role="security_deposit"]').html(contract.security_deposit);
            row.find('td[data-role="date_created"]').html(contract.date_created);
            row.find('td[data-role="date_modified"]').html(contract.date_modified);

            row.removeClass('hidden');
            tbody.append(row);
        }
    );
}


/**
 * This function is necessary to send request to get booking list
 */
function getBookingListLimited()
{
    var data = {
        page: page,
        where: {
            property_list: $('#contract-property-list').val(),
            status: $('#contract-status').val(),
            arrival_from: $('#contract-date-arrival-from-timestamp').val(),
            arrival_to: $('#contract-date-arrival-to-timestamp').val(),
            blocked: $('#contract-blocked').prop('checked') ? 1 : 0
        },
        limit: limit != 0 ? limit : $('#booking-list-limit').val()
    };

    $.post(
        booking_list_url,
        data,
        function(response)
        {
            if (response.success) {
                var data = response.data;

                expandContractList(data.contract_list);
                expandBookingsListPagination(data.pagination);
            } else {
                system_alert(response.message);
            }
        },
        'json'
    );
}


/**
 * This function is necessary to change quantity of bookings on page
 * @param event
 */
function changeBookingListLimit(event)
{
    var value = $(this).val();
    if (value != limit) {
        limit = value;
        page = 1; // reset pages

        getBookingListLimited();
    }
}


/**
 * This function is necessary to change page on bookings list page
 * @param event
 */
function changeBookingListPage(event)
{
    event.preventDefault();

    var value = $(this).data('page');
    if (value != '' & value != page) {
        page = value;

        getBookingListLimited();
    }
}


/**
 * This function is necessary to send request after change filter with statuses
 * @param event
 */
function changeBookingListStatusFilter(event)
{
    event.preventDefault();
    page = 1;

    getBookingListLimited();
}


/**
 * This function is necessary to send request after change filter with properties
 * @param event
 */
function changeBookingListPropertyFilter(event)
{
    event.preventDefault();
    page = 1;

    getBookingListLimited();
}


/**
 * This function is necessary to show current columns of bookings list
 * @param event
 */
function showBookingListColumn(event)
{
    var column_list = $(this).val();

    var th_list = $('th[data-role]');
    var td_list = $('td[data-role]:not([data-role="actions"])');

    var show_list_th = $('th[data-role]').filter(
        function()
        {
            var role = $(this).data('role');
            if (column_list == null) {
                return false;
            }

            if (column_list.indexOf(role) != -1) {
                return true;
            }

            return false;
        }
    );

    var show_list_td = $('td[data-role]:not([data-role="actions"])').filter(
        function()
        {
            var role = $(this).data('role');
            if (column_list == null) {
                return false;
            }

            if (column_list.indexOf(role) != -1) {
                return true;
            }

            return false;
        }
    );

    th_list.addClass('hidden');
    show_list_th.removeClass('hidden');

    td_list.addClass('hidden');
    show_list_td.removeClass('hidden');
}