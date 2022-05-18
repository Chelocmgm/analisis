var vLabelNode=[];
var exportButtonTree;

function nodo(nom) {
  this.nom = nom;
  this.izq;
  this.der;
}
var res = "";

function init() {
  
  exportButtonTree = document.getElementById("btnCargarArbol");

}

var prueba = {
  nom: 10,
  izq: {
    nom: 7,
    izq: {
      nom: 6,
      izq: {
        nom: 1,
      },
    },
    der: {
      nom: 8,
      der: {
        nom: 9,
      },
    },
  },
  der: {
    nom: 11,
    der: {
      nom: 20,
      izq: {
        nom: 14,
      },
      der: {
        nom: 22,
      },
    },
  },
};

function addNodes(){
  var nods=[];
  nodes.forEach((node) => {
    nods.push(node);
  });
  return nods;
}

function preOrder(cab) {
  res = "";
  preOrderExec(cab);
  return res;
}

function preOrderExec(nodo) {
  if (nodo !== undefined && nodo !== null) {
    res += ", " + nodo.nom.toString();
    preOrderExec(nodo.izq);
    preOrderExec(nodo.der);
  }
  if (nodo === undefined || nodo === null) {
    return;
  }
}
function inOrder(cab) {
    res = "";
    inOrderExec(cab);
    return res;
  }
  
  function inOrderExec(nodo) {
    if (nodo !== undefined && nodo !== null) {
      inOrderExec(nodo.izq);
      res += ", " + nodo.nom.toString();
      inOrderExec(nodo.der);
    }
    if (nodo === undefined || nodo === null) {
      return;
    }
  }
  function postOrder(cab) {
    res = "";
    postOrderExec(cab);
    return res;
  }
  
  function postOrderExec(nodo) {
    if (nodo !== undefined && nodo !== null) {
      postOrderExec(nodo.izq);
      postOrderExec(nodo.der);
      res += ", " + nodo.nom.toString();
    }
    if (nodo === undefined || nodo === null) {
      return;
    }
  }
  
  //guardar
  function exportNetworkTree() {
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
          let tree = document.getElementById("some-number").value; 
          var exportValue = JSON.stringify({tree}, undefined, 1);
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

  var inputValueTree;
  document.getElementById('btnCargarArbol').addEventListener( 
    'change',  
    changeEvent => { 
      console.log("entro");
      changeEvent.stopPropagation(); 
      changeEvent.preventDefault(); 
      readJsonFileTree(changeEvent.target.files[0]); 
    }, 
    false 
  ); 

  function readJsonFileTree(jsonFile) { 
    var reader = new FileReader(); 
    reader.addEventListener('load', (loadEvent) => { 
      try { 
        inputValueTree = JSON.parse(loadEvent.target.result); 
        importNetworkTree(inputValueTree);
      } catch (error) { 
        console.error(error); 
      } 
    }); 
    reader.readAsText(jsonFile); 
  } 
  
  function importNetworkTree(archive) {
    //var inputData = JSON.parse(archive);
    console.log(archive.tree);
    tree = archive.tree;
    console.log(tree);
    var data = tree;
    document.getElementById("some-number").value = data;
  
  }
  
