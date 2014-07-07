define('timeline/timelineService',['alerts/alertsService'], function(alertsService) {

    var timeline = null;
    var newEventId = 0;

    var createTimeline = function(containerId, data, options) {
        var container = $('#'+containerId)[0];

        timeline = new links.Timeline(container);
        timeline.draw(data, options);

        newEventId = data.length;

        //listeners
        links.events.addListener(timeline, 'delete', onEventDelete);
        alertsService.publishAlert('Timeline created!','info');

        return timeline;
    };

    var addNewEvent = function(event) {
        event.id = newEventId;
        newEventId++;
        timeline.addItem(event);
        alertsService.publishAlert('Event created: '+event.content +' on '+ event.start,'success');
    };

    var getTimeline = function() {
        return timeline;
    };

    var onEventDelete = function(newEvent) {
        console.log('selectedROw:')
        console.log(timeline);
        console.log('onEventDelete');
        console.log(newEvent);
        console.log(timeline.getSelection()[0].row)
//        for ( var i = 0 ; i< timeline.getData().length ; i++) {
//            console.log(timeline.getData()[i])
//        }
        console.log(timeline.getItem(timeline.getSelection()[0].row));
    };

    return {
        createTimeline: createTimeline,
        addNewEvent: addNewEvent,
        getTimeline: getTimeline
    };

});