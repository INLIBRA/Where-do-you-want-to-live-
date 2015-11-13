
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');
    var $street = $('#street');
    var $city = $('#city');
    var street = $street.val();
    var city = $city.val();
    var address = street + ', ' + city;

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview
    $greeting.text('So, you want to live at ' + address + '?');
    var imgUrl = 'http://maps.googleapis.com/maps/api/streetview?size=600x400&location=' + address + '';
    $body.append('<img class="bgimg" src="' + imgUrl + '">');

    // load relevant articles about a city
    var artUrl = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + city + '&sort=newest&api-key=395bff46bf9fac2c3cb017ebb736ddb5:18:73395231';
    $.getJSON(artUrl, function(data) {
        $nytHeaderElem.text('New York Times article about ' + city);
        var articles = data.response.docs;
        
        for (var i = 0; i < articles.length; i++) {
            var article = articles[i];
            $nytElem.append('<li class = "article">' + '<a href="'+ article.artUrl + '">' + 
                article.headline.main + '</a>' +
                '<p>' + article.snippet + '</p>' + '</li>');
        }
    }).error(function(e){
        $nytHeaderElem.text("Sorry this is an error");
    });

    // load wiki articles about the city
    var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + city +
    '&format=json&callback=wikiCallback';

    var wikiRequestTimeout = setTimeout(function(){
        $wikiElem.text("Failed to get wikipedia response");
    }, 8000);

    $.ajax({
        url: wikiUrl,
        dataType : "jsonp",
        success : function(response) {
            console.log(response);
            var articleList = response[1];
            for (var i = 0; i < articleList.length; i++) {
                var artcl = articleList[i];
                var url = 'http://en.wikipedia.org/wiki/' + artcl;
                $wikiElem.append('<li><a href="' + url + '">' + artcl + '</a></li>');
            };

            clearTimeout(wikiRequestTimeout);
        }
    });

    return false;
};

$('#form-container').submit(loadData);
