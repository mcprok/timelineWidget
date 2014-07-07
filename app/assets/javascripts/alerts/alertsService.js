define('alerts/alertsService', function() {


    var newHtmlAlert = function(content, type) {
        // types availables: success, info, warning , danger
        var alertType;
        if ( type == null) {
            alertType = "info"
        } else {
            alertType = type;
        }

        return '<div class="alert alert-'+alertType+' alert-dismissible" role="alert">'+
            '<button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>' +
            content+'</div>';

    };

    var addNewAlert = function(content, type) {
        var container = $('#alerts');

        container.append(newHtmlAlert(content, type));
    };


    return {
        publishAlert: addNewAlert
    };
});