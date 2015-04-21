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
                ), 3);    
}

var selectionLine;

function ShowSelectionLine(manager){

    HideSelectionLine();
    var clientRect = Snap(manager.svgElement).node.getBoundingClientRect();
    var baseRect = $('#canvas')[0].getBoundingClientRect();

    var x1 = ((clientRect.left + clientRect.right) / 2) - baseRect.left;
    var y1 = ((clientRect.top + clientRect.bottom) / 2) - baseRect.top + 10;

    var x2 = 530;
    var y2 = 370;
    
    var flip =  y1 > y2;

    
    if(y1 < y2){
        var pom = y1;
        y1 = y2;
        y2 = pom;
        pom = x1;
        x1 = x2;
        x2 = pom;
    }

    var a = Math.abs(x1-x2);
    var b = Math.abs(y1-y2);
    var c;
    var sx = (x1+x2)/2 ;
    var sy = (y1+y2)/2 ;
    var width = Math.sqrt(a*a + b*b ) ;
    var x = sx - width/2;
    var y = sy;

    a = width / 2;

    c = Math.abs(sx-x);

    b = Math.sqrt(Math.abs(x1-x)*Math.abs(x1-x)+Math.abs(y1-y)*Math.abs(y1-y) );

    var cosb = (b*b - a*a - c*c) / (2*a*c);
    var rad = Math.acos(cosb);
    if(flip)
    {
        rad += Math.PI; 
    }
    var deg = (rad*180)/Math.PI

    htmlns = "http://www.w3.org/1999/xhtml";
    selectionLine = document.createElementNS(htmlns, "div");
    $(selectionLine).addClass("selectionLine");
    selectionLine.setAttribute('style','width:'+width+'px;transform:rotate('+deg+'deg);position:absolute;top:'+y+'px;left:'+x+'px;');   

    document.getElementById("canvas").appendChild(selectionLine);
}

function HideSelectionLine()
{
    if(selectionLine)
    {
        $(selectionLine).remove();
        selectionLine = undefined;
    }
}


function AddButtonEffects(svgElement, fillElement)
{
    svgElement.addEventListener("mouseover", function () {
        TweenMax.to(fillElement, 0.3, {fill: guiConstants.buttonBackgroundColorHover});
    });
    svgElement.addEventListener("mouseout", function () {
        TweenMax.to(fillElement, 0.3, {fill: guiConstants.buttonBackgroundColor});
    });
    svgElement.addEventListener("mousedown", function () {

        var timeline = new TimelineMax();
        timeline.add(TweenMax.to(fillElement, 0.3, {fill: guiConstants.buttonBackgroundColorClick}));
        timeline.add(TweenMax.to(fillElement, 0.9, {fill: guiConstants.buttonBackgroundColor}));
    });
    
}


function ShowNoviny(vydani, datum, titulek1, titulek2, titulek3)
{
    $(svgNoviny.select('#vydani').node).text(vydani);
    $(svgNoviny.select('#datum').node).text(datum);
    $(svgNoviny.select('#headline1').node).text(titulek1);
    $(svgNoviny.select('#headline2').node).text(titulek2);
    $(svgNoviny.select('#headline3').node).text(titulek3);
    $("#inactiveOverlay").css("display", "block");
    
}

function HideNoviny()
{
    $("#inactiveOverlay").css("display", "none");
    $("#svg-noviny").hide(500);    
}

function StopTutorialMedium()
{
                if(tutorialClickMediumTimeline)
                {
                    tutorialClickMediumTimeline.kill();
                    tutorialClickMediumTimeline = undefined;
                    var targetObject = svgMenu.select("#net").node;
                    TweenMax.to(targetObject, 0.1, {alpha : 1});
                    
                    tutorialClickNextMonthTimeline = new TimelineMax({repeat: -1, repeatDelay:3, delay: 3});
                    var targetObject = svgMap.select("#next_button_background").node;
                    tutorialClickNextMonthTimeline.to(targetObject, 0.3, {fill : guiConstants.buttonBackgroundColorClick});
                    tutorialClickNextMonthTimeline.to(targetObject, 0.7, {fill : guiConstants.buttonBackgroundColor});                            
                }
}

function StopTutorialNextTurn()
{
    if(tutorialClickNextMonthTimeline)
    {
        tutorialClickNextMonthTimeline.kill();
        tutorialClickNextMonthTimeline = undefined;
    }
}