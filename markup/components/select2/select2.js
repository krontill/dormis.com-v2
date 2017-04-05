(function () {

    $('.js-transparent-select').select2({
        minimumResultsForSearch: Infinity,
        theme: "transparent"
    });

    $('.menu__imitation').addClass('menu__imitation--hide');

    function modelMatcher(params, data) {
        //http://stackoverflow.com/questions/35966627/select2-custom-matcher-to-keep-options-open-if-group-title-matches
        data.parentText = data.parentText || "";

        // Always return the object if there is nothing to compare
        if (jQuery.trim(params.term) === '') {
            return data;
        }

        // Do a recursive check for options with children
        if (data.children && data.children.length > 0) {
            // Clone the data object if there are children
            // This is required as we modify the object to remove any non-matches
            var match = jQuery.extend(true, {}, data);

            // Check each child of the option
            for (var c = data.children.length - 1; c >= 0; c--) {
                var child = data.children[c];
                child.parentText += data.parentText + " " + data.text;

                var matches = modelMatcher(params, child);

                // If there wasn't a match, remove the object in the array
                if (matches == null) {
                    match.children.splice(c, 1);
                }
            }

            // If any children matched, return the new object
            if (match.children.length > 0) {
                return match;
            }

            // If there were no matching children, check just the plain object
            return modelMatcher(params, match);
        }

        // If the typed-in term matches the text of this term, or the text from any
        // parent term, then it's a match.
        var original = (data.parentText + ' ' + data.text).toUpperCase();
        var term = params.term.toUpperCase();

        // Check if the text contains the term
        if (original.indexOf(term) > -1) {
            return data;
        }

        var info = data.element.dataset.city;

        if(info) {
            info = info.toUpperCase();
            if (info.indexOf(term) > -1) {
                return data;
            }
        }

        // If it doesn't contain the term, don't return anything
        return null;
    }

    $('.js-select2-city').select2({
        placeholder: {
            id: '-1', // the value of the option
            text: "where are you going?"
        },
        theme: "white",
        matcher: modelMatcher,
        templateResult: function (data) {
            if(data.element){
                return jQuery('<div class="city-selection">' +
                    '<div class="city-selection__city">' + data.text + '</div>' +
                    '<div class="city-selection__region">' + data.element.dataset.city + '</div>' +
                    '</div>');
            }
            return data.text;
        }
    });

})();