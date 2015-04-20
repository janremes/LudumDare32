function CountryManager(country, svgElement)
{
    this.country = country;
    this.svgElement = svgElement;
    //this.popularityChangeElement = undefined;
};

CountryManager.prototype = {
    constructor:CountryManager,
    
    onClick : function ()
    {
    },
    
    updateVisual : function()
    {
        var color = guiConstants.getColorForPopularity(this.country.getOverallPopularity()).getCSSHexadecimalRGB();
        TweenLite.to(this.svgElement, 2, {fill: color});        
    }
};

//define(function(require){
//    var dep1 = require("Country"), tl = require("gsap/TweenLite.min"),
//    dd = require("TVModifier")
//    ;
//    return function(){
//        return CountryManager;
//    }});