require.config({
    baseUrl: 'js',
    paths: {
        // the left side is the module ID,
        // the right side is the path to
        // the jQuery file, relative to baseUrl.
        // Also, the path should NOT include
        // the '.js' file extension. This example
        // is using jQuery 1.9.0 located at
        // js/lib/jquery-1.9.0.js, relative to
        // the HTML page.
        jquery: 'jquery-2.1.3.min'
    }
});

var gameState;

function InitGame()
{

    var elm = document.getElementById('svg-map').contentDocument;

    var mapsvgdoc = null;

    try {
        mapsvgdoc = elm.contentDocument;
    }
    catch (e) {
        mapsvgdoc = elm.getSVGDocument();
    }

    var myCountryId = 'moje_zeme';
    var countryIds = new Array();
    var countries = new Array();
    var managers = new Array();

    for (var i = 1; i < 10; i++) {
        var id = 'zeme' + i;
        countryIds.push(id);
        var element = elm.getElementById(id);

        if (!element)
        {
            throw new Error("country with id " + id + " not found");
        }

        var newCountry = new Country(element);
        var newManager = new CountryManager(newCountry, element);
        countries.push(newCountry);
        managers.push(newManager);

        element.country = newCountry;

    }

    managers.map(function (manager) {
        manager.svgElement.addEventListener("mousedown", function () {
            manager.onClick();
        });
    });

    gameState = new GameState(countries);

    //elm.addEventListener("mousedown", function() {gameState.turnEnd();});

    // add dummy scrolling text


    //elm.$("#tspan8647").text("hello");

    elm.getElementById("tspan8647").textContent = "99999";
    
    console.log("window loaded");

}

require(['jquery', 'Country', 'CountryManager', 'GameState', 'xbMarquee'],
        function ($, Country, CountryManager, GameState) {
            InitGame();
        });