function CountryManager(country, svgElement)
{
    this.country = country;
    this.svgElement = svgElement;
    
};

CountryManager.prototype = {
    constructor:CountryManager,
    
    onClick : function ()
    {
        this.country.addModifier(new TVModifier());
    },
    
    updateVisual : function()
    {
        var magnitude = Math.round( 255 * this.country.popularity ); 
        var color = "rgb(" + magnitude + ",0," + magnitude + ")";
        TweenLite.to(this.svgElement, 2, {fill: color});        
    }
};

define(function(require){
    var dep1 = require("Country"), tl = require("gsap/TweenLite.min"),
    dd = require("TVModifier")
    ;
    return function(){
        return CountryManager;
    }});