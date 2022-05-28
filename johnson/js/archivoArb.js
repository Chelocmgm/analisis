var exportArea;
var importButton;
var exportButton;
function init() {

  exportArea = document.getElementById("entrada");
  importButton = document.getElementById("btnGuardar");
  exportButton = document.getElementById("btnCargar");

  draw();
}

function exportNetwork() {
  Swal.fire({
    title: "Ingrese el nombre del Archivo",
    input: "text",
    showCancelButton: true,
    confirmButtonText: "Aceptar",
    cancelButtonText: "Cancelar",
    inputValidator: nombre => {
        if (!nombre) {
            return "Por favor escribe un nombre";
        } else {
            return undefined;
        }
    }
}).then(resultado => {
    if (resultado.value) {    
        
        var txtx="";
        for(var i=0;i<todos.length;i++){
            if(i<todos.length-1){
                txtx=txtx+todos[i]+",";
            }else{
                txtx=txtx+todos[i];
            }
        }
        var datos = txtx;

        var exportValue = JSON.stringify({datos}, undefined, 2);
        var archivo=resultado.value;
        downloadObjectAsJson(exportValue, archivo);
        Swal.fire(
          'Completado',
          'El archivo fue guardado exitosamente',
          'success'
        )
    }
});
  
}

function downloadObjectAsJson(exportObj, exportName){
  var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(exportObj);
  var downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href",     dataStr);
  downloadAnchorNode.setAttribute("download", exportName + ".json");
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}
var inputValue;
document.getElementById('btnCargar').addEventListener( 
  'change',  
  changeEvent => { 
    changeEvent.stopPropagation(); 
    changeEvent.preventDefault(); 
    readJsonFile(changeEvent.target.files[0]); 
  }, 
  false 
); 

function readJsonFile(jsonFile) { 
  var reader = new FileReader(); 
  reader.addEventListener('load', (loadEvent) => { 
    try { 
      inputValue = JSON.parse(loadEvent.target.result); 
      importNetwork(inputValue);
    } catch (error) { 
      console.error(error); 
    } 
  }); 
  reader.readAsText(jsonFile); 
} 

function importNetwork(archive) {
  texto = getDatos(archive);  

  document.getElementById("entrada").innerHTML = texto;

}
function getDatos(data) {
    var dat;
    dat=data.datos;
    return dat;
  }

function fileToJSON(file) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader()
    fileReader.onload = event => resolve(JSON.parse(event.target.result))
    fileReader.onerror = error => reject(error)
    fileReader.readAsText(file)
  })
}


