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