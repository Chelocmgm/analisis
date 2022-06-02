var exportArea;
var exportArea1;
var exportArea2;
var importButton;
var exportButton;
var vLabelNode=[];

function init() {

  exportArea = document.getElementById("inorden");
  exportArea1 = document.getElementById("preorden");
  exportArea2 = document.getElementById("postorden");
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
      vLabelNode=[];

      let ino = document.getElementById("inorden").value; 
      let pre = document.getElementById("preorden").value; 
      let post = document.getElementById("postorden").value; 
          var exportValue = JSON.stringify({ino,pre,post}, undefined, 3);
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
  texto = archive.ino;
  texto1 = archive.pre;
  texto2 = archive.post;

  document.getElementById("inorden").value = texto;
  document.getElementById("preorden").value = texto1;
  document.getElementById("postorden").value = texto2;

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
