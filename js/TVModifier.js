function TVModifier(country)
{
    this.upkeep = constants.tvUpkeep;
    this.cost = constants.tvCost;
    this.country = country;
    this.enabled = false;
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
        countryEffect.increasePopularity(constants.tvEffect, "TV");            
        return countryEffect;
    }
};


//define(function(require){
//    require("GameStateEffect");
//    require("CountryEffect");
//    require("Constants");
//    ;
//    return function(){
//        return TVModifier;
//}});