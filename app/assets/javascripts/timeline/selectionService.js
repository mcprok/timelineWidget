define('timeline/selectionService',function (require) {
    var alertsService = require('alerts/alertsService');

    var selectCallback = function (timeline) {
        // TODO - Change the bootstrap popover for something else
        var sel = timeline.getSelection();
        if (sel.length) {
            if (sel[0].row != undefined) {
                var row = sel[0].row;
                var item = timeline.getItem(row);
                var elem = $('.timeline-event-content:contains('+item.content+')'); // element selected - probably can be done somehow different
                elem.popover( {
                    content: "asdasasdasdasd",
                    placement: "top",
                    toogle: "popover"
                });
                console.log(elem);
            }
        }
    };

    return {
        selectCallback: selectCallback
    };
});