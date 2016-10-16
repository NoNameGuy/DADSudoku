//2140727 - Alberto Trindade
//2140730 - Jessica Machado
//2110117 - Paulo Vieira


// Implementation:

//GET BOARD DIFF
//$.get(URL,data,function(data,status,xhr),dataType)
(function(){
    "use strict";
			
		var difficulty;
		var selectedMode;
		
    $( document ).ready(function() {

    	var NUM_STUDENTS = 3;
    	var numbers = new Array(2140727, 2140730, 2110117);
		var names = new Array("Alberto", "Jéssica", "Paulo");

    	// jQuery Code
    	$(".col-xs-6:last-child").hide(); //Hide do ultimo author
      
    	changeProjectAuthors(NUM_STUDENTS, numbers, names);
    });

    function changeProjectAuthors(numStudents, numbers, names){
		for (var i = 1; i <= numStudents; i++)
			changeAuthor(i, numbers[i-1], names[i-1]);	
    }

    function changeAuthor(curAuthor, number, name){
    	var photoSize = 400;

    	if(curAuthor < 1 || curAuthor > 3)
    		return;

		var identifier = ".col-xs-6:nth-child("+(curAuthor+1)+")";

		// TODO: Instead of making 3 jQuery successive calls, store in a variable the access of parent's div.
    	// Change students' photo size
    	$(identifier+" img").css('height', photoSize).css('width', photoSize);
    	// Change students' number
    	$(identifier+" .caption h3").text(number);
    	// Change students' name
		$(identifier+" .caption p").text(name);	
    }
	
	function callAPIRest{
		
		var mode = $("#select-mode option:selected").val();
		
		$.get("http://198.211.118.123:8080/board/"+mode)
			.done(function(data) {
				//iniciar tabela com o "data"
				//loading -> $("#loading").addClass("invisible");
				
			}).fail(function() {
				console.log("FAIL CALLING API REST")
			});
		
	}

	$("btn-new").click(function(){
		
		event.preventDefault();
		//limpar tabela
		//callapirest para chamar o board
		
	})

})();
