//require.config({
//    baseUrl: 'js',
//    paths: {
//        // the left side is the module ID,
//        // the right side is the path to
//        // the jQuery file, relative to baseUrl.
//        // Also, the path should NOT include
//        // the '.js' file extension. This example
//        // is using jQuery 1.9.0 located at
//        // js/lib/jquery-1.9.0.js, relative to
//        // the HTML page.
//        jquery: 'jquery-2.1.3.min'
//    }
//});

var gameState;
var managers;
var moneyElement;
var myCountryId;
var countryIds;
var countries;
var managers;

function UpdateVisual()
{
        managers.forEach(function (m) {
            m.updateVisual();
        });
        
       // moneyElement.text(gameState.money);    
}

function InitGame()
{

    var elm = document.getElementById('svg-map').contentDocument;

    var svgMenu = Snap('#svg-nav');
    var svgMap = Snap('#svg-map');

    var mapsvgdoc = null;

    try {
        mapsvgdoc = elm.contentDocument;
    }
    catch (e) {
        mapsvgdoc = elm.getSVGDocument();
    }

    myCountryId = 'moje_zeme';
    countryIds = new Array();
    countries = new Array();
    managers = new Array();

    for (var i = 1; i < 10; i++) {
        var id = 'zeme' + i;
        countryIds.push(id);
        var element = elm.getElementById(id);



        if (!element)
        {
            throw new Error("country with id " + id + " not found");
        }

        var modifNames = ['tv', 'radio', 'noviny', 'net'];

        for (var j = 0; j < modifNames.length; j++) {
            var tvId = id + "_" + modifNames[j];
            var svgTv = svgMap.select("#" + tvId);

            if (!svgTv) {
                console.log('missing:' + tvId);
            } else {

                svgTv.attr({display: 'none'});
            }
        }


        var newCountry = new Country(element);
        var newManager = new CountryManager(newCountry, element);
        countries.push(newCountry);
        managers.push(newManager);

        element.country = newCountry;

    }

    countryData = [
        //1 
        {neighbours: [2, 6], neighboursPlayer: true, popSize: new PopVector(15, 10), popularity: new PopVector(0.10, 0.10)},
        {neighbours: [1, 3, 6, 7], neighboursPlayer: true, popSize: new PopVector(5, 4), popularity: new PopVector(0.20, 0.08)},
        {neighbours: [2, 8, 7], neighboursPlayer: true, popSize: new PopVector(4, 7), popularity: new PopVector(0.05, 0.23)},
        //4
        {neighbours: [5, 6], neighboursPlayer: false, popSize: new PopVector(3, 7), popularity: new PopVector(0.60, 0.55)},
        {neighbours: [4, 6], neighboursPlayer: false, popSize: new PopVector(5, 2), popularity: new PopVector(0.40, 0.55)},
        {neighbours: [4, 5, 1, 2, 7], neighboursPlayer: false, popSize: new PopVector(25, 16), popularity: new PopVector(0.50, 0.45)},
        //7
        {neighbours: [6, 2, 3, 8, 9], neighboursPlayer: false, popSize: new PopVector(12, 3), popularity: new PopVector(0.40, 0.30)},
        {neighbours: [7, 3], neighboursPlayer: false, popSize: new PopVector(2, 9), popularity: new PopVector(0.20, 0.60)},
        {neighbours: [7], neighboursPlayer: false, popSize: new PopVector(14, 2), popularity: new PopVector(0.60, 0.50)}
    ];
    for (var i = 0; i < countryData.length; i++) {
        countries[i].neighboursPlayer = countryData[i].neighboursPlayer;
        for (var j = 0; j < countryData[i].neighbours.length; j++)
        {
            countries[i].neighbouringCountries.push[countries[j]];
        }
        countries[i].populationSize = countryData[i].popSize;
        countries[i].popularity = countryData[i].popularity;
        countries[i].id = i + 1;
    }

    managers.forEach(function (manager) {
        manager.svgElement.addEventListener("mousedown", function () {
            manager.onClick();
            updateMenu(manager.country, manager.svgElement);
        });
    });


    function updateMenu(country, element) {

        console.log('updating menu' + country);
        $(svgMenu.select('#popularity-old tspan').node).text(Math.round(country.popularity.old * 100) + '%');
        $(svgMenu.select('#popularity-young tspan').node).text(Math.round(country.popularity.young * 100) + '%');

        svgMenu.select('#pomer_happy_mlady').animate({width: country.popularity.young * 193}, 500);
        svgMenu.select('#pomer_happy_stary').animate({width: country.popularity.old * 193}, 500);
    }




    gameState = new GameState(countries);

    //moneyElement = $(svgMenu.select('#suma_text tspan').node);

    UpdateVisual();

    elm.getElementById("next_button").addEventListener("mousedown", function () {

        console.log('next clicked');

        var effect = gameState.getTurnEndEffect();

        if ((gameState.money + effect.money) < 0) {

            alert('You have no money');
            return;
        }

        gameState.turnEnd();
        UpdateVisual();
    });



    // scrolling text

    var scrollText = document.getElementById('news-scrolling');

    tween = TweenMax.to(scrollText, 5.5, {left: "650px", repeat: 100, yoyo: false, onRepeat: onRepeat, repeatDelay: 3.0, ease: Linear.easeInOut});
    var count = 0;
    function onRepeat() {
        count++;

        $('#news-scrolling').text('hello ' + count);
    }

    console.log("window loaded");

}

InitGame();

//require(['jquery', 'Country', 'CountryManager', 'GameState', 'xbMarquee', 'snap.svg-min'],
//        function ($, Country, CountryManager, GameState) {
//            InitGame();
//        });
