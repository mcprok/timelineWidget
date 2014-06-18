define('forms/newEventForm', [], function() {

    console.log('newEventForm loaded')

    var getDateFromInputs = function(datepickerId, timepickerId) {
        var datepickerValue =  $('#'+datepickerId).datepicker('getDate');
        var timepickerValue = $('#'+timepickerId).data("timepicker").getTime( ).split(':');
        var newEventTimeHours = parseInt(timepickerValue[0]);
        var newEventTimeMinutes = parseInt(timepickerValue[1]);
        datepickerValue.set({ minute: newEventTimeMinutes, hour: newEventTimeHours});
        return datepickerValue;
    };

    var addNewEventToTimeLineDataSet = function(dataSet, event) {
        dataSet.add(event);
    };

    var addNewEventFormOnSubmit = function(formId) {
        $('#'+formId).submit( function(e) {
            e.preventDefault( );

            console.log('Adding new event:')
            var newEventStartDate = getDateFromInputs('newEventStartDate','newEventStartTime');
            console.log(newEventStartDate)

            var newEvent = {
                id: 100000,
                start: newEventStartDate,
                content: $('#contentInput').val(),
                description: $('#descriptionInput').val()
            };

            if ($('#newEventEndDateOn').is(':checked')) {
                newEvent.end = getDateFromInputs('newEventEndDate','newEventEndTime');
            }

            console.log(newEvent)
            addNewEventToTimeLineDataSet(visDataSet, newEvent)
        });
    }
    return {
        addNewEventFormOnSubmit: addNewEventFormOnSubmit
    };

});