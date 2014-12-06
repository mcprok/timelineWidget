define('timeline/timelineService', function (require) {
    var alertsService = require('alerts/alertsService');
    var selectionService = require('timeline/selectionService');
    var newEventService = require('forms/newEventForm');
    var searchService = require('timeline/searchService');
    var viewSwitcher = require('../switcher');
    var timePointer = require('../timePointer');

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

    var canCreateGroup = function (groupName) {
        return !groupExists(groupName);
    };

    var groupExists = function (groupName) {
        if ($timeline == null) {
            return false;
        } else {
            return $timeline.groups.some(function (group) {
                if (group.content === groupName) {
                    return true;
                }
            });
        }
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