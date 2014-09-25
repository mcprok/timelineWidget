define('forms/loadEventsForm', function (require) {

    var timelineService = require('../timeline/timelineService');

    var $container = $('#addNewEvent');

    var init = function() {

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


    var addNewTimeline = function(data, groupName) {
        if ( !timelineService.canCreateGroup(groupName) ) {
            console.error('Cannot create a group - already exists: '+ groupName);
            return;
        }

        data.forEach(function(event) {
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

        $('body').find('.is-active').removeClass('is-active');
        $('#timelines').addClass('is-active');

        timeline = timelineService.createTimeline('timeline', data, options);


    };

    return {
        init: init
    };
});