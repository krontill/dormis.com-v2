'use strict';

/*
    This file can be used as entry point for webpack!
 */

$(document).ajaxStart(
    function()
    {
        // Here we can block other executing of ajax or create overlay
        console.log("Ajax started");
    }
);

$(document).ajaxComplete(
    function()
    {
        console.log("Ajax ended");
    }
);