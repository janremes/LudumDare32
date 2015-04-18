function Country(svgElement)
{
    this.svgElement = svgElement;
    this.popularity = 0.3;
    this.happiness = 0.5;
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
    }
};