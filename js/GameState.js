function GameState(countries)
{
    this.countries = countries;
//    this.countries = new Array();
//    for(i = 0; i < 9; i++)
//    {
//        this.countries[i] = new Country();
//    }
};

GameState.prototype = {
    constructor:GameState,
    
    turnEnd : function ()
    {
        for(i = 0; i < this.countries.length; i++)
        {
            this.countries[i].turnEnd();
        }
    }
};