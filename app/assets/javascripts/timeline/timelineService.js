define('timeline/timelineService', ['alerts/alertsService'], function (alertsService) {

    var timeline = null;
    var newEventId = 0;

    var createTimeline = function (containerId, data, options) {

        var container = $('#' + containerId)[0];

        timeline = new links.Timeline(container);
        timeline.draw(data, options);

        newEventId = data.length;

        links.events.addListener(timeline, 'delete', onEventDelete);
        alertsService.publishInfoAlert('Timeline created!');

        return timeline;
    };

    var addNewEvent = function (event) {

        event.id = newEventId++;
        timeline.addItem(event);
        alertsService.publishSuccessAlert('Event created: ' + event.content + ' on ' + event.start);
    };

    var getTimeline = function () {
        return timeline;
    };

    var onEventDelete = function () {
        var deletedEvent = timeline.getItem(timeline.getSelection()[0].row)
        alertsService.publishInfoAlert('Event deleted: ' + deletedEvent.content);
    };

    return {
        createTimeline: createTimeline,
        addNewEvent: addNewEvent,
        getTimeline: getTimeline
    };

});