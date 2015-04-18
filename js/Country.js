

function Country()
{
    this.popularity = 0.3;
    this.happiness = 0.5;
    this.modifiers = new Array();
}

Country.prototype = {
    constructor : Country,     
    increasePopularity : function(fraction)
    {
        this.popularity += ((1 - this.popularity) * fraction); 
    },
    
    turnEnd: function()
    {
        this.popularity -= this.popularity * 0.1;
        this.modifiers.forEach(function(){
           modifier.apply(this); 
        });
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