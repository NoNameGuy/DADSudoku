//2140727 - Alberto Trindade
//2140730 - Jessica Machado
//2110117 - Paulo Vieira

(function(){
  "use strict";

  // CONSTANTS
  var CONST_QUADRANT_NUM_ROWS, CONST_QUADRANT_NUM_COLUMNS;
  var CONST_TAB_NUM_ROWS, CONST_TAB_NUM_COLUMNS;

  var CONST_NUM_STUDENTS = 3;
  CONST_QUADRANT_NUM_COLUMNS = CONST_QUADRANT_NUM_ROWS = 3;
  CONST_TAB_NUM_ROWS = CONST_TAB_NUM_COLUMNS = 9;

  // GLOBAL SCOPE VARIABLES
  var isGameStarted = false;
  var startTime;
  var cellsMissing;

  $( document ).ready(function() {
    var numbers = new Array(2140727, 2140730, 2110117);
    var names = new Array("Alberto", "Jéssica", "Paulo");

  	changeProjectAuthors(CONST_NUM_STUDENTS, numbers, names);
    makeDialogContent();

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

    // Evento dos botões com número
    $('#highlightButtons button').click(function(index){
      //Limpa todas as seleções
      $('input').removeClass('highlight');
      //Selecionar todos as celulas com o numero igual ao do botão que foi clicado
      selectNumber($(this).val());
    });

    // Evento do botão "Check Game"
    $( '#btn-check' ).click(function(){
      checkGameOver();
    });

  });

  function changeProjectAuthors(numStudents, numbers, names){
    // Hide do ultimo author
	  $(".col-xs-6:last-child").hide();
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


    /* APAGAR -----> */  var isDebugMode = true;


    var link = "http://198.211.118.123:8080/" + ((!isDebugMode) ? ("board/"+mode) : ("test"));

		$.get(link)
			.done(function(data) {
        cellsMissing = CONST_TAB_NUM_ROWS*CONST_TAB_NUM_COLUMNS - data.length;

        //iniciar tabela com o "data"
        for(var i = 0; i < data.length; i++){
          $("input[data-column="+data[i].column+"][data-line="+data[i].line+"]")
          .val(data[i].value)
          .attr("value", data[i].value)
          .addClass("initial")
          .attr("disabled", true);
        }
        startTime = new Date();
				$("#loading").addClass("invisible"); //loading -> $("#loading").addClass("invisible");

			}).fail(function() {
				console.log("FAIL CALLING API REST")
			});
	}

  function cleanBoard(){
    var $cell = $('input').val('').removeAttr('disabled').removeClass("finished");
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
          cellsMissing++;
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
    var CONST_CELL_ANIMATION_DELAY = 1300;
    var num = $elem.val();
    var row = $elem.attr('data-line');
    var column = $elem.attr('data-column');

    // Se o número tiver fora do intervalo, apaga-o
    if(num < 0 || num > 9){
      $elem.val(undefined);
      return;
    }

    //So decrementa o valor de celulas por preencher se anteriormente não existia nenhum valor naquela celula
    if(!$elem.hasClass("with-value")){
    cellsMissing--;
    }

    // Coloca o elemento com estado "com valor"
    $elem.addClass('with-value');

    // Obtem os arrays com a respetiva linha e coluna
    var $rowCollection = $('input[data-line='+row+']');
    var $colCollection = $('input[data-column='+column+']');
    var $quadrantCollection = getArrayFromMatrixQuadrant(row, column);

    var animationQueue = new Queue();

    // Se a linha ou a coluna estiverem preenchidas, faz animação
    if(isFullRow($rowCollection)){
      var animateRow = function(){
        animate($rowCollection);
      }
      animationQueue.enqueue(animateRow);
    }

    if(isFullCol($colCollection)){
      var animateColumn = function(){
        animate($colCollection);
      }
      animationQueue.enqueue(animateColumn);
    }

    if(isFullQuadrant($quadrantCollection)){
      var animateQuadrant = function(){
        animate($quadrantCollection);
      }
      animationQueue.enqueue(animateQuadrant);
    }

    //Verifica se é fim de jogo
    if(cellsMissing == 0){
      checkGameOver();
    }else{
      removeHighlightGreen();
    }

    var index = 0;
    while(animationQueue.size() != 0){
      setTimeout(animationQueue.dequeue(), CONST_CELL_ANIMATION_DELAY*index++);
    }

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
    $cell.parent().animate({backgroundColor: "#ffa902" }, 500).animate({backgroundColor: "" }, 500);
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
    quadrantInitRow = row - (row % CONST_QUADRANT_NUM_ROWS);
    quadrantInitColumn = column - (column % CONST_QUADRANT_NUM_COLUMNS);

    $myArray = $('input[data-line='+quadrantInitRow+'][data-column='+quadrantInitColumn+']');

    // Convert the quadrant to a linear array structure
    for(var i = 0; i < CONST_QUADRANT_NUM_ROWS; i++){
      for(var j = 0; j < CONST_QUADRANT_NUM_COLUMNS; j++){
        $myArray = $myArray.add($('input[data-line='+(quadrantInitRow+i)+'][data-column='+(quadrantInitColumn+j)+']'));
      }
    }
    return $myArray;
  }

  function cleanUsableCell($elem){
    $elem.removeClass('with-value').removeAttr('style').removeClass('individual-highlight').removeClass('highlight');
  }

  function showError(){
    alert("You must click in New Game button first!");
  }

  //TODO:
  function selectNumber(number){
    //Get all the inputs with de number
    var $inputsWithNumber = $('input').filter(function(){
      return $(this).val() === number;
    });

    $inputsWithNumber.each(function(){
      //Add border selection
      $(this).addClass('highlight');
    });

    delay5Seconds(function(){
      //Remove border selection after 5 seconds
      $inputsWithNumber.each(function(){
        $(this).removeClass('highlight');
      });
    });
  }

  function checkGameOver(){
    if(isGameStarted){
      var $loadingGIF = $( '#loading' );
      var link = 'http://198.211.118.123:8080/board/check';
      $loadingGIF.toggleClass('invisible');

      $.ajax({
        method      : "POST",
        url         : link,
        data        : JSON.stringify(setBoardRequest()),
        contentType : 'application/json'
      })
        .done(function(data){
          if(data.finished === true){
            gameOver();
            highlightGreen();
          }
          else{
            handleConflicts(data.conflicts);

          }
        })
        .fail(function(){
          console.log('There was an error sending AJAX POST request');
        })
        .always(function(){
          $loadingGIF.toggleClass('invisible');
        });
    }else{
      showError();
    }
  }

  function makeDialogContent(){
    $( '#message' ).text('Game Won, congratulations!!').attr('style', 'margin-right:10px;margin-left:10px;margin-bottom:10px');
    $( '#dialog' ).append("<hr />").attr('style', 'padding-right:0em; padding-left:0em').append('<button id="Ok"> Ok </button>');
  }

  function showDialog(){
    $( '#time' ).text(time()).attr('style', 'margin: 10px');
    $( '#dialog' ).dialog();
    $( '#Ok' ).attr('style', 'float:right; margin-right:20px; padding: 5px 10px 5px 10px; text-align: center').click(function(){
      $('.ui-dialog-content').dialog('close');
    });
  }

  function gameOver(){
    showDialog();
  }

  function setBoardRequest(){
    var board = [];
    var $curCell, curValue;

    $.each($( 'input[data-line][data-column]' ), function(){
      $curCell = $(this);
      curValue = $curCell.val();

      if(curValue !== '' && curValue !== undefined){
        board.push({
          "line"   :   parseInt($curCell.attr('data-line')),
          "column" :   parseInt($curCell.attr('data-column')),
          "value"  :   parseInt($curCell.val()),
          "fixed"  :   $curCell.prop('disabled')
        })
      }
    });
    return board;
  }

  function handleConflicts(conflictsArray){
    var curCell;

    for(var i = 0; i < conflictsArray.length; i++){
      curCell = conflictsArray[i];
      toggleConflicts(curCell.line, curCell.column);
    }
  }

  function toggleConflicts(line, column){
    var $cell = $( 'input[data-line='+line+'][data-column='+column+']' );
    $cell.toggleClass('individual-conflict');
    delay5Seconds(function(){
      $cell.toggleClass('individual-conflict');
    });
  }

  function Queue() {
      this._oldestIndex = 1;
      this._newestIndex = 1;
      this._storage = {};
  }

  Queue.prototype.size = function() {
      return this._newestIndex - this._oldestIndex;
  };

  Queue.prototype.enqueue = function(data) {
      this._storage[this._newestIndex] = data;
      this._newestIndex++;
  };

  Queue.prototype.dequeue = function() {
      var oldestIndex = this._oldestIndex,
          newestIndex = this._newestIndex,
          deletedData;

      if (oldestIndex !== newestIndex) {
          deletedData = this._storage[oldestIndex];
          delete this._storage[oldestIndex];
          this._oldestIndex++;

          return deletedData;
      }
  };

  function time() {

    //http://stackoverflow.com/questions/1210701/compute-elapsed-time

    var timeDiff = new Date() - startTime;
    // get seconds (Original had 'round' which incorrectly counts 0:28, 0:29, 1:30 ... 1:59, 1:0)
    timeDiff/=1000;
    var seconds = Math.round(timeDiff%60);
    timeDiff /= 60;
    // get minutes
    var minutes = Math.round(timeDiff%60);
    timeDiff /= 60;
    // get hours
    var hours = Math.round(timeDiff%24);

    return "Time: " + ((hours < 10) ? "0" : "") + hours+":"+((minutes < 10) ? "0" : "")+minutes+":"+((seconds < 10) ? "0" : "")+seconds;
  };

  function highlightGreen(){
    //Change de color for gree of the cells with value
    $(".with-value").removeAttr("style").addClass("finished").attr("disabled", true);
  }

  function removeHighlightGreen(){
    //Change de color for gree of the cells with value
    $(".finished").removeAttr("style").addClass("with-value");
  }

})();
