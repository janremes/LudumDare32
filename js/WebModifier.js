function WebModifier(country)
{
    this.upkeep = constants.webUpkeep;
    this.cost = constants.webCost;
    this.country = country;
    this.enabled = false;
}

WebModifier.prototype = {
    constructor : WebModifier,
    getTurnEndGameEffect : function()
    {
        var effect = new GameStateEffect();
        effect.addSpending(this.upkeep, "Web");
        return effect;
        
    },
    getTurnEndCountryEffect : function()
    {
        var countryEffect = new CountryEffect();
        countryEffect.increasePopularity(constants.webEffect, "Web");            
        return countryEffect;
    }
};

//
//define(function(require){
//    require("GameStateEffect");
//    require("CountryEffect");
//    require("Constants");
//    ;
//    return function(){
//        return WebModifier;
//}});