window.signedTerms = false;
$(document).ready(function() {
    var elems = document.querySelectorAll('.datepicker');
    var instances = M.Datepicker.init(elems, {format: 'dd/mm/yyyy'});

    loadSignPad();
    $("#termsBtn").on("click", function() {
        if(!window.signedTerms) {             
            loadSignPad();
        }
    });

    $("#submitApplication").on("click", function(e) {
        e.preventDefault();
        var data = {};
        var elements = [].slice.call(document.forms[0].elements);
        packingFunction(data, elements);
        console.log(data);
    });
});


function dataURLtoFile(dataurl, filename) {
    try{
      var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
      while(n--){
          u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, {type:mime});
    }catch(error){
      try{
        var blobObject = new Blob([u8arr], {type: 'mime'});
        return "";
      }catch(error){
        return "";
      }
    }
}

function loadSignPad() {
    setTimeout(() => {
        signPadLoaded = true;
        $("#signatureWidget").empty();
        $("#signatureWidget").jSignature().bind('change', function(e){ 
            var base64_img = $(e.target).jSignature("getData");
            var signFile = dataURLtoFile(base64_img, 'terms_sign.png');
            window.signedTerms = true;
        });

        $("#resetSignature").on("click", function(){
            $("#signatureWidget").jSignature("reset");
        });
    }, 200);
}

const packingFunction = (data, elements) => {
    elements.map(function(x){
        data[x.name] = x.value;
    }); 
    return data;
};