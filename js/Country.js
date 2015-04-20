function Country()
{
    this.id = -1;
    this.elmId = '';
    
    this.popularity = new PopVector(0.3,0.3);
    this.lastTurnPopularity = new PopVector();
    this.populationSize = new PopVector(10,10);
    
    this.modifiers = [
        new MediaModifier(this, constants.tvCost, constants.tvUpkeep, constants.tvEffect, "TV", "TV Station"), 
        new MediaModifier(this, constants.radioCost, constants.radioUpkeep, constants.radioEffect, "Radio", "Radio Station"), 
        new MediaModifier(this, constants.webCost, constants.webUpkeep, constants.webEffect, "Web", "News web"), 
        new MediaModifier(this, constants.newspaperCost, constants.newspaperUpkeep, constants.newspaperEffect, "Newspaper", "Newspaper")
        ];
    this.tvIndex = 0;
    this.radioIndex = 1;
    this.webIndex = 2;
    this.newspaperIndex = 3;
    
    this.lastTurnEffect = new CountryEffect(this);
    this.neighboursPlayer = false;
    this.neighbouringCountries = [];
    
    this.name = '<unknown>';
}


Country.prototype = {
    constructor : Country, 
    reset : function()
    {
        this.modifiers.forEach(function(m){ m.enabled = false; });
    },
    setPopularity : function(popularity)
    {
      this.lastTurnPopularity = this.popularity;
      this.popularity = popularity;  
    },
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
        var countryEffect = new CountryEffect(this);
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
            countryEffect.decreasePopularity(new PopVector(constants.negbourPlayerInfluence,constants.negbourPlayerInfluence), "Fears Myland");
        }
        
        return countryEffect;
        
    },
    
    turnEnd: function()
    {
        this.lastTurnEffect = this.getTurnEndCountryEffect();
        this.lastTurnEffect.apply();
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
    },
    getCandidateMessages : function()
    {
        messages = [];
        var outerThis = this;
        this.neighbouringCountries.forEach(function(neighbour){
           var influence = outerThis.calculateNeighbourPopularityChange(neighbour);
           if(influence.old > constants.minimalNeighbourInfluenceForMessage)
           {
               messages.push('Citizens of ' + outerThis.name + ' influenced by pro-Myland sentiments in ' + neighbour.name + '.');
           }
           if(influence.old < -constants.minimalNeighbourInfluenceForMessage)
           {
               messages.push('Anti-Myland views spread from ' + neighbour.name + ' to ' + outerThis.name + '.');               
           }
        });
        
        this.modifiers.forEach(function(m){
           if(m.enabled)
           {               
               messages.push('Myland-backed ' + m.name + ' in ' + outerThis.name + ' accused of spreading "Dangerous propaganda"');
           }
        });
        
        if(this.getOverallPopularity() > 0.55)
        {            
            messages.push("Pro-Myland rallies in " + this.name +".");
            messages.push(this.name + " officials will support Myland in upcoming summit.");
        } 
        if(this.getOverallPopularity() > 0.6)
        {
            messages.push(this.name + ": violent strike in support of Myland.");
        }
        if(this.getOverallPopularity() < 0.40)
        {
            messages.push(this.name + ": Protest against Myland's acquisition of Otherland.");
            messages.push("Thousands march against Myland in " + this.name + ".");
            messages.push("Government in " + this.name + " will never support unlawful occupation of Otherland.");
        }
        if(this.getOverallPopularity() < 0.25)
        {
            messages.push(this.name + ": Riots during anti-Myland protests.");
            messages.push("Anti-Myland protests in " + this.name + " turned into bloodshed.");
        }
        
        return messages;
    }
};
//
//define(["CountryEffect","GameStateEffect",
//    "TVModifier","RadioModifier","WebModifier","NewspaperModifier", "Constants"],
//    
//    function(a,b,c,d,e,f,g,h){
//        return Country;
//    });