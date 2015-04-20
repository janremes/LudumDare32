function GameState(countries)
{
    this.countries = countries;
    this.reset();
};

GameState.prototype = {
    constructor:GameState,
    reset : function()
    {
        this.money = constants.initialMoney;
        this.incomePerTurn = constants.initialIncomePerTurn;
        this.turnsLeft = constants.numberOfTurns;
        this.lastTurnEffect = new GameStateEffect();   
        this.lastTurnSupportingCountries = [];
    },
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
        if(this.turnsLeft <= 0)
        {
            return;
        }
            
        this.lastTurnSupportingCountries = this.getSupportingCountries();
        this.countries.forEach(function(c){
            c.turnEnd();
        });
        this.lastTurnEffect = this.getTurnEndEffect();
        this.lastTurnEffect.apply(this);
        
        this.incomePerTurn += constants.incomePerTurnIncrement;
        this.turnsLeft--;
    },
    
    getSupportingCountries : function()
    {
        var support = [];
       this.countries.forEach(function(c){
            if(c.getOverallPopularity() > 0.5)
            {
                support.push(c);
            }
        });              
        return support;
    },
    
    isWin : function()
    {
        return this.getSupportingCountries().length > this.countries.length / 2;
    },
    
    isLose : function()
    {
        return this.turnsLeft <= 0 && !this.isWin();
    },
    getCandidateMessages : function()
    {
        messages = [];
        this.countries.forEach(function(c){
           messages = messages.concat(c.getCandidateMessages()); 
        });
        
        if(this.lastTurnEffect.money < 0)
        {
            messages.push('Myland allegedly overspends on propaganda.');
            messages.push('Unexpectedly high propaganda spending in Myland.');
            messages.push('Analytics: Myland\'s spending on propaganda is unsustainable.');
        }
        
        return messages;
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
