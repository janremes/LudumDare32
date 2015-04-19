function Constants()
{
    //influence
    this.influenceSteepness = 1;
    this.influenceOffset = 0;
    this.influenceNegativeBias = new PopVector(0.25, 0.15);
    this.oldInfluenceCoeff = 3;
    this.newInfluenceCoeff = 1;
    
    this.neighbourInfluenceCoeff = 0.2;
    this.negbourPlayerInfluence = 1;
    
    //modifiers
    this.tvEffect = new PopVector(0.2,0.4);
    this.tvCost = 3000;
    //this.tvUpkeep = 1000;
    this.tvUpkeep = 0;
    
    this.newspaperEffect = new PopVector(0.1,0.2);
    this.newspaperCost = 200;
    //this.newspaperUpkeep = 500;
    this.newspaperUpkeep = 0;
    
    this.radioEffect = new PopVector(0.1,0.1);
    this.radioCost = 800;
    this.radioUpkeep = 100;
    
    this.webEffect = new PopVector(0.3, 0.1);
    this.webCost = 2000;
    this.webUpkeep = 200;
    
    //GUI
}

var constants;
constants = new Constants();

//define(function(require){
//    require("PopVector");
//    return function(){
//        constants = new Constants();
//        return Constants;
//};});