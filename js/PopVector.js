function PopVector(young, old)
{
    this.young = (typeof young === 'undefined') ? 0 : young;
    this.old = (typeof old === 'undefined') ? 0 : old;
}

PopVector.prototype = {
    constructor : PopVector,     
    add : function(other)
    {
        var value = new PopVector();
        if(typeof other === 'number')
        {
            value.young = this.young + other;
            value.old = this.old + other;            
        }
        else
        {
            value.young = this.young + other.young;
            value.old = this.old + other.old;            
        }
        return value;
    },
    subtract : function(other)
    {
        var value = new PopVector();
        if(typeof other === 'number')
        {
            value.young = this.young - other;
            value.old = this.old - other;            
        }
        else
        {
            value.young = this.young - other.young;
            value.old = this.old - other.old;
        }
        return value;
    },
    multiply : function(other)
    {
        var value = new PopVector();
        if(typeof other === 'number')
        {
            value.young = this.young * other;
            value.old = this.old * other;
        }
        else
        {
            value.young = this.young * other.young;
            value.old = this.old * other.old;
        }
        return value;
    },
    divide : function(other)
    {
        var value = new PopVector();
        if(typeof other === 'number')
        {
            value.young = this.young / other;
            value.old = this.old / other;            
        }
        else
        {
            value.young = this.young / other.young;
            value.old = this.old / other.old;
        }
        return value;
    },
    transform : function(func)
    {
        var value = new PopVector();
        value.young = func(this.young);
        value.old = func(this.old);
        return value;
    }
};

//define(function(require){
//   // var dep1 = require("CountryEffect"), tl = require("GameStateEffect")
//   // ;
//    return function(){
//        return PopVector;
//    };});