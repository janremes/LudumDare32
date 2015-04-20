function Constants()
{
    this.numberOfTurns = 10;
    this.initialMoney = 2000;
    this.initialIncomePerTurn = 2000;
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
    this.tvEffect = new PopVector(0.5,1.0);
    this.tvCost = 6000;
    this.tvUpkeep = 2000;
    
    this.newspaperEffect = new PopVector(0.1,0.4);
    this.newspaperCost = 400;
    this.newspaperUpkeep = 800;
    
    this.radioEffect = new PopVector(0.2,0.2);
    this.radioCost = 1600;
    this.radioUpkeep = 200;
    
    this.webEffect = new PopVector(0.5, 0.2);
    this.webCost = 2000;
    this.webUpkeep = 400;
    
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