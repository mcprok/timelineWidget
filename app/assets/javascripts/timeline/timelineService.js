define('timeline/timelineService',function (require) {
    var alertsService = require('alerts/alertsService');
    var selectionService = require('timeline/selectionService');
    var newEventService = require('forms/newEventForm');
    var searchService = require('timeline/searchService');
    var viewSwitcher = require('../switcher');
    var timePointer = require('../timePointer');

    var $timeline = null;
    var newEventId = 0;

    var hiddenGroups = {};

    var pointer;
    var createTimeline = function (containerId, data, options) {

        var container = $('#' + containerId)[0];
        if ($timeline == null) {
            $timeline = new links.Timeline(container);
            $timeline.draw(data, options);
            pointer = new timePointer.Pointer($timeline);



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

    var hideGroup = function (groupName) {
        var items = $timeline.items;

        var remaining = [];
        var toHide = [];

        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (item.group.content != groupName) {
                remaining.push(item);
            } else {
                toHide.push(item);
            }
        }

        var newGroups = [];
        _.forEach($timeline.groups, function(group) {
            console.log(group);
           if ( group.content != groupName ) {
               newGroups.push(group);
           }
        });
        $timeline.groups = newGroups;
//        delete $timeline.groups[1];
        hiddenGroups[groupName] = toHide;

        _.forEach(remaining, function(event) {
           event.group = event.group.content;
        });

        $timeline.setData(remaining);
        $timeline.repaintGroups();
        console.log(remaining);
        $timeline.redraw();
    };

    var showGroup = function (groupName) {
        if (hiddenGroups.hasOwnProperty(groupName)) {
            var newElements = hiddenGroups[groupName];
            _.forEach(newElements, function(event) {
               event.group = groupName;
            });
            $timeline.addItems(newElements);
            $timeline.redraw();
        } else {
            console.log('Hidden group doesnt not exist: ' + groupName);
        }
    };

    var deleteGroup = function (groupName) {
        console.log($timeline);

        var items = $timeline.items;

        var remaining = [];
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (item.group.content != groupName) {
                remaining.push(item);
            }
        }

        delete $timeline.groups[0];

        $timeline.setData(remaining);
        console.log(remaining);

        $timeline.redraw();
        console.log($timeline);
    }

    return {
        createTimeline: createTimeline,
        addNewEvent: addNewEvent,
        getTimeline: getTimeline,
        addEventHandler: addEventHandler,
        canCreateGroup: canCreateGroup,
        search: search,
        deleteGroup: deleteGroup,
        showGroup: showGroup,
        hideGroup: hideGroup
    };

});