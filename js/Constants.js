function Constants()
{
    this.numberOfTurns = 10;
    this.initialMoney = 5000;
    this.initialIncomePerTurn = 1000;
    this.incomePerTurnIncrement = 1000;
    
    //influence
    this.influenceSteepness = 1;
    this.influenceOffset = 0;
    this.influenceNegativeBias = new PopVector(0.25, 0.15);
    this.oldInfluenceCoeff = 3;
    this.newInfluenceCoeff = 1;
    
    this.neighbourInfluenceCoeff = 0.5;
    this.negbourPlayerInfluence = 0.6;
    
    //modifiers
    this.tvEffect = new PopVector(0.6,1.2);
    this.tvCost = 9000;
    this.tvUpkeep = 3000;
    
    this.newspaperEffect = new PopVector(0.3,0.6);
    this.newspaperCost = 600;
    this.newspaperUpkeep = 1000;
    
    this.radioEffect = new PopVector(0.3,0.3);
    this.radioCost = 2400;
    this.radioUpkeep = 300;
    
    this.webEffect = new PopVector(0.9, 0.3);
    this.webCost = 6000;
    this.webUpkeep = 600;
    
    //messages
    this.minimalNeighbourInfluenceForMessage = 0.1;
}

var constants;
constants = new Constants();

//define(function(require){
//    require("PopVector");
//    return function(){
//        constants = new Constants();
//        return Constants;
//};});