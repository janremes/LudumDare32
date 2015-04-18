function TVModifier()
{
    this.upkeep = 1000;
    this.cost = 3000;
}

TVModifier.prototype = {
    constructor : TVModifier,
    apply : function(country)
    {
        country.increasePopularity(0.2);
    }
};