function GameStateEffect() 
{
    this.money = 0;    
    this.incomeData = new Array();
    this.spendingData = new Array();
}

GameStateEffect.prototype = {
    
    addIncome : function(amount, source)
    {
      this.incomeData.push({amount: amount, source: source});  
      this.money += amount;
    },
    
    addSpending : function(amount, source)
    {
      this.spendingData.push({amount: amount, source: source});  
      this.money -= amount;        
    },
    
    add : function(otherEffect)
    {
        this.incomeData = this.incomeData.concat(otherEffect.incomeData);
        this.spendingData = this.spendingData.concat(otherEffect.spendingData);
        this.money += otherEffect.money;
    },
    
    apply : function(gameState)
    {
        gameState.money += this.money;
    }
};