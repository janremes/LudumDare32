function Country()
{
    
    this.countryId = "";
    
    this.popularity = new PopVector(0.3,0.3);
    this.populationSize = new PopVector(10,10);
    
    this.modifiers = [new TVModifier(this), new RadioModifier(this), new WebModifier(this), new NewspaperModifier(this)];
    this.tvIndex = 0;
    this.radioIndex = 1;
    this.webIndex = 2;
    this.newspaperIndex = 3;
    
    this.lastTurnEffect = new CountryEffect();
    this.neighboursPlayer = false;
    this.neighbouringCountries = [];
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
        var change = new PopVector(neighbour.getOverallPopularity()).subtract(this.popularity).multiply(constants.neighbourPopularityInfluence);
        return change;
    },

    getTurnEndCountryEffect : function()
    {
        var countryEffect = new CountryEffect();
        this.modifiers.forEach(function(modifier){
            if(modifier.enabled)
            {                
                countryEffect.add(modifier.getTurnEndCountryEffect()); 
            }
        });
        
        var changeSource = "Neighbour";
        
        this.neighbouringCountries.forEach(function(neighbour, outerThis){
            var neighbourEffect = this.calculateNeighbourPopularityChange(neighbour);
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
            countryEffect.decreasePopularity(new PopVector(constants.neighbourPopularityInfluence,constants.neighbourPopularityInfluence), "Fears you");
        }
        
        return countryEffect;
        
    },
    
    turnEnd: function()
    {
        this.getTurnEndCountryEffect().apply(this);
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