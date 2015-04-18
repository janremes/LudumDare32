function CountryEffect()
{
    this.popularity = 0;
    //this.happiness = 0;
    this.popularityIncreaseSources = new Array();
    this.popularityDecreaseSources = new Array();
}

CountryEffect.prototype = {
    constructor : CountryEffect,     
    increasePopularity : function(amount, source)
    {
        this.popularity += amount;
        this.popularityIncreaseSources.push({amount : amount, source : source});
    },
    
    decreasePopularity : function(amount, source)
    {
        this.popularity -= amount;
        this.popularityDecreaseSources.push({amount : amount, source : source});
    },
    
    add : function(otherEffect)
    {
        this.popularity += otherEffect.popularity;
        this.popularityIncreaseSources.concat(otherEffect.popularityIncreaseSources);
        this.popularityDecreaseSources.concat(otherEffect.popularityDecreaseSources);
    },
    
    apply : function(country)
    {
        var input = 2 * (this.popularity - 0.3);
        var targetPopularity = input / (1 + Math.abs(input));
        var coeffOld = 2, coeffNew = 1;
        country.popularity = (country.popularity * coeffOld + targetPopularity * coeffNew) / (coeffOld + coeffNew);
    }
};

define(function(require){
   // var dep1 = require("CountryEffect"), tl = require("GameStateEffect")
   // ;
    return function(){
        return CountryEffect;
    };});