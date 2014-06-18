define(function () {

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

    var attachForm = function (successCallback, errorCallback) {
        $('#eventsLoadingForm').submit(function (e) {
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
    };

    return {
        attachForm: attachForm
    };
});