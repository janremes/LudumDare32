function GameStateEffect(money) 
{
    this.money = money;
}

GameStateEffect.prototype = {
    add : function(otherEffect)
    {
        this.money += otherEffect.money;
    }
};