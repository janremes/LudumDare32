function Country()
{
    this.id = -1;
    this.elmId = '';
    
    this.popularity = new PopVector(0.3,0.3);
    this.populationSize = new PopVector(10,10);
    
    this.modifiers = [
        new MediaModifier(this, constants.tvCost, constants.tvUpkeep, constants.tvEffect, "TV"), 
        new MediaModifier(this, constants.radioCost, constants.radioUpkeep, constants.radioEffect, "Radio"), 
        new MediaModifier(this, constants.webCost, constants.webUpkeep, constants.webEffect, "Web"), 
        new MediaModifier(this, constants.newspaperCost, constants.newspaperUpkeep, constants.newspaperEffect, "Newspaper")
        ];
    this.tvIndex = 0;
    this.radioIndex = 1;
    this.webIndex = 2;
    this.newspaperIndex = 3;
    
    this.lastTurnEffect = new CountryEffect();
    this.neighboursPlayer = false;
    this.neighbouringCountries = [];
    
    this.name = '<unknown>';
}


Country.prototype = {
    constructor : Country,     
    
    getTurnEndGameEffect : function()
    {
        var gameEffect = new GameStateEffect();
        this.modifiers.forEach(function(modifier){
            if(modifier.enabled)
            {
                gameEffect.add(modifier.getTurnEndGameEffect());                 
            }
        });
        
        return gameEffect;
        
    },
    
    calculateNeighbourPopularityChange : function(neighbour)
    {
        var populationCoeff = (neighbour.populationSize.young + neighbour.populationSize.old) / (this.populationSize.young + this.populationSize.old);
        var change = new PopVector(neighbour.getOverallPopularity(), neighbour.getOverallPopularity())
                .subtract(0.5).multiply(constants.neighbourInfluenceCoeff * populationCoeff);
        return change;
    },

    getTurnEndCountryEffect : function()
    {
        var countryEffect = new CountryEffect();
        countryEffect.decreasePopularity(constants.influenceNegativeBias, "Bias");
        this.modifiers.forEach(function(modifier){
            if(modifier.enabled)
            {                
                countryEffect.add(modifier.getTurnEndCountryEffect()); 
            }
        });
        
        
        var outerThis = this;
        this.neighbouringCountries.forEach(function(neighbour){
            var changeSource = "Neighbour - " + neighbour.name;
            var neighbourEffect = outerThis.calculateNeighbourPopularityChange(neighbour);
            if(neighbourEffect.young >= 0)
            {
                if(neighbourEffect.old >= 0)
                {
                    countryEffect.increasePopularity(neighbourEffect, changeSource);
                }
                else
                {
                    countryEffect.increasePopularity(new PopVector(neighbourEffect.young, 0), changeSource);
                    countryEffect.decreasePopularity(new PopVector(0, -neighbourEffect.old), changeSource);
                }
            }
            else
            {
                if(neighbourEffect.old >= 0)
                {
                    countryEffect.decreasePopularity(new PopVector(-neighbourEffect.young, 0), changeSource);
                    countryEffect.increasePopularity(new PopVector(0, neighbourEffect.old), changeSource);
                }
                else
                {
                    countryEffect.decreasePopularity(neighbourEffect.multiply(-1), changeSource);
                }                
            }
        });
        
        if(this.neighboursPlayer)
        {
            countryEffect.decreasePopularity(new PopVector(constants.negbourPlayerInfluence,constants.negbourPlayerInfluence), "Fears you");
        }
        
        return countryEffect;
        
    },
    
    turnEnd: function()
    {
        this.lastTurnEffect = this.getTurnEndCountryEffect();
        this.lastTurnEffect.apply(this);
    },
    
    addModifier : function(modifier)
    {
        this.modifiers.push(modifier);
    },
    
    removeModifier : function(modifier)
    {
        var index = this.modifiers.indexOf(modifier);
        if(index < 0)
        {
            throw new Error("Modifier not found");
        }
        this.modifiers.splice(index, 1);
    },
    getOverallPopularity : function()
    {
        return (this.popularity.young * this.populationSize.young + this.popularity.old * this.populationSize.old) / (this.populationSize.young + this.populationSize.old);
    }
};
//
//define(["CountryEffect","GameStateEffect",
//    "TVModifier","RadioModifier","WebModifier","NewspaperModifier", "Constants"],
//    
//    function(a,b,c,d,e,f,g,h){
//        return Country;
//    });