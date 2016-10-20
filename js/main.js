//2140727 - Alberto Trindade
//2140730 - Jessica Machado
//2110117 - Paulo Vieira

(function(){
  "use strict";

  // CONSTANTS
  var CONST_NUM_ROWS, CONST_NUM_COLUMNS;
  var CONST_NUM_STUDENTS = 3;
  CONST_NUM_COLUMNS = CONST_NUM_ROWS = 3;

  // GLOBAL SCOPE VARIABLES
	var difficulty;
	var selectedMode;
  var isGameStarted = false;

  $( document ).ready(function() {
  	var numbers = new Array(2140727, 2140730, 2110117);
	  var names = new Array("Alberto", "Jéssica", "Paulo");

  	// jQuery Code
  	$(".col-xs-6:last-child").hide(); //Hide do ultimo author

  	changeProjectAuthors(CONST_NUM_STUDENTS, numbers, names);
    
    // LISTENERS creation
    cellsOnChangeListener();
    cellsOnKeyUpListener();
    cellsOnDoubleClickListener();

    // Evento do botão "New Game"
    $("#btn-new").click(function() {
      event.preventDefault();
      $("#loading").removeClass("invisible");
      cleanBoard(); //limpar tabela
      callAPIRest(); //callapirest para chamar o board
      isGameStarted = true;
    });

  });

  function changeProjectAuthors(numStudents, numbers, names){
	    for (var i = 1; i <= numStudents; i++)
		  changeAuthor(i, numbers[i-1], names[i-1]);
  }

  function changeAuthor(curAuthor, number, name){
  	var photoSize = 400;

  	if(curAuthor < 1 || curAuthor > CONST_NUM_STUDENTS)
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
    var $cell = $("input.with-value").val('');
    $("input:disabled.initial").removeAttr("disabled").val('');
    cleanUsableCell($cell);
  }

  function delay5Seconds(functionToExecute){
    setTimeout(functionToExecute, 5000);
  }

  function cellsOnChangeListener(){
    $('input[data-column][data-line]').change(function(){
      if(isGameStarted){        
        if($(this).val() === ""){
          cleanUsableCell($(this));
        }
        else{
          insertNumber($(this));
        }
      }
      else{
        $(this).val("");
        showError();
      }
    });
  }

  function cellsOnDoubleClickListener(){
    $('input[data-column][data-line]').dblclick(function(){
      if(isGameStarted){        
        if($(this).val() != ""){
          selectCell($(this));
        }
      }
      else{
        $(this).val("");
        showError();
      }
    });
  }

  function cellsOnKeyUpListener(){
    $('input[data-column][data-line]').keyup(function(){
      var $elem = $(this);
      if($elem.val() === ''){
        $elem.val('');
      }
    });
  }

  function selectCell($elem){
    var row = $elem.attr('data-line');
    var column = $elem.attr('data-column');
    var num = $elem.val();
    var isSelected = $elem.hasClass('individual-highlight');

    if(isSelected){
      $elem.removeClass('individual-highlight');  
    } else {
      $elem.addClass('individual-highlight');
    }
  }

  function insertNumber($elem){
    var num = $elem.val();
    var row = $elem.attr('data-line');
    var column = $elem.attr('data-column');

    // Se o número tiver fora do intervalo, apaga-o
    if(num < 0 || num > 9){
      $elem.val(undefined);
      return;
    }
    
    // Coloca o elemento com estado "com valor"
    $elem.addClass('with-value');
    
    // Obtem os arrays com a respetiva linha e coluna
    var $rowCollection = $('input[data-line='+row+']');
    var $colCollection = $('input[data-column='+column+']');
    var $quadrantCollection = getArrayFromMatrixQuadrant(row, column);

    // Se a linha ou a coluna estiverem preenchidas, faz animação
    if(isFullRow($rowCollection)){
      animate($rowCollection);
    }
    
    if(isFullCol($colCollection)){
      animate($colCollection);
    }
    
    if(isFullQuadrant($quadrantCollection)){
      animate($quadrantCollection);
    }
    
    // TODO: Verificar fim de jogo
    // isGameOver();
  }

  function isCellCollectionFull($collection){
    var isFull = true;
    var constructionArray = Array(10);
    var curPos = 0;
    var curValue;
    $.each($collection, function(){
      curValue = $(this).val();
      if(curValue === "" || $.inArray(curValue, constructionArray) != -1){
        isFull = false;
      }
      constructionArray[curPos++] = curValue;
    });
    return isFull;
  }

  function isFullCol($columnCollection){
    return isCellCollectionFull($columnCollection);
  }

  function isFullRow($rowCollection){
    return isCellCollectionFull($rowCollection);
  }

  function isFullQuadrant($quadrantCollection){
    return isCellCollectionFull($quadrantCollection);
  }

  function animateCell($cell){
    //Animate parent (border)
    $cell.parent().animate({backgroundColor: "#ffa902" }, 500).animate({backgroundColor: "#ffff" }, 500); 
    
    //If it is a cell with value, animate from orange to the original color (orange with opacity)
    if($cell.hasClass("with-value")){ 
      $cell.animate({backgroundColor: "#ffa902" }, 500).animate({backgroundColor: "rgba(234,162,89,0.6)" }, 500);
    //If it is a cell with no value (and without initial class), animate from orange to the original white
    }else if(!$cell.hasClass("initial")){ 
      $cell.animate({backgroundColor: "#ffa902" }, 500).animate({backgroundColor: "#ffff" }, 500);
    }
  }

  function animate($collection){
    //Goes throw the collection (index by index)
    $collection.each(function(index){
      //Execute a delay for the input (backgroud) and for the parent (border line)
      $(this).delay(100*index).parent().delay(100*index); 
      //Animate a cell (inp)
      animateCell($(this));
    });
  }
  
  function getArrayFromMatrixQuadrant(row, column){
    // Get the position of the element in the quadrant
    var quadrantInitRow, quadrantInitColumn;
    var $myArray;

    // Get the quadrant initial row and column
    quadrantInitRow = row - (row % CONST_NUM_ROWS);
    quadrantInitColumn = column - (column % CONST_NUM_COLUMNS);

    $myArray = $('input[data-line='+quadrantInitRow+'][data-column='+quadrantInitColumn+']');
    
    // Convert the quadrant to a linear array structure
    for(var i = 0; i < CONST_NUM_ROWS; i++){
      for(var j = 0; j < CONST_NUM_COLUMNS; j++){
        $myArray = $myArray.add($('input[data-line='+(quadrantInitRow+i)+'][data-column='+(quadrantInitColumn+j)+']'));
      }
    }
    return $myArray;
  }

  function cleanUsableCell($elem){
    $elem.removeClass('with-value').removeAttr('style').removeClass('individual-highlight');
  }

  function showError(){
    alert("You must click in New Game button first!");
  }

})();
