function TVModifier()
{
    
}

TVModifier.prototype = {
    constructor : TVModifier,
    apply : function(country)
    {
        country.increasePopularity(0.2);
    }
};