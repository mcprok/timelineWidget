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

    var addNewEventFormOnSubmit = function(formId, callback) {
        $('#'+formId).submit( function(e) {
            e.preventDefault( );

            console.log('Adding new event:')
            var newEventStartDate = getDateFromInputs('newEventStartDate','newEventStartTime');
            console.log(newEventStartDate)

            var newEvent = {
                start: newEventStartDate,
                content: $('#contentInput').val(),
                description: $('#descriptionInput').val()
            };

            if ($('#newEventEndDateOn').is(':checked')) {
                newEvent.end = getDateFromInputs('newEventEndDate','newEventEndTime');
            }

            if ( callback ) {
                callback(newEvent);
            }
        });
    }
    return {
        addNewEventFormOnSubmit: addNewEventFormOnSubmit
    };

});