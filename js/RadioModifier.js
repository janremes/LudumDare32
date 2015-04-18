function RadioModifier(country)
{
    this.upkeep = constants.radioUpkeep;
    this.cost = constants.radioCost;
    this.country = country;
    this.enabled = false;
}

RadioModifier.prototype = {
    constructor : RadioModifier,
    getTurnEndGameEffect : function()
    {
        var effect = new GameStateEffect();
        effect.addSpending(this.upkeep, "Radio");
        return effect;
        
    },
    getTurnEndCountryEffect : function()
    {
        var countryEffect = new CountryEffect();
        countryEffect.increasePopularity(constants.radioEffect, "Radio");            
        return countryEffect;
    }
};


//define(function(require){
//    require("GameStateEffect");
//    require("CountryEffect");
//    require("Constants");
//    ;
//    return function(){
//        return RadioModifier;
//}});