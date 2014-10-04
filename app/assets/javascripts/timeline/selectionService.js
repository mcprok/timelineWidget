define('timeline/selectionService',function (require) {
    var alertsService = require('alerts/alertsService');

    var selectCallback = function (timeline) {
        // TODO - Change the bootstrap popover for something else
        // or leave bootstrap but adjust styles for it. It could be good option. :)
        var sel = timeline.getSelection();
        if (sel.length) {
            if (sel[0].row != undefined) {
                var row = sel[0].row;
                var item = timeline.getItem(row);
                var elem = $('.timeline-event-content'); // element selected - probably can be done somehow different
                elem.popover( {
                    content: $('#popover_content_wrapper').html(),
                    placement: "top",
                    toogle: "popover",
                    html: true
                });
                console.log(elem);
            }
        }
    };

    return {
        selectCallback: selectCallback
    };
});