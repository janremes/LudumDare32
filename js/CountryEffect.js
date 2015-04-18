function CountryEffect()
{
    this.influence = new PopVector();
    //this.happiness = 0;
    this.positiveInfluence = new Array();
    this.negativeInfluence = new Array();
    
    this.popularityEffect;
}

CountryEffect.prototype = {
    constructor : CountryEffect,     
    increasePopularity : function(amount, source)
    {
        this.influence = this.influence.add(amount);
        this.positiveInfluence.push({amount : amount, source : source});
    },
    
    decreasePopularity : function(amount, source)
    {
        this.influence.subtract(amount);
        this.negativeInfluence.push({amount : amount, source : source});
    },
    
    add : function(otherEffect)
    {
        this.influence = this.influence.add(otherEffect.influence);
        this.positiveInfluence.concat(otherEffect.popularityIncreaseSources);
        this.negativeInfluence.concat(otherEffect.popularityDecreaseSources);
    },
    
    apply : function(country)
    {
        var input = this.influence.subtract(constants.influenceOffset).multiply(constants.influenceSteepness);
        var targetPopularity = input.divide((input.transform(Math.abs).add(1))).add(1).divide(2); //transform from [-1, 1] to [0, 1]
        var coeffOld = constants.oldInfluenceCoeff, coeffNew = constants.newInfluenceCoeff;
        country.popularity = (country.popularity.multiply(coeffOld).add(targetPopularity.multiply(coeffNew))).divide(coeffOld + coeffNew);
    }
};

define(function(require){
   require("PopVector");
   require("Constants");
   // ;
    return function(){
        return CountryEffect;
    };});