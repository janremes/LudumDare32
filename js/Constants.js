function Constants()
{
    //influence
    this.influenceSteepness = 2;
    this.influenceOffset = -0.3;
    this.oldInfluenceCoeff = 3;
    this.newInfluenceCoeff = 1;
    
    this.neighbourInfluenceCoeff = 0.2;
    this.negbourPlayerInfluence = 1;
    
    //modifiers
    this.tvEffect = new PopVector(0.1,0.2);
    this.tvCost = 3000;
    this.tvUpkeep = 1000;
    
    this.newspaperEffect = new PopVector(0.05,0.1);
    this.newspaperCost = 200;
    this.newspaperUpkeep = 500;
    
    this.radioEffect = new PopVector(0.05,0.05);
    this.radioCost = 800;
    this.radioUpkeep = 100;
    
    this.webEffect = new PopVector(0.15, 0.05);
    this.webCost = 2000;
    this.webUpkeep = 200;
}

var constants;
constants = new Constants();

//define(function(require){
//    require("PopVector");
//    return function(){
//        constants = new Constants();
//        return Constants;
//};});