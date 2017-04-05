(function () {
    jQuery.validator.addMethod("letterAndNumber", function (value, element) {
        var result = false;
        //validate letter & validate number
        result = (this.optional(element) || /[\a-zA-Z\s\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02AE\u0400-\u04FF]/i.test(value) ) && (this.optional(element) || /[0-9]/i.test(value));
        return result;
    }, "You must use letters and numbers.");
})();
