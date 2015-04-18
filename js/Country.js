function Country()
{
    this.popularity = new PopVector(0.3,0.3);
    this.populationSize = new PopVector(1000 + Math.round(Math.random() * 10000),1000 + Math.round(Math.random() * 10000));
    this.modifiers = [new TVModifier(this)];
    this.tvIndex = 0;
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
            gameEffect.add(modifier.getTurnEndGameEffect()); 
        });
        
        return gameEffect;
        
    },
    
    calculateNeighbourPopularityChange : function(neighbour)
    {
        var change = new PopVector(neighbour.getOverallPopularity()).subtract(this.popularity).multiply(0.1);
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
            countryEffect.decreasePopularity(new PopVector(-1,-1), "Fears you");
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

define(function(require){
    require("CountryEffect");
    require("GameStateEffect");
    require("TVModifier");
    
    return function(){
        return Country;
    };});