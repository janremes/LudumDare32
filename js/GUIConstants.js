function GUIConstants()
{
    this.hateColor = new RGBColour(158, 166, 0);
    this.neutralColor = new RGBColour(55, 72, 69);
    this.loveColor = new RGBColour(213, 0, 108);    
    
    this.buttonBackgroundColor = "#b01212";
    this.buttonBackgroundColorHover = "#d41616";
    this.buttonBackgroundColorClick = "#f17575";
}

GUIConstants.prototype = 
{   
    constructor : GUIConstants,
    mixColor : function(color1, color2, color1Coeff)
    {
        var rgb1 = color1.getRGB();
        var rgb2 = color2.getRGB();
        var color2Coeff = 1 - color1Coeff;
        return new RGBColour(
                rgb1.r * color1Coeff + rgb2.r * color2Coeff,
                rgb1.g * color1Coeff + rgb2.g * color2Coeff,
                rgb1.b * color1Coeff + rgb2.b * color2Coeff,
                rgb1.a * color1Coeff + rgb2.a * color2Coeff
        );
    },
    getColorForPopularity : function(popularity)
    {
        if(popularity < 0.1)
        {
            return this.hateColor;
        }
        else if (popularity < 0.45)
        {
            var coeff = (popularity - 0.1) * (100/35);
            return this.mixColor(this.neutralColor, this.hateColor, coeff);            
        }
        else if (popularity < 0.5)
        {
            var coeff = (popularity - 0.45) * 4;
            return this.mixColor(this.loveColor, this.neutralColor, coeff);                        
        }
        else if (popularity < 0.65)
        {
            var coeff = (popularity + 0.1) * 4/3;
            return this.mixColor(this.loveColor, this.neutralColor, coeff);                        
        }
        else
        {
            return this.loveColor;
        }
        
    }
            
};

var guiConstants;
guiConstants = new GUIConstants();

//define(function(require){
//    require("PopVector");
//    return function(){
//        constants = new Constants();
//        return Constants;
//};});