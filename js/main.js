//2110117 - Paulo Vieira


// Implementation:

//GET BOARD DIFF
//$.get(URL,data,function(data,status,xhr),dataType)
(function(){
    "use strict";

    $( document ).ready(function() {
    	// jQuery Code
    	$(".col-xs-6:last-child").hide(); //Hide do ultimo author

    	//Alteracao das informacoes do segundo author (jessica) //TODO
    	$(".col-xs-6:nth-child(3)").children(".thumbnail").children(".caption").hide();

    });

})();
