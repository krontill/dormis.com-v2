(function () {

    jQuery('#arrival-date').daterangepicker({
        "autoApply": true,
        autoUpdateInput: false,
        minDate: moment()
    }, function (start, end, label) {
        jQuery('#arrival-date').val(start.format('DD/MM/YYYY'));
        jQuery('#departure-date').val(end.format('DD/MM/YYYY'));
        jQuery('#departure-date').data('daterangepicker').setStartDate(start);
        jQuery('#departure-date').data('daterangepicker').setEndDate(end);
    });

    jQuery('#departure-date').daterangepicker({
        "autoApply": true,
        autoUpdateInput: false,
        minDate: moment()
    }, function (start, end, label) {
        jQuery('#arrival-date').val(start.format('DD/MM/YYYY'));
        jQuery('#departure-date').val(end.format('DD/MM/YYYY'));
        jQuery('#arrival-date').data('daterangepicker').setStartDate(start);
        jQuery('#arrival-date').data('daterangepicker').setEndDate(end);
    });

    jQuery('#departure-date').on('show.daterangepicker', function (ev, picker) {
        picker.container.css({margin: '10px 0 0 -232px'});
        console.log(ev);
        console.log(picker.container[0]); // margin-left: -232px;
    });

})();