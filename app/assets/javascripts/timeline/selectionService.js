define('timeline/selectionService',function (require) {

    var $ = require('jquery');
    var alertsService = require('alerts/alertsService');

    var selectCallback = function (timeline) {

        var sel = timeline.getSelection();
        if (sel.length) {
            if (sel[0].row != undefined) {
                var row = sel[0].row;
                var item = timeline.getItem(row);

                $('#event-title').find('> .event-content').text(item.content);

                var $eventData = $('#modal-event-data');
                $eventData.find('.event-start > .event-content').text(item.start);
                $eventData.find('.event-end > .event-content').text(item.end);
                $eventData.find('.event-location > .event-content').text(item.location);
                $eventData.find('.event-location > .geo-x').text(item.geo[0]);
                $eventData.find('.event-location > .geo-y').text(item.geo[1]);
                $eventData.find('.event-description > .event-content').text(item.description);

                $('#detailsModal').modal({
                    "backdrop": "static"
                });
            }
        }
    };

    return {
        selectCallback: selectCallback
    };
});