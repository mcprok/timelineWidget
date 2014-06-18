define('forms/loadEventsForm', function () {

    console.log('loadEventsForm loaded')

    var prepareEventData = function (json) {
        var resultDataSet = new vis.DataSet();
        var events = json.events;
        for (var i = 0; i < events.length; i++) {
            var event = {
                start: new Date(events[i].startTime),
                end: new Date(events[i].endTime),
                content: events[i].summary,
                location: events[i].location,
                description: events[i].description,
                geo: events[i].geo
            };
            resultDataSet.add(event)
        }
        return resultDataSet;
    };

    var attachForm = function (successCallback, errorCallback) {
        $('#eventsLoadingForm').submit(function (e) {
            e.preventDefault();
            var data = new FormData($(this)[0]);
            $.ajax({
                type: 'POST',
                url: 'http://localhost:9000/upload',
                data: data,
                cache: false,
                contentType: false,
                processData: false
            }).done(function (data) {

                var preparedData = prepareEventData($.parseJSON(data));

                if (successCallback) {
                    successCallback(preparedData);
                }

            }).fail(function (jqXHR, status, errorThrown) {
                console.log(errorThrown);
                console.log(jqXHR.responseText);
                console.log(jqXHR.status);
                if (errorCallback) {
                    errorCallback();
                }
            });
        });
    }

    return {
        attachForm: attachForm
    };

});