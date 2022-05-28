var exportArea;
var importButton;
var exportButton;
function init() {

  exportArea = document.getElementById("inorder");
  exportArea1 = document.getElementById("preorder");
  exportArea2 = document.getElementById("postorder");
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
        var datos = aux;
        var datos1 = aux1;
        var datos2 = aux2;

        var exportValue = JSON.stringify({datos,datos1,datos2}, undefined, 2);
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
  texto1 = getDatos1(archive);
  texto2 = getDatos2(archive);  

  document.getElementById("entrada").innerHTML = texto;
  document.getElementById("entrada1").innerHTML = texto1;
  document.getElementById("entrada2").innerHTML = texto2;

}
function getDatos(data) {
    var dat;
    dat=data.datos;
    return dat;
  }
function getDatos1(data) {
    var dat;
    dat=data.datos1;
    return dat;
  }
function getDatos2(data) {
    var dat;
    dat=data.datos2;
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