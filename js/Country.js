function Country()
{
    this.popularity = 0.3;
    this.happiness = 0.5;
    this.modifiers = new Array();
    this.lastTurnEffect = new Array();
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
            countryEffect.add(modifier.getTurnEndCountryEffect()); 
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
    }
};

define(function(require){
    var dep1 = require("CountryEffect"), tl = require("GameStateEffect")
    ;
    return function(){
        return Country;
    };});