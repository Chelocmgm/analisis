    var exportArea;
    var importButton;
    var exportButton;
    var vLabelNode=[];
    function init() {
   
      exportArea = document.getElementById("input_output");
      importButton = document.getElementById("btnGuardar");
      exportButton = document.getElementById("btnCargar");
    
      draw();
    }

    function addEdges(){
      var edgs=[];
      edges.forEach((edge) => {
        edgs.push(edge);
      });
      return edgs;
    }
    function addNodes(){
      var nods=[];
      nodes.forEach((node) => {
        nods.push(node);
      });
      return nods;
    }
    
    function clearOutputArea() {
      exportArea.value = "";
    }
    
    function draw() {
 
      var data = getScaleFreeNetwork();
    
      network = new vis.Network(container, data, options);
    
      clearOutputArea();
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
            var nodesE = addNodes();
            var edgesE = addEdges();

            var exportValue = JSON.stringify({nodesE,edgesE}, undefined, 2);
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
      //var inputData = JSON.parse(archive);
      nodes = getNodeData(archive);
      edges = getEdgeData(archive);
      var data = {
        nodes: nodes,
        edges: edges,
      };
    
      network = new vis.Network(container, data, options);
    
    }
    
    function fileToJSON(file) {
      return new Promise((resolve, reject) => {
        const fileReader = new FileReader()
        fileReader.onload = event => resolve(JSON.parse(event.target.result))
        fileReader.onerror = error => reject(error)
        fileReader.readAsText(file)
      })
    }
    function getNodeData(data) {
      var networkNodes = [];
    
      data.nodesE.forEach((element)=> {
          networkNodes.push({
            id: element.id,
            label: element.label,
            x: element.x,
            y: element.y,
            ttp:element.ttp,
            tpp:element.tpp,
            title:element.title,
          });
      });
    
      return new vis.DataSet(networkNodes);
    }
    
    function getEdgeData(data) {
      var networkEdges = [];
      data.edgesE.forEach(function (edgs) {
        
          networkEdges.push({ 
            id:edgs.id,
            from: edgs.from, 
            to: edgs.to, 
            label: edgs.valor, 
            sublabel1: edgs.sublabel1,
            valor: edgs.valor,
          });
         });
    
      return new vis.DataSet(networkEdges);
    }
    
    function objectToArray(obj) {
      nodes.forEach((node) => {
        vLabelNode.push(node.label);
     }) ;
      return Object.keys(obj).map(function (key) {
        obj[key].id = key;
        obj[key].label=vLabelNode[key];
        return obj[key];
      });
    }
  
    
  
    