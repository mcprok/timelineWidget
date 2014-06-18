define('timeline/timelineService', [], function() {

    console.log('timelineService loaded');

    var timeline = null;
    var newEventId = 0;

    var createTimeline = function(containerId, data, options) {
        var container = $('#'+containerId)[0];

        timeline = new links.Timeline(container);
        timeline.draw(data, options)

        newEventId = data.length;

        return timeline;
    }

    var addEventToTimeline = function(event) {
        event.id = newEventId;
        newEventId++;
//        timeline.addItem(event); // TODO aply when changed to links
    }

    var getTimeline = function() {
        return timeline;
    }

    return {
        createTimeline: createTimeline,
        addEventToTimeline: addEventToTimeline
    };

});