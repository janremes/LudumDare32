function Country()
{
    this.popularity = new PopVector(0.3,0.3);
    this.populationSize = new PopVector(1000 + Math.round(Math.random() * 10000),1000 + Math.round(Math.random() * 10000));
    this.modifiers = [new TVModifier(this)];
    this.tvIndex = 0;
    this.lastTurnEffect = new CountryEffect();
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

    getTurnEndCountryEffect : function()
    {
        var countryEffect = new CountryEffect();
        this.modifiers.forEach(function(modifier){
            if(modifier.enabled)
            {                
                countryEffect.add(modifier.getTurnEndCountryEffect()); 
            }
        });
        
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