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

var moneyElement;
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


function UpdateVisual()
{
    managers.forEach(function (m) {
        m.updateVisual();
    });

    moneyElement.text(gameState.money);

    countries.forEach(function(country){
        country.modifiers.forEach(function(modif){

           elementEnabled(modif.enabled,svgMap.select(modif.elementId));

        });
    });
}

function DisplayEventInfo(title,text, buttons)
{
    var html = '<h2 id="dialogTitle">' + title + '</h2><div id="dialogText">' + text + "</div>";
    dialogBox.innerHTML = html;
    if(buttons)
    {
        var buttonContainer = $.parseHTML('<div id="dialogButtonContainer"></div>')[0];
        buttons.forEach(function(b)
        {
           var newButton = $.parseHTML('<button class="dialogButton" type="button">' + b.name + '</button>')[0];
           newButton.addEventListener("click", b.func);           
            $(buttonContainer).append(newButton);
        });
    }
    $(dialogBox).append(buttonContainer);
    $(dialogBox).css("display", "block");
    $("#inactiveOverlay").css("display","block");
}

function HideEventInfo()
{
    $(dialogBox).css("display", "none");    
    $("#inactiveOverlay").css("display","none");
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
        <tr><th>Source</th><th>Young</th><th>Old</th></tr>\n\
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
    var table = '<table><thead><tr><th colspan="2">Budget</th></tr>\n\
        </thead><tbody>';
    
    effect.incomeData.forEach(function (income){
       table += '<tr class="positive"><td class="sourceColumn">' + income.source + 
               '</td><td class="numberColumn">' + income.amount + '</td></tr>';
    });
    
    effect.spendingData.forEach(function (spending){
       table += '<tr class="negative"><td class="sourceColumn">' + spending.source + 
               '</td><td class="numberColumn">' + (-spending.amount) + '</td></tr>';
    });    
    
    table += '<tr class="total"><td>Total</td><td>' + effect.money +'</td></tr>';
        
    return table + '</tbody></table>';
}

function ShowRandomMessage()
{
    var messages = gameState.getCandidateMessages();
    var msgIndex = Math.floor(Math.random() * messages.length * 1024) >> 10;
    var messageToShow = messages[msgIndex];

    $('#news-scrolling').text(messageToShow);

}

function ResetGameState()
{
   //neighbours are 1-based indices (as in map)
    countryData = [
        //1 
        {name: 'Crystallville', neighbours: [2, 6], neighboursPlayer: true, popSize: new PopVector(15, 10), popularity: new PopVector(0.10, 0.10)},
        {name: 'Ironmist', neighbours: [1, 3, 6, 7], neighboursPlayer: true, popSize: new PopVector(5, 4), popularity: new PopVector(0.20, 0.08)},
        {name: 'Greihill', neighbours: [2, 8, 7], neighboursPlayer: true, popSize: new PopVector(4, 7), popularity: new PopVector(0.05, 0.23)},
        //4
        {name: 'Southfalcon', neighbours: [5, 6], neighboursPlayer: false, popSize: new PopVector(3, 7), popularity: new PopVector(0.60, 0.55)},
        {name: 'Newby', neighbours: [4, 6], neighboursPlayer: false, popSize: new PopVector(5, 2), popularity: new PopVector(0.40, 0.55)},
        {name: 'Wywerbush', neighbours: [4, 5, 1, 2, 7], neighboursPlayer: false, popSize: new PopVector(25, 16), popularity: new PopVector(0.50, 0.45)},
        //7
        {name: 'Oldsummer', neighbours: [6, 2, 3, 8, 9], neighboursPlayer: false, popSize: new PopVector(12, 3), popularity: new PopVector(0.40, 0.30)},
        {name: 'Glassapple', neighbours: [7, 3], neighboursPlayer: false, popSize: new PopVector(2, 9), popularity: new PopVector(0.20, 0.60)},
        {name: 'Fairhall', neighbours: [7], neighboursPlayer: false, popSize: new PopVector(14, 2), popularity: new PopVector(0.60, 0.50)}
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


    $( "#menu-nav-tooltip").hide();

    var elm = document.getElementById('svg-map').contentDocument;
    var elmNav = document.getElementById('svg-nav').contentDocument;

    svgMenu = Snap('#svg-nav');
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


 
    managers.forEach(function (manager) {
        manager.svgElement.addEventListener("mousedown", function () {
            selectedCountryManager = manager;
            manager.onClick();
            updateMenu(manager.country, manager.svgElement);
            updateCountryStroke(manager.svgElement);
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

    function updateMenu(country, element) {

        console.log('updating menu' + country);
        $(svgMenu.select('#popularity-old tspan').node).text(Math.round(country.popularity.old * 100) + '%');
        $(svgMenu.select('#popularity-young tspan').node).text(Math.round(country.popularity.young * 100) + '%');

        svgMenu.select('#pomer_happy_stary').animate({width: country.popularity.young * 193}, 500);
        svgMenu.select('#pomer_happy_mlady').animate({width: country.popularity.old * 193}, 500);

        infoTableContent.innerHTML = CreateTableForCountry(country);
    }




    gameState = new GameState(countries);

   ResetGameState();

    moneyElement = $(svgMap.select('#suma_text tspan').node);


    
    infoTableWrapper = $.parseHTML('<div id="infoTableWrapper"><h3>Detailed info</h3></div>')[0];
    infoTableContent = $.parseHTML('<div id="infoTableContent"></div>')[0];
    $(infoTableWrapper).append(infoTableContent);
    $('#canvas').append(infoTableWrapper);

    dialogBox = $.parseHTML('<div id="dialogBox"></div>')[0];
    $(dialogBox).css("display","none");
    $('#canvas').append(dialogBox);

    UpdateVisual();





    // own country clicked
    
    elm.getElementById('moje_zeme').addEventListener("mousedown", function () {

        infoTableContent.innerHTML = CreateTableForBudget(gameState.getTurnEndEffect());
        
        console.log('clicked own country');

    });

    //BUTTONS

    elmNav.getElementById('tv').addEventListener("mousedown", function () {

        var country = selectedCountryManager.country;

        var modifId =  "#" + country.elmId + "_tv";

        var svgTv = svgMap.select(modifId);

        country.modifiers[country.tvIndex].elementId = modifId;

        showTooltip(country.modifiers[country.tvIndex],svgTv);

       // console.log('enable' + enabled + ' tv for ' + country.countryId);


    });

    elmNav.getElementById('radio').addEventListener("mousedown", function () {

        var country = selectedCountryManager.country;
     
        var modifId =  "#" + country.elmId + "_radio";

        var svgTv = svgMap.select(modifId);

        country.modifiers[country.radioIndex].elementId = modifId;

        showTooltip(country.modifiers[country.radioIndex],svgTv);
       // console.log('enable' + enabled + ' radio for ' + country.countryId);

    });

    elmNav.getElementById('noviny').addEventListener("mousedown", function () {

        var country = selectedCountryManager.country;
     
         var modifId =  "#" + country.elmId + "_noviny";

        var svgTv = svgMap.select(modifId);

        country.modifiers[country.newspaperIndex].elementId = modifId;

        showTooltip(country.modifiers[country.newspaperIndex],svgTv);

      //  console.log('enable' + enabled + ' tv for ' + country.countryId);
    });

    elmNav.getElementById('net').addEventListener("mousedown", function () {


        var country = selectedCountryManager.country;

        var modifId =  "#" + country.elmId + "_net";

        var svgTv = svgMap.select(modifId);

        country.modifiers[country.webIndex].elementId = modifId;
        
        showTooltip(country.modifiers[country.webIndex],svgTv);

      //  console.log('enable' + enabled + ' net for ' + country.countryId);

    });



    function showTooltip(modifier,element) {
        console.log('showing tooltip');
         $( "#menu-nav-tooltip").show();

         $("#tooltip-price").text(modifier.cost.toString());
         $("#tooltip-price-turn").text(modifier.upkeep);

         selectedModifier = modifier;

         if (modifier.enabled) {
            $( "#tooltip-buy" ).text('Shutdown');
         } else {
            $( "#tooltip-buy" ).text('Buy');
         }
    }

    $( "#tooltip-dismiss" ).click(function() {

        $( "#menu-nav-tooltip").hide();

    });

      $( "#tooltip-buy" ).click(function() {

        $( "#menu-nav-tooltip").hide();


        

        selectedModifier.enabled = !selectedModifier.enabled;

        //toggle visibility of selectd element on map
      //  elementEnabled(selectedModifier.enabled,svgMap.select(selectedModifier.elementId))
        
        if (selectedModifier.enabled) {
            gameState.money -= selectedModifier.cost;
        }
        
        
        console.log('game state money '+ gameState.money );
        
        
        UpdateVisual();
    });

    elmNav.getElementById('tv').addEventListener("mouseover", function () {


    });

    elm.getElementById("next_button").addEventListener("mousedown", function () {

        console.log('next clicked');

        var effect = gameState.getTurnEndEffect();

        if ((gameState.money + effect.money) < 0) {

            alert('You have no money');
            return;
        }

        gameState.turnEnd();
        UpdateVisual();
        
        var restartGameButton = { name : "Restart game", func : function() { 
                ResetGameState(); 
                HideEventInfo(); 
                UpdateVisual();
            }};
        if(gameState.isWin())
        {
            DisplayEventInfo("You win", "You got support from over half the other countries. The sanctions will not take place.", [restartGameButton]);
        }
        else if(gameState.isLose())
        {
            DisplayEventInfo("You lose", "You failed to convince majority of the other countries. At the summit, sanctions passed.", [restartGameButton]);            
        }
    });



    // scrolling text

    var scrollText = document.getElementById('news-scrolling');

    ShowRandomMessage();
    $(scrollText).css("top", "200%");
    textTimeline = new TimelineMax({delay:1, repeat:-1, repeatDelay: 0.3, onRepeat:ShowRandomMessage});
    textTimeline.add(TweenMax.to(
            scrollText, 0.5, 
            {top: "0%", ease: Linear.easeInOut}));
    textTimeline.add(TweenMax.to(
            scrollText, 0.5, 
            {top: "-200%", ease: Linear.easeInOut, delay: 5}));

    console.log("window loaded");

}

InitGame();

//require(['jquery', 'Country', 'CountryManager', 'GameState', 'xbMarquee', 'snap.svg-min'],
//        function ($, Country, CountryManager, GameState) {
//            InitGame();
//        });
