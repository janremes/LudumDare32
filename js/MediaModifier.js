function MediaModifier(country, cost, upkeep, effect, name)
{
    this.upkeep = upkeep;
    this.cost = cost;
    this.name = name;
    this.effect = effect;
    this.country = country;
    this.enabled = false;
}

MediaModifier.prototype = {
    constructor : MediaModifier,
    getTurnEndGameEffect : function()
    {
        var effect = new GameStateEffect();
        effect.addSpending(this.upkeep, this.name + " - " + country.name);
        return effect;
        
    },
    getTurnEndCountryEffect : function()
    {
        var countryEffect = new CountryEffect();
        countryEffect.increasePopularity(this.effect, this.name);            
        return countryEffect;
    }
};
