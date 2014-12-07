define('timeline/timelineService', function (require) {

    var $ = require('jquery');

    var alertsService =         require('alerts/alertsService');
    var selectionService =      require('timeline/selectionService');
    var searchService =         require('timeline/searchService');
    var newEventService =       require('forms/newEventForm');
    var viewSwitcher =          require('switcher');
    var timePointer =           require('timePointer');

    var $timeline = null;
    var newEventId = 0;

    var createTimeline = function (containerId, data, options) {

        var container = $('#' + containerId)[0];
        if ($timeline == null) {
            $timeline = new links.Timeline(container);
            $timeline.draw(data, options);
            timePointer.init($timeline);

        } else {
            $timeline.addItems(data);
            $timeline.redraw();
        }

        newEventId += data.length;

        links.events.addListener($timeline, 'delete', onEventDelete);
        alertsService.publishInfoAlert('Timeline created!');

        links.events.addListener($timeline, 'select', function () {
            selectionService.selectCallback($timeline)
        });

        newEventService.updateGroups($timeline.groups);

        return $timeline;
    };

    var addNewEvent = function (event) {
        viewSwitcher.switchView($("#timelinesWrapper"));
        event.id = newEventId++;
        $timeline.addItem(event);
        alertsService.publishSuccessAlert('Event created: ' + event.content + ' on ' + event.start);
    };

    var getTimeline = function () {
        return $timeline;
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
        addNewEvent: addNewEvent,
        getTimeline: getTimeline,
        addEventHandler: addEventHandler,
        canCreateGroup: canCreateGroup,
        search: search
    };

});