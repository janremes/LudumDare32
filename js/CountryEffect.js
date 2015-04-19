function CountryEffect()
{
    this.influence = new PopVector();
    //this.happiness = 0;
    this.positiveInfluence = new Array();
    this.negativeInfluence = new Array();
    
    this.popularityEffect = new PopVector();
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
        this.influence = this.influence.subtract(amount);
        this.negativeInfluence.push({amount : amount, source : source});
    },
    
    add : function(otherEffect)
    {
        this.influence = this.influence.add(otherEffect.influence);
        this.positiveInfluence = this.positiveInfluence.concat(otherEffect.positiveInfluence);
        this.negativeInfluence = this.negativeInfluence.concat(otherEffect.negativeInfluence);
    },
    
    apply : function(country)
    {
        var input = this.influence.add(constants.influenceOffset).multiply(constants.influenceSteepness);
        var targetPopularity = input.divide((input.transform(Math.abs).add(1))).add(1).divide(2); //transform from [-1, 1] to [0, 1]
        var coeffOld = constants.oldInfluenceCoeff, coeffNew = constants.newInfluenceCoeff;
        var oldPopularity = country.popularity;
        country.popularity = (country.popularity.multiply(coeffOld).add(targetPopularity.multiply(coeffNew))).divide(coeffOld + coeffNew);
        this.popularityEffect = country.popularity.subtract(oldPopularity);
    }
};

//define(function(require){
//   require("PopVector");
//   require("Constants");
//   // ;
//    return function(){
//        return CountryEffect;
//    };});