define('timeline/timelineService', function (require) {
    
    var $ = require('jquery');

    var alertsService =         require('alerts/alertsService');
    var selectionService =      require('timeline/selectionService');
    var searchService =         require('timeline/searchService');
    var viewSwitcher =          require('switcher');


    var $timeline = null;
    var newEventId = 0;
    var timelineClass = require('timeline/timelineClass');
    var timelines = {};  //$container: $chaplingsTimelineObject


    var createTimeline = function (containerId, options) {
        var timeline = new timelineClass.Timeline(containerId, options);
        timelines[containerId] = timeline;
        return timeline;
    };

    var addNewEvent = function (event) {
        viewSwitcher.switchView($("#timelinesWrapper"));
        event.id = newEventId++;
        $timeline.addItem(event);
        alertsService.publishSuccessAlert('Event created: ' + event.content + ' on ' + event.start);
    };

    var getTimeline = function (containerId) {
        return timelines[containerId];
    };

    var onEventDelete = function () {
        var deletedEvent = $timeline.getItem($timeline.getSelection()[0].row);
        alertsService.publishInfoAlert('Event deleted: ' + deletedEvent.content);
    };

    var addEventHandler = function (type, callback) {
        if ($timeline == null || type == null || type.length > 0) {
            console.error('Cannot add on selection handler - no timeline or data provided');
        }
        links.events.addListener($timeline, type, callback);
    };


    var search = function (searchString) {
        return searchService.search(searchString, $timeline.items);
    };


    return {
        createTimeline: createTimeline,
//        addNewEvent: addNewEvent,
        getTimeline: getTimeline
//        addEventHandler: addEventHandler,
//        canCreateGroup: canCreateGroup,
//        search: search
    };

});