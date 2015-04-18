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
    this.lastTurnEndEffect = new GameStateEffect();
};

GameState.prototype = {
    constructor:GameState,

    getTurnEndEffect : function()
    {
        var totalEffect = new GameStateEffect(0);
        totalEffect.addIncome(this.incomePerTurn, "Home Income");
        for(i = 0; i < this.countries.length; i++)
        {
            var effect = this.countries[i].getTurnEndGameEffect();
            totalEffect.add(effect);
        }
        return totalEffect;
    },

    turnEnd : function ()
    {
        this.countries.forEach(function(c){
            c.turnEnd();
        });
        this.lastTurnEndEffect = this.getTurnEndEffect();
        this.lastTurnEndEffect.apply(this);
    }
};            

//
//define(function(require){
//    var dep1 = require("Country");
//    return function(){
//           
//    return GameState;
//}});
//        
