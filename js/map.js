




$(window).bind('load', function() {

  var elm = document.getElementById('svg-map');

  var mapsvgdoc = null;

    try {
      mapsvgdoc = elm.contentDocument;
    }
    catch(e) {
      mapsvgdoc = elm.getSVGDocument();
    }


  var countryIds = ['moje_zeme'];

  for (int i = 1; i < 10 ; i++) {

    countryIds.append('zeme'+i);
  }


  mapsvgdoc.documentElement.addEventListener("mousedown", countryMousedown, false);

  console.log("window loaded");

  $("#svg-map").click(function() {
    console.log('clicked');

        console.log($(this).attr("id"));  
          
  });

   function countryMousedown(evt) {
       

       var country = evt.target;

       console.log('clicked :' + country.id);

       TweenLite.to(country, 2, { fill: "rgb(255,0,255)" });
    }






})