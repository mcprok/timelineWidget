define("timeline/searchService", function() {


    var search = function(searchString, items) {
        var searchResults = [];
        for ( var i = 0 ; i < items.length ; i++ ) {
            var item  = items[i];
            if ( item.content.toLowerCase().indexOf(searchString.toLowerCase()) > -1) {
                searchResults.push(item);
            }
        }
        var $searchResults = $('#searchResults');
        $searchResults.html("");
        _.each(searchResults, function(item) {
            $searchResults.append($('<span>'+ item.content+ '</span><br>'));
        });
        console.log(searchResults);
        return searchResults;
    };

    return {
        search: search
    }

});