function Constants()
{
    //influence
    this.influenceSteepness = 2;
    this.influenceOffset = -0.3;
    this.oldInfluenceCoeff = 3;
    this.newInfluenceCoeff = 1;
    
    this.neighbourPopularityInfluence = 0.2;
    this.negbourPlayerPopularityEffect = 1;
    
    //modifiers
    this.tvEffect = new PopVector(0.1,0.2);
}

var constants = new Constants();

define(function(require){
    ;
    return function(){
        return Constants;
}});