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
var svgMenu;
var svgMap;

var myCountryId;
var countryIds;
var countries;
var managers;

var selectedCountry;
var selectedCountryManager;
var infoTableWrapper;
var infoTableContent;

var dialogBox;
var selectedModifier;

var monthLeftElement;
var supportingCountriesElement;
var moneyElement;
var spendingElement;
var incomeElement;

function UpdateVisual()
{
    managers.forEach(function (m) {
        m.updateVisual();
    });

    moneyElement.text(gameState.money);
    incomeElement.text(gameState.incomePerTurn);
    var turnEndEffect = gameState.getTurnEndEffect(); 
    spendingElement.text(-(turnEndEffect.money - gameState.incomePerTurn));
    
    supportingCountriesElement.text(gameState.getSupportingCountries().length + '/' + gameState.countries.length);
    monthLeftElement.text(gameState.turnsLeft);

    countries.forEach(function (country) {
        country.modifiers.forEach(function (modif) {

            elementEnabled(modif.enabled, svgMap.select(modif.elementId));

        });
    });
    
    
}

function DisplayEventInfo(title, text, buttons)
{
    var html = '<h2 id="dialogTitle">' + title + '</h2><div id="dialogText">' + text + "</div>";
    dialogBox.innerHTML = html;
    if (buttons)
    {
        var buttonContainer = $.parseHTML('<div id="dialogButtonContainer"></div>')[0];
        buttons.forEach(function (b)
        {
            var newButton = $.parseHTML('<button class="dialogButton" type="button">' + b.name + '</button>')[0];
            newButton.addEventListener("click", b.func);
            $(buttonContainer).append(newButton);
        });
    }
    $(dialogBox).append(buttonContainer);
    $(dialogBox).css("display", "block");
    $("#inactiveOverlay").css("display", "block");
}

function HideEventInfo()
{
    $(dialogBox).css("display", "none");
    $("#inactiveOverlay").css("display", "none");
}

function elementEnabled(enabled, element) {
    if (enabled) {
        element.attr({display: ''});
    } else {

        element.attr({display: 'none'});
    }
}

function PopVectorCells(popVector, percent)
{
    var valYoung, valOld;
    if (percent)
    {
        valYoung = Math.round(popVector.young * 100) + '%';
        valOld = Math.round(popVector.old * 100) + '%';
    }
    else
    {
        valYoung = Math.round(popVector.young * 100) / 100;
        valOld = Math.round(popVector.old * 100) / 100;
    }
    return '<td class="numberColumn">' + valYoung +
            '</td><td class="numberColumn">' + valOld +
            '</td>';
}

function CreateTableForCountry(country)
{
    var table = '<table><thead><tr><th colspan="3">Influence - ' + country.name + '</th></tr>\n\
        <tr><th>Source</th><th><img src="assets/young.png" alt="Young"></th><th><img src="assets/old.png" alt="Old"></th></tr>\n\
        </thead><tbody>';
    var effect = country.getTurnEndCountryEffect();

    effect.positiveInfluence.forEach(function (influence) {
        table += '<tr class="positive"><td class="sourceColumn">' + influence.source +
                '</td>' + PopVectorCells(influence.amount) + '</tr>';
    });

    effect.negativeInfluence.forEach(function (influence) {
        table += '<tr class="negative"><td class="sourceColumn">' + influence.source +
                '</td>' + PopVectorCells(influence.amount.multiply(-1)) + '</tr>';
    });

    table += '<tr class="total"><td>Total</td>' + PopVectorCells(effect.influence) + '</tr>';
    table += '<tr class="previous"><td>Previous turn</td>' + PopVectorCells(country.lastTurnEffect.influence) + '</tr>';

    table += '<tr class="popularity"><td>Expected popularity change</td>' + PopVectorCells(effect.popularityEffect) + '</tr>';

    return table + '</tbody></table>';
}

function CreateTableForBudget(effect)
{
    var table = '<table><thead><tr><th colspan="2">Myland Propaganda Budget</th></tr>\n\
        </thead><tbody>';

    var effect = gameState.getTurnEndEffect();

    effect.incomeData.forEach(function (income) {
        table += '<tr class="positive"><td class="sourceColumn">' + income.source +
                '</td><td class="numberColumn">' + income.amount + '</td></tr>';

    });

    effect.spendingData.forEach(function (spending) {
        table += '<tr class="negative"><td class="sourceColumn">' + spending.source +
                '</td><td class="numberColumn">' + (-spending.amount) + '</td></tr>';
    });

    table += '<tr class="total"><td>Total</td><td>' + effect.money + '</td></tr>';

    return table + '</tbody></table>';
}

function ShowRandomMessage()
{
    var messages = gameState.getCandidateMessages();
    var msgIndex = Math.floor(Math.random() * messages.length * 1024) >> 10;
    var messageToShow = messages[msgIndex];

    $('#news-scrolling').text(messageToShow);

}

function CreateStatChangeVisualisation(change, anchorId, parent, timeline, unit)
{
    var containerClientRect = parent.getBoundingClientRect();
    var svgAnchor = svgMap.select(anchorId).node;
    var svgClientRect = svgAnchor.getBoundingClientRect();
    var initialTop = ((svgClientRect.top + svgClientRect.bottom) / 2 ) - containerClientRect.top + 5;
    var initialLeft = ((svgClientRect.left + svgClientRect.right) / 2 ) - containerClientRect.left - 10;


    if(change > 0)
    {
        change = '+' + change;
    }

    var newElement = $.parseHTML('<div class="statsChange">' +  change + unit + '</div>');
    if(change > 0)
    {
        change = '+' + change;
        $(newElement).addClass('positive');
    }
    else if (change < 0)
    {
        $(newElement).addClass('negative');                    
    }
    
    //multiple shadows to create outline
    var numShadows = 10;
    var shadowCss = '';
    var shadowWidth = 2;
    for(var i = 0; i < numShadows; i++)
    {
        var angle = (i / numShadows) * Math.PI * 2;        
        var x = Math.cos(angle) * shadowWidth;
        var y = Math.sin(angle) * shadowWidth;
        if( i > 0)
        {
            shadowCss += ',';
        }
        shadowCss += x + 'px ' + y + 'px 0 black'; 
    }
    
    $(newElement).css({display :"block", position: "absolute", top: initialTop, left : initialLeft});
    $(newElement).css("text-shadow", shadowCss);

    
    $(parent).append(newElement);

    timeline.add(TweenMax.to(newElement, 2, 
    {top : initialTop - 50, alpha : 0, onCompleteParams: [newElement], 
        onComplete : function(elem) {$(elem).remove()} }
                ), 1);    
}


function ResetGameState()
{
    //neighbours are 1-based indices (as in map)
    countryData = [
        //1 
        {name: 'Crystallville', neighbours: [2, 6], neighboursPlayer: true, popSize: new PopVector(15, 10), popularity: new PopVector(0.10, 0.10)},
        {name: 'Ironmist', neighbours: [1, 3, 6, 7], neighboursPlayer: true, popSize: new PopVector(5, 4), popularity: new PopVector(0.20, 0.08)},
        {name: 'Greyhill', neighbours: [2, 8, 7], neighboursPlayer: true, popSize: new PopVector(4, 7), popularity: new PopVector(0.05, 0.23)},
        //4
        {name: 'Southfalcon', neighbours: [5, 6], neighboursPlayer: false, popSize: new PopVector(3, 7), popularity: new PopVector(0.50, 0.45)},
        {name: 'Newby', neighbours: [4, 6], neighboursPlayer: false, popSize: new PopVector(5, 2), popularity: new PopVector(0.40, 0.55)},
        {name: 'Wywerbush', neighbours: [4, 5, 1, 2, 7], neighboursPlayer: false, popSize: new PopVector(25, 16), popularity: new PopVector(0.50, 0.45)},
        //7
        {name: 'Oldsummer', neighbours: [6, 2, 3, 8, 9], neighboursPlayer: false, popSize: new PopVector(12, 3), popularity: new PopVector(0.40, 0.30)},
        {name: 'Glassapple', neighbours: [7, 3], neighboursPlayer: false, popSize: new PopVector(2, 9), popularity: new PopVector(0.20, 0.50)},
        {name: 'Fairhall', neighbours: [7], neighboursPlayer: false, popSize: new PopVector(14, 2), popularity: new PopVector(0.45, 0.50)}
    ];
    for (var i = 0; i < countryData.length; i++) {
        countries[i].reset();
        countries[i].neighboursPlayer = countryData[i].neighboursPlayer;
        for (var j = 0; j < countryData[i].neighbours.length; j++)
        {
            countries[i].neighbouringCountries.push(countries[countryData[i].neighbours[j] - 1]);
        }
        countries[i].populationSize = countryData[i].popSize;
        countries[i].popularity = countryData[i].popularity;
        countries[i].lastTurnPopularity = countryData[i].popularity;
        countries[i].id = i + 1;
        countries[i].name = countryData[i].name;
    }

    gameState.reset();
}


function InitGame()
{


    $("#menu-nav-tooltip").hide();
    $("#menu-nav").hide();

    var elm = document.getElementById('svg-map');
    var elmNav = document.getElementById('svg-nav');

    svgMap = Snap('#svg-map');



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

        var newCountry = new Country(element);
        newCountry.elmId = id;


        var modifNames = ['tv', 'radio', 'net', 'noviny'];

        for (var j = 0; j < modifNames.length; j++) {
            var tvId = id + "_" + modifNames[j];
            var svgTv = svgMap.select("#" + tvId);

            if (!svgTv) {
                console.log('missing:' + tvId);
            } else {

                svgTv.attr({display: 'none'});
            }

            newCountry.modifiers[j].elementId = "#" + tvId;
        }



        var newManager = new CountryManager(newCountry, element);
        countries.push(newCountry);
        managers.push(newManager);

        element.country = newCountry;

    }

    svgMenu = Snap('#svg-nav');

    managers.forEach(function (manager) {
        manager.svgElement.addEventListener("mousedown", function () {
            selectedCountryManager = manager;
            $("#menu-nav").show(100, function () {

                svgMenu = Snap('#svg-nav');
                manager.onClick();
                updateMenu(manager.country, manager.svgElement);
                updateCountryStroke(manager.svgElement);

                $(svgMenu.select('#population-young').node).text(manager.country.populationSize.young + ' mil');
                $(svgMenu.select('#population-old').node).text(manager.country.populationSize.old + ' mil');


            });
        });
    });


    function updateCountryStroke(element) {

        managers.forEach(function (manager) {

            var strokeColor = "#FFFFFF";
            var snapCountryElm = Snap(manager.svgElement);

            if (manager.svgElement === element) {
                strokeColor = "#40E0D0";
            }

            snapCountryElm.attr({
                stroke: strokeColor,
                strokeWidth: 2,
            });

        });


    }

    function showChange(select, change)
    {
        var changeText = Math.round(change * 100) + '%';
        if(change > 0.01)
        {
            changeText = '+' + changeText;
        }
        $(svgMenu.select(select).node).text('Change: ' + changeText + '');        
    }

    function updateMenu(country, element) {

        console.log('updating menu' + country);
        $(svgMenu.select('#popularity-old tspan').node).text(Math.round(country.popularity.old * 100) + '%');
        $(svgMenu.select('#popularity-young tspan').node).text(Math.round(country.popularity.young * 100) + '%');
        $(svgMenu.select('#popularity-all tspan').node).text(Math.round(country.getOverallPopularity() * 100) + '%');

        showChange('#popularity-old-change tspan', country.lastTurnEffect.popularityEffect.old);
        showChange('#popularity-young-change tspan', country.lastTurnEffect.popularityEffect.young);
        showChange('#popularity-all-change tspan', country.lastTurnEffect.popularityEffect.old);

        svgMenu.select('#pomer_happy_stary').animate({width: country.popularity.old * 193}, 500);
        svgMenu.select('#pomer_happy_mlady').animate({width: country.popularity.young * 193}, 500);
        svgMenu.select('#pomer_happy_all').animate({width: country.getOverallPopularity() * 193}, 500);

        infoTableContent.innerHTML = CreateTableForCountry(country);
    }




    gameState = new GameState(countries);

    ResetGameState();

    moneyElement = $(svgMap.select('#suma_text tspan').node);
    spendingElement = $(svgMap.select('#suma_text-1 tspan').node);
    incomeElement = $(svgMap.select('#suma_text-0 tspan').node);


    monthLeftElement = $(svgMap.select('#suma_text-0-3 tspan').node);
    supportingCountriesElement = $(svgMap.select('#suma_text-1-3 tspan').node);
    

    infoTableWrapper = $.parseHTML('<div id="infoTableWrapper"><h3>Detailed info</h3></div>')[0];
    infoTableContent = $.parseHTML('<div id="infoTableContent"></div>')[0];
    $(infoTableWrapper).append(infoTableContent);
    $('#canvas').append(infoTableWrapper);

    dialogBox = $.parseHTML('<div id="dialogBox"></div>')[0];
    $(dialogBox).css("display", "none");
    $('#canvas').append(dialogBox);

    UpdateVisual();





    // own country clicked

    elm.getElementById('moje_zeme').addEventListener("mousedown", function () {

        infoTableContent.innerHTML = CreateTableForBudget(gameState.getTurnEndEffect());
        $("#menu-nav").hide();
        console.log('clicked own country');

    });

    //BUTTONS

    elmNav.getElementById('tv').addEventListener("mousedown", function () {

        var country = selectedCountryManager.country;

        var modifId = "#" + country.elmId + "_tv";

        var svgTv = svgMap.select(modifId);

        country.modifiers[country.tvIndex].elementId = modifId;

        showTooltip(country.modifiers[country.tvIndex], svgTv);

        // console.log('enable' + enabled + ' tv for ' + country.countryId);


    });

    elmNav.getElementById('radio').addEventListener("mousedown", function () {

        var country = selectedCountryManager.country;

        var modifId = "#" + country.elmId + "_radio";

        var svgTv = svgMap.select(modifId);

        country.modifiers[country.radioIndex].elementId = modifId;

        showTooltip(country.modifiers[country.radioIndex], svgTv);
        // console.log('enable' + enabled + ' radio for ' + country.countryId);

    });

    elmNav.getElementById('noviny').addEventListener("mousedown", function () {

        var country = selectedCountryManager.country;

        var modifId = "#" + country.elmId + "_noviny";

        var svgTv = svgMap.select(modifId);

        country.modifiers[country.newspaperIndex].elementId = modifId;

        showTooltip(country.modifiers[country.newspaperIndex], svgTv);

        //  console.log('enable' + enabled + ' tv for ' + country.countryId);
    });

    elmNav.getElementById('net').addEventListener("mousedown", function () {


        var country = selectedCountryManager.country;

        var modifId = "#" + country.elmId + "_net";

        var svgTv = svgMap.select(modifId);

        country.modifiers[country.webIndex].elementId = modifId;

        showTooltip(country.modifiers[country.webIndex], svgTv);

        //  console.log('enable' + enabled + ' net for ' + country.countryId);

    });



    function showTooltip(modifier, element) {
        console.log('showing tooltip');
        $("#menu-nav-tooltip").show();

        $("#tooltip-name").text(modifier.nameLong); // + ' in ' + modifier.country.name);
        $("#tooltip-price").text(modifier.enabled ? "Owned" : modifier.cost.toString());
        $("#tooltip-price-turn").text(modifier.upkeep);

        selectedModifier = modifier;

        if (modifier.enabled) {
            $("#tooltip-buy").text('Shutdown');
        } else {
            $("#tooltip-buy").text('Buy');
        }
    }

    $("#tooltip-dismiss").click(function () {

        $("#menu-nav-tooltip").hide();

    });

    $("#tooltip-buy").click(function () {




        $("#menu-nav-tooltip").hide();

        selectedModifier.enabled = !selectedModifier.enabled;

        //toggle visibility of selectd element on map
        //  elementEnabled(selectedModifier.enabled,svgMap.select(selectedModifier.elementId))

        if (selectedModifier.enabled && gameState.money - selectedModifier.cost < 0) {


            selectedModifier.enabled = false;
            alert('You dont have money for media service');

        } else {
            if (selectedModifier.enabled) {
                gameState.money -= selectedModifier.cost;
            }

        }



        console.log('game state money ' + gameState.money);


        UpdateVisual();
    });

    $("#newspaper-overview").hide();

    $("#newspaper-overview").click(function () {

        $("#newspaper-overview").hide(500);

    });

    elmNav.getElementById('tv').addEventListener("mouseover", function () {


    });

    elm.getElementById("next_button").addEventListener("mousedown", function () {

        var nextButton = elm.getElementById("next_button_background");
        var timeline = new TimelineMax();
        timeline.add(TweenMax.to(nextButton, 0.1, {fill: "#f17575"}));
        timeline.add(TweenMax.to(nextButton, 0.3, {fill: "#b01212"}));
        
        console.log('next clicked');

        var effect = gameState.getTurnEndEffect();

        if ((gameState.money + effect.money) < 0) {

            DisplayEventInfo("You don't have enough money.",
                    "You do not have enough money to support all media you are running this month. \n\
             You need to shutdown some of your operations.", [{name: "Close", func: HideEventInfo}]);
            return;
        }

        gameState.turnEnd();
        UpdateVisual();

        var restartGameButton = {name: "Restart game", func: function () {
                ResetGameState();
                HideEventInfo();
                UpdateVisual();
            }};
        if (gameState.isWin())
        {
            DisplayEventInfo("You win", "You got support from over half the other countries. The sanctions will not take place.", [restartGameButton]);
        }
        else if (gameState.isLose())
        {
            DisplayEventInfo("You lose", "You failed to convince majority of the other countries. At the summit, sanctions passed.", [restartGameButton]);
        }
        else
        {
            var textInfoParent = $('#canvas')[0];
            managers.forEach(function(m){
                var change = Math.round(m.country.lastTurnEffect.overallPopularityEffect * 100);

                var anchorId = "#" + m.country.elmId + "_text";

                CreateStatChangeVisualisation(change, anchorId, textInfoParent, timeline, '%');                
            });
            CreateStatChangeVisualisation(gameState.lastTurnEffect.money, '#suma_text', textInfoParent, timeline, '$');
        }
    });



    // scrolling text

    var scrollText = document.getElementById('news-scrolling');

    ShowRandomMessage();
    $(scrollText).css("top", "200%");
    textTimeline = new TimelineMax({delay: 1, repeat: -1, repeatDelay: 0.3, onRepeat: ShowRandomMessage});
    textTimeline.add(TweenMax.to(
            scrollText, 0.5,
            {top: "0%", ease: Linear.easeInOut}));
    textTimeline.add(TweenMax.to(
            scrollText, 0.5,
            {top: "-200%", ease: Linear.easeInOut, delay: 5}));

    console.log("window loaded");

}


var mySVGsToInject = document.querySelectorAll('img.inject-me');
// Trigger the injection
SVGInjector(mySVGsToInject, {}, function (totalSVGsInjected) {
  // Callback after all SVGs are injected
  console.log('We injected ' + totalSVGsInjected + ' SVG(s)!');
    InitGame();
  
});
