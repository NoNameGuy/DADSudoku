//2110117 - Paulo Vieira


// Implementation:

//GET BOARD DIFF
//$.get(URL,data,function(data,status,xhr),dataType)
(function(){
    "use strict";

    $( document ).ready(function() {
      var NUM_STUDENTS = 3;

      $(".col-xs-6:last-child").hide() //ESCONDE O ULTIMO AUTOR
      
      for (var i = 1; i <= NUM_STUDENTS; i++)
      	changeStudentPhoto(i);	
    });

    function changeStudentPhoto(nrStudent){
    	// Wrap photo in standard size
    	var photoSize = 400;
    	
    	if(nrStudent < 1 || nrStudent > 3)
    		return;
    	
    	$(".col-xs-6:nth-child("+(nrStudent+1)+") img").css('height', photoSize).css('width', photoSize);
    }

})();
