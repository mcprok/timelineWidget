define('timeline/timelineService', [], function() {

    var timeline = null;
    var newEventId = 0;

    var createTimeline = function(containerId, data, options) {
        var container = $('#'+containerId)[0];

        timeline = new links.Timeline(container);
        timeline.draw(data, options)

        newEventId = data.length;

        return timeline;
    }

    var addNewEvent = function(event) {
        event.id = newEventId;
        newEventId++;
        timeline.addItem(event);
    }

    var getTimeline = function() {
        return timeline;
    }

    return {
        createTimeline: createTimeline,
        addNewEvent: addNewEvent,
        getTimeline: getTimeline
    };

});