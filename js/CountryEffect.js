function CountryEffect(country)
{
    this.country = country;
    this.influence = new PopVector();
    //this.happiness = 0;
    this.positiveInfluence = new Array();
    this.negativeInfluence = new Array();
    
    this.targetPopularity = new PopVector();
    this.popularityEffect = new PopVector();
    this.overallPopularityEffect = 0;
}

CountryEffect.prototype = {
    constructor : CountryEffect,     
    increasePopularity : function(amount, source)
    {
        this.influence = this.influence.add(amount);
        this.positiveInfluence.push({amount : amount, source : source});
        this.updateDerivedStats();
    },
    
    decreasePopularity : function(amount, source)
    {
        this.influence = this.influence.subtract(amount);
        this.negativeInfluence.push({amount : amount, source : source});
        this.updateDerivedStats();
    },
    
    add : function(otherEffect)
    {
        this.influence = this.influence.add(otherEffect.influence);
        this.positiveInfluence = this.positiveInfluence.concat(otherEffect.positiveInfluence);
        this.negativeInfluence = this.negativeInfluence.concat(otherEffect.negativeInfluence);
        this.updateDerivedStats();
    },
    
    updateDerivedStats: function()
    {
        var input = this.influence.add(constants.influenceOffset).multiply(constants.influenceSteepness);
        var targetPopularity = input.divide((input.transform(Math.abs).add(1))).add(1).divide(2); //transform from [-1, 1] to [0, 1]
        var coeffOld = constants.oldInfluenceCoeff, coeffNew = constants.newInfluenceCoeff;
        var oldPopularity = this.country.popularity;
        var newPopularity = (oldPopularity.multiply(coeffOld).add(targetPopularity.multiply(coeffNew))).divide(coeffOld + coeffNew);
        this.popularityEffect = newPopularity.subtract(oldPopularity);        
        var newOverallPopularity = (newPopularity.old * this.country.populationSize.old +  newPopularity.young *this.country.populationSize.young) / (this.country.populationSize.young + this.country.populationSize.old);
        this.overallPopularityEffect = newOverallPopularity - this.country.getOverallPopularity();
    },
    
    apply : function()
    {
        this.updateDerivedStats();
        this.country.setPopularity(this.country.popularity.add(this.popularityEffect));
    }
};

//define(function(require){
//   require("PopVector");
//   require("Constants");
//   // ;
//    return function(){
//        return CountryEffect;
//    };});