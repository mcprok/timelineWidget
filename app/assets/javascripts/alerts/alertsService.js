define('alerts/alertsService', function() {


    var newHtmlAlert = function(content, type) {
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

    var addNewInfoAlert = function(content) {
        addNewAlert(content, "info");
    };

    var addNewSuccessAlert = function(content) {
        addNewAlert(content, "success");
    };

    var addNewWarningAlert = function(content) {
        addNewAlert(content, "warning");
    };

    var addNewDangerAlert = function(content) {
        addNewAlert(content, "danger");
    };

    return {
        publishInfoAlert: addNewInfoAlert,
        publishSuccessAlert: addNewSuccessAlert,
        publishDangerAlert: addNewDangerAlert,
        publishWarningAlert: addNewWarningAlert
    };
});