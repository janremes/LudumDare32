function TVModifier(country)
{
    this.upkeep = 1000;
    this.cost = 3000;
    this.country = country;
}

TVModifier.prototype = {
    constructor : TVModifier,
    getTurnEndGameEffect : function()
    {
        var effect = new GameStateEffect();
        effect.addSpending(this.upkeep, "TV");
        return effect;
        
    },
    getTurnEndCountryEffect : function()
    {
        var countryEffect = new CountryEffect();
        countryEffect.increasePopularity(0.2, "TV");
        return countryEffect;
    }
};


define(function(require){
    require("GameStateEffect");
    require("CountryEffect");
    ;
    return function(){
        return TVModifier;
}});