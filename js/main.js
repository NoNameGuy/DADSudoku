//2110117 - Paulo Vieira


// Implementation:

//GET BOARD DIFF
//$.get(URL,data,function(data,status,xhr),dataType)


function crateGame("dad-board"){

  $(document).ready(function(){
    $("btn-new").click(function(){
        $.get("http://198.211.118.123:10001/board/:mode", function(resp){
          alert(resp.ip);
        }, "jsonp");
    });

  }
}
