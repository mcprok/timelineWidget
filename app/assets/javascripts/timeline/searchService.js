define("timeline/searchService", function() {

    var search = function(searchString, items) {
        var searchResults = [];
        for ( var i = 0 ; i < items.length ; i++ ) {
            var item  = items[i];
            if ( item.content.toLowerCase().indexOf(searchString.toLowerCase()) > -1) {
                searchResults.push(item);
            }
        }

        console.log(searchResults);
        return searchResults;
    };


    var show = function() {
        $('#searchForm').show();
    };

    var hide = function() {
        $('#searchForm').hide();
    };

    return {
        search: search,
        show: show,
        hide: hide
    }

});