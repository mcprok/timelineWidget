define('forms/loadEventsForm', function (require) {

    var timelineService = require('../timeline/timelineService');
    var viewSwitcher = require('../switcher');

    var newEventForm = require('forms/newEventForm');

    var timeline = null;

    var init = function () {
        viewSwitcher.init();
        $('#eventsLoadingForm').on('submit', function (e) {
            e.preventDefault();

            var data = new FormData(e.currentTarget);

            $.ajax({
                type: 'POST',
                url: 'http://localhost:9000/upload',
                data: data,
                cache: false,
                contentType: false,
                processData: false
            }).done(function (data) {
                var preparedData = prepareEventData($.parseJSON(data).events);
                var group = $('#fileUploadGroup').val();

                addNewTimeline(preparedData, group);
            }).fail(function (jqXHR, status, errorThrown) {

                console.log(errorThrown);
                console.log(jqXHR.responseText);
                console.log(jqXHR.status);
            });
        });
    };

    var prepareEventData = function (events) {
        var resultDataSet = [];
        for (var i = 0; i < events.length; i++) {
            var event = {
                start: new Date(events[i].startTime),
                end: new Date(events[i].endTime),
                content: events[i].summary,
                location: events[i].location,
                description: events[i].description,
                geo: events[i].geo
            };
            resultDataSet.push(event)
        }
        return resultDataSet;
    };


    var addNewTimeline = function (data, groupName) {

        data.forEach(function (event) {
            event.group = groupName;
        });

        var options = {
            editable: true,
            width: '100%',
            cluster: true,
            showMajorLabels: false,
            axisOnTop: false,
            groupsChangeable: true,
            groupMinHeight: 150,
            groupsOnRight: false,
            style: "dot"
        };

        viewSwitcher.switchView($("#timelinesWrapper"));

        if (timeline == null) {
            timeline = timelineService.createTimeline('timeline', options);
            timeline.onGroupCreated(function (groupName, $group, $container) {
                $('#groupSelect').append('<option value="">' + groupName + '</option>');
                console.log($container);
                var containerLeftPart = $container.find('.timeline-groups-axis > .timeline-axis-grid')[0];
                console.log(containerLeftPart);

//                containerLeftPart.append('asdasdasdasd') //  TODO
            });

            var newEventCallback = function (event, groupName) {
                timeline.addEvent(event, groupName);

            };

            newEventForm.addNewEventSubmitHandler(newEventCallback)
        }


        timeline.createGroup(groupName, data);
    };

    return {
        init: init
    };
});