requirejs.config({

    baseUrl: 'assets/javascripts/',
    paths: {
        jquery : 'libs/jquery-1.9.0.min',
        lodash : 'libs/lodash'
    }

});

requirejs(['assets/javascripts/timeline/timelineService']);