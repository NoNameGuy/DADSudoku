//2140727 - Alberto Trindade
//2140730 - Jessica Machado
//2110117 - Paulo Vieira


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
      
      // LISTENERS creation
      cellsOnInsertListener();
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

	function callAPIRest(){

		var mode = $("#select-mode option:selected").val();

		$.get("http://198.211.118.123:8080/board/"+mode)
			.done(function(data) {

        //iniciar tabela com o "data"
    for(var i = 0; i < data.length; i++){

      $("input[data-column="+data[i].column+"][data-line="+data[i].line+"]")
      .val(data[i].value)
      .attr("value", data[i].value)
      .addClass("initial")
      .attr("disabled", true);
    }

				$("#loading").addClass("invisible"); //loading -> $("#loading").addClass("invisible");

			}).fail(function() {
				console.log("FAIL CALLING API REST")
			});

	}


  function cleanBoard(){

    $("input.with-value").val('')
    $("input.with-value").removeClass('with-value');
    $("input:disabled.initial").removeAttr("disabled").val('')

  }

  $("#btn-new").click(function() {
    event.preventDefault();
    $("#loading").removeClass("invisible");
    cleanBoard(); //limpar tabela
    callAPIRest(); //callapirest para chamar o board
});

  function delay5Seconds(functionToExecute){
    setTimeout(functionToExecute, 5000);
  }

  function cellsOnInsertListener(){
    $('input[data-column][data-line]').change(function(){
      insertNumber($(this));
    }).change();
  }

  function insertNumber($elem){
    var num = $elem.val();
    var row = $elem.attr('data-line');
    var column = $elem.attr('data-column');

    if(num < 1 || num > 9 || num === undefined){
      return;
    }
    
    $elem.addClass('with-value');
    
    // TODO: Verificar se a linha e/ou coluna está completa para mostrar animação
    // TODO: Verificar se o quadrante está completo para mostrar animação
    // TODO: Verificar fim de jogo
  }

})();
