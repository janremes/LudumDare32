define(function(require){
    var dep1 = require("Country");
    return function(){
        
    function GameState(countries)
    {
        this.countries = countries;
    //    this.countries = new Array();
    //    for(i = 0; i < 9; i++)
    //    {
    //        this.countries[i] = new Country();
    //    }
        this.money = 10000;
        this.incomePerTurn = 5000;
    };

    GameState.prototype = {
        constructor:GameState,

        turnEnd : function ()
        {
            for(i = 0; i < this.countries.length; i++)
            {
                var effect = this.countries[i].turnEnd();
                this.money += effect.money;
            }
            this.money += this.incomePerTurn;
        }
    };            
    
    return GameState;
}});
        
