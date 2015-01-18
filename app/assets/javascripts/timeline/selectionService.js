define('timeline/selectionService', function (require) {

    var alertsService = require('alerts/alertsService');

    var selectCallback = function (timelineClass) {
            var timeline = timelineClass.$timeline;
            var sel = timeline.getSelection();
            if (sel.length) {
                if (sel[0].row != undefined) {
                    var row = sel[0].row;
                    var item = timeline.getItem(row);

                    $('#event-title').find('> .event-content').text(item.content);

                    var $eventData = $('#modal-event-data');
                    $eventData.find('.event-start > .event-content').text(formattedString(item.start));
                    $eventData.find('.event-end > .event-content').text(formattedString(item.end));
                    $eventData.find('.event-location > .event-content').text(item.location);
                    if (item.hasOwnProperty("geo")) {
                        $eventData.find('.event-location > .geo-x').text(item.geo[0]);
                        $eventData.find('.event-location > .geo-y').text(item.geo[1]);
                    }
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