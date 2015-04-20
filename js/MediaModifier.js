function MediaModifier(country, cost, upkeep, effect, name, nameLong)
{
    this.upkeep = upkeep;
    this.cost = cost;
    this.name = name;
    this.nameLong = nameLong;
    this.effect = effect;
    this.country = country;
    this.enabled = false;
    this.elementId = "";
}

MediaModifier.prototype = {
    constructor : MediaModifier,
    getTurnEndGameEffect : function()
    {
        var effect = new GameStateEffect();
        effect.addSpending(this.upkeep, this.name + " - " + this.country.name);
        return effect;
        
    },
    getTurnEndCountryEffect : function()
    {
        var countryEffect = new CountryEffect(this.country);
        countryEffect.increasePopularity(this.effect, this.name);            
        return countryEffect;
    }
};
