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
        var invalidData = document.querySelectorAll('.invalid')
        console.log(invalidData);
        if (invalidData.length > 0) {
            var errLine = "<p>There are atleast "+invalidData.length+" error(s) on the page. Look out for red fields.</p>";
            window.erpx.showError(errLine);
            return false;
        }
        
        var data = {};
        var elements = [].slice.call(document.forms[0].elements);
        data = packingFunction(data, elements);
        data['photo'] = window.photoFile;
        data['signature'] = window.signFile;
        var res = window.erpx.call_method("erpx_namlifa.erpx_for_namlifa.erpx_utilities.create_member_application",'Member Registration', data);
        return res
    });

    $("#photo").on("change", function() {
        previewFileURL(this, "#photoPreview");
    });

    $(document).on("keyup", ".cnf", function() {
        var strval = this.value;
        if(strval === "603") {
            this.value = "603-";
        } else if(strval === "6021") {
            this.value = "6021-";
        }
    });

    $("#new_nric_no").on("keyup", function() {
        //XXXXXX-XX-XXXX
        var strval = this.value;
        if (strval.length == 6 || strval.length == 9) {
            this.value = strval+"-";
        }
    });

    $("#new_nric_no").on("change", function() {
        var strval = this.value;
        if (strval.length == 12) {
            this.value = strval.substr(0, 7) + "-" + strval.substr(7, 9) + "-" + strval.substr(9);
        }
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
            window.signFile = base64_img;
            window.signedTerms = true;
        });

        $("#resetSignature").on("click", function(){
            $("#signatureWidget").jSignature("reset");
        });
    }, 200);
}

const packingFunction = (data, elements) => {
    elements.map(function(x){
        if(x.name) data[x.name] = x.value;
    }); 
    return data;
};

function previewFileURL(input, imgId) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
            $(imgId).attr('src', e.target.result);
            var photoFile = dataURLtoFile(e.target.result, 'photo_image');
            window.photoFile = e.target.result;
        }        
        reader.readAsDataURL(input.files[0]);
    }
}