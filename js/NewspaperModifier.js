function NewspaperModifier(country)
{
    this.upkeep = constants.newspaperUpkeep;
    this.cost = constants.newspaperCost;
    this.country = country;
    this.enabled = false;
}

NewspaperModifier.prototype = {
    constructor : NewspaperModifier,
    getTurnEndGameEffect : function()
    {
        var effect = new GameStateEffect();
        effect.addSpending(this.upkeep, "Newspaper");
        return effect;
        
    },
    getTurnEndCountryEffect : function()
    {
        var countryEffect = new CountryEffect();
        countryEffect.increasePopularity(constants.newspaperEffect, "Newspaper");            
        return countryEffect;
    }
};


define(function(require){
    require("GameStateEffect");
    require("CountryEffect");
    require("Constants");
    ;
    return function(){
        return NewspaperModifier;
}});