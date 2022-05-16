var container = document.getElementById("mynetwork");
var nodes = new vis.DataSet();
var edges = new vis.DataSet();
var flag=0;

var options = {
  nodes:{
    physics: false,
    shape: 'image',
    image: 'rep1.png',
    size: 30,
    font: {
      color: '#000000',
    }
  },
  edges:{
        arrows:{
          to:{
             enabled:true
          }
        },
        font: {
          align: 'top'
        }
  },
  physics: {
    stabilization: true,
    barnesHut: {
      springLength: 150,
    },
  },
  manipulation: {
    enabled: true,
    initiallyActive: false,
    addNode: function (nodeData, callback) {
      Swal.fire({
        title: "Nombre del nodo",
        input: "text",
        showCancelButton: true,
        confirmButtonText: "Aceptar",
        cancelButtonText: "Cancelar",
        inputValidator: nombre => {
            if (!nombre) {
                return "Por favor escribe el nombre del nodo";
            } else {
                return undefined;
            }
        }
    }).then(resultado => {
        if (resultado.value) {
            var auxid = 0;
            var existe = 0;
            let nombre = resultado.value;
            nodes.forEach((node) => {
              if(nombre === node.label){
                existe=-1
              }
           }) ;
            if(existe === -1){
              console.log("YA EXISTE");
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Ya existe un nodo con ese nombre! '
              })

            }else{
            console.log("Hola, " + nombre);
            nodeData.label=nombre;
            if(nodes.length!=0){
              nodes.forEach((node)=>{
                auxid=node.id;
              });
              auxid++;
            };
            nodeData.ttp="";
            nodeData.tpp="";
            nodeData.id=auxid;
            nodes.add(nodeData);
            callback(nodeData);
          }
        }
    });
    },
    addEdge: function (data, callback) {
        Swal.fire({
            title: "Ingrese un valor",
            input: "text",
            showCancelButton: true,
            confirmButtonText: "Guardar",
            cancelButtonText: "Cancelar",
            inputValidator: nombre => {
                if (!nombre) {
                    return "Por favor ingrese un valor";
                } else {
                    return undefined;
                }
            }
        }).then(resultado => {
            if (resultado.value) {
              var val = resultado.value;
              data.sublabel1="";
              data.label=val+"\n"+data.sublabel1;
              data.valor=val;
              edges.add(data);
              callback(data);
            }
        });
    },
    editNode: function (nodeData,callback) {
      Swal.fire({
        title: "Nombre del nodo",
        input: "text",
        showCancelButton: true,
        confirmButtonText: "Aceptar",
        cancelButtonText: "Cancelar",
        inputValidator: nombre => {
            if (!nombre) {
                return "Por favor escribe el nombre del nodo";
            } else {
                return undefined;
            }
        }
    }).then(resultado => {
        if (resultado.value) {            
            var pid=nodeData.id;
            nodes.forEach((node) => {
              if(pid==node.id){
                var nombre=resultado.value;
                node.label=nombre;
                callback(node);
              }
            }) ;
        }
    });
    },
    editEdge: function (data, callback) {
      Swal.fire({
        title: "Ingrese un valor",
        input: "text",
        showCancelButton: true,
        confirmButtonText: "Guardar",
        cancelButtonText: "Cancelar",
        inputValidator: nombre => {
            if (!nombre) {
                return "Por favor ingrese un valor";
            } else {
                return undefined;
            }
        }
    }).then(resultado => {
        if (resultado.value) {
          var eid=data.id;
          var efrom=data.from;
          var eto=data.to;
          edges.forEach((edge) =>{
            if(eid==edge.id){
              edge.from=efrom;
              edge.to=eto;
              var val = resultado.value;
              data.valor=val;
              data.label=val;
              callback(data);
            }
          });
        }
    });
    },
    deleteNode: true,
    deleteEdge: true,     
    },
};

var data = {
    nodes: nodes,
    edges: edges,
};
var network = new vis.Network(container, data, options);

function llenarTabla(){
  
  if(flag==1){
    document.getElementsByTagName("table")[0].remove();
    flag=0;
  } 
  var aux=[];
  var posi=0;
  nodes.forEach((node)=>{
    aux.push({node,posi});
    posi++;
  });
  aux.forEach((a)=>{
    console.log(a.node.id,a.posi);
  });
  
  mat= Array(nodes.length).fill(0).map(() => Array(nodes.length).fill(0));

  var body = document.getElementsByTagName("body")[0];

  var tbl = document.createElement("table");
  var tblHead = document.createElement("thead");
  var tblBody = document.createElement ("tbody");

   edges.forEach((edge) => {
      var ffrom;
      var tto;
      aux.forEach((a)=>{
        if(edge.from==a.node.id){
          tto=a.posi;
        }
      });
      aux.forEach((a)=>{
        if(edge.to==a.node.id){
          ffrom=a.posi;
        }
      });
      mat[parseInt(tto)][parseInt(ffrom)] = edge.label;
    });

  var vcolum=[];
  var vfilas=[];
 
  for (let i=0;i<mat.length;i++){
      var sumc=0; 
      var sfil=0;
      for (let j=0;j<mat.length;j++){
          sfil+=parseFloat(mat[i][j]);
          sumc+=parseFloat(mat[j][i]);
      }
      vfilas.push(sfil);
      vcolum.push(sumc);
  }

  var v=[];

  var row = document.createElement("tr");
  var cell = document.createElement("td");
  var cellText = document.createTextNode("");
  cell.appendChild(cellText);
  row.appendChild(cell);
  nodes.forEach((node) => {
      var cell = document.createElement("td");
      var cellText = document.createTextNode(node.label);
      cell.appendChild(cellText);
      row.appendChild(cell);
      v.push(node.label);
   }) ;

   var cell = document.createElement("td");
   var cellText = document.createTextNode("SUMA FILAS");
   cell.appendChild(cellText);
   row.appendChild(cell);    

   tblHead.appendChild(row);

   for (var i =0 ; i<mat.length;i++){
      var row = document.createElement("tr"); 

      var cell = document.createElement("td");
      var cellText = document.createTextNode(v[i]);
      cell.className = 'columna';
      cell.appendChild(cellText);
      row.appendChild(cell);

      for (var j=0;j<mat.length;j++){
          
          var cell = document.createElement("td");
          var cellText = document.createTextNode(mat[i][j]);
          cell.appendChild(cellText);
          row.appendChild(cell);
      }
      var cell = document.createElement("td");
      var cellText = document.createTextNode(vfilas[i]);
      cell.className = 'suma';
      cell.appendChild(cellText);
      row.appendChild(cell);
      
      tblBody.appendChild(row);            
  } 

  var row = document.createElement("tr");
  var cell = document.createElement("td");
  var cellText = document.createTextNode("SUMA COLUMNAS");
  cell.className = 'columna';
  cell.appendChild(cellText);
  row.appendChild(cell);
  
  vcolum.forEach((c) => {
      var cell = document.createElement("td");
      var cellText = document.createTextNode(c);
      cell.appendChild(cellText);
      cell.className = 'suma';
      row.appendChild(cell);
   }) ;
   var cell = document.createElement("td");
   var cellText = document.createTextNode("");

   cell.appendChild(cellText);
   row.appendChild(cell);
   tblBody.appendChild(row);

   tbl.appendChild(tblHead);
   tbl.appendChild(tblBody);
   body.appendChild(tbl);
   tbl.setAttribute("border", "2");
   flag=1;
  
    }


    function johnson(){

      nodes.forEach((node)=>{
        nodes.update({id:node.id,color:{background:"#231187"}});;
      });
      edges.forEach((edge)=>{
        edges.update({id:edge.id,label:edge.valor,color:{color:"#231187"}});;
      });

      var tpp=[];
      var tppf=[];
      var ttp=[];
      var ttpf=[];
      var holguras=[];
      var fflag=0;
      var idn=0;
      var res=0;
      var max=0;
      var idm=0;
      tpp.push({idn , res});
      edges.forEach((edge)=>{ 
        var ffrom=edge.from;
        var valor=edge.valor;
        tpp.forEach((a)=>{
            if(a.idn==ffrom)
            {
              res=parseInt(a.res)+parseInt(valor);
              idn=edge.to;
              tpp.push({idn,res});
            }
          });
      });
      tpp.forEach((a)=>{
        var aid=a.idn;
        var ares=a.res;
        var ff=0;
        if(fflag==0){
          tppf.push({aid,ares});
          fflag=1;
        }
        else{
          tppf.forEach((af)=>{
            if(af.aid==aid){
              if(parseInt(af.ares)<parseInt(ares))
              {
                af.ares=ares;
              }
              ff=1;
            }
          });
          if(ff==0){
            tppf.push({aid,ares});
          }
        }
      });

      tppf.forEach((a)=>{
        if(a.ares>max){
          max=a.ares;
          idm=a.aid;
        }
      });
      ttp.push({idm,max});

    for(var ic=0;ic<tpp.length;ic++){
      ttp.forEach((a)=>{
        var iid=a.idm;
        edges.forEach((edge)=>{
            var tto=edge.to;
            var valor=edge.valor;
            if(iid==tto){
              max=parseInt(a.max)-parseInt(valor);
              idm=edge.from;
              ttp.push({idm,max});
            }
        });
      });
    }
      ttp.forEach((a)=>{
        var aid=a.idm;
        var ares=a.max;
        var ff=0;
        if(fflag==0){
          ttpf.push({aid,ares});
          fflag=1;
        }
        else{
          ttpf.forEach((af)=>{
            if(af.aid==aid){
              if(parseFloat(af.ares)>=parseFloat(ares))
              {
                af.ares=ares;
              }
              ff=1;
            }
          });
          if(ff==0){
            ttpf.push({aid,ares});
          }
        }
      });      
      nodes.forEach((node)=>{
        tppf.forEach((a)=>{
          ttpf.forEach((b)=>{
            if(node.id==a.aid && node.id==b.aid){
              nodes.update({id:node.id,ttp:a.ares,tpp:b.ares,title:"ttp:"+a.ares+" | tpp: "+b.ares}); 
            }
          });
        });
      });
      
      edges.forEach((edge)=>{
        var vttp=0;
        var vtpp=0;
        var vto=edge.to;
        var vfrom=edge.from;
        var idee=edge.id;
        var valor=0;
        valor=parseInt(edge.valor);
        nodes.forEach((node)=>{
            if(node.id==vfrom){
              vttp=parseInt(node.ttp);           
            }
            if(node.id==vto){
              vtpp=parseInt(node.tpp);
            }
        });
        var holg=vtpp-vttp-valor;
        holguras.push({idee,holg,vtpp,vttp,valor});
        edges.update({id:edge.id,sublabel1:"h="+holg});
      });
      console.log("hols");
      console.log(holguras);
      edges.forEach((edge)=>{
        if(edge.sublabel1=="h=0")
        {
          edges.update({id:edge.id,label:edge.label+"\n"+edge.sublabel1,color:{color:"#E80B0B"}}); 
          nodes.update({id:edge.to,image:"rep2.png"});
          nodes.update({id:edge.from,image:"rep2.png"});

        }
        else{
          edges.update({id:edge.id,label:edge.label+"\n"+edge.sublabel1});
           
        }
       
      });
      
      Swal.fire({
        icon: 'success',
        title: 'Algoritmo Completado',
        text: 'A continuación, podra observar la mejor ruta calculada por el algoritmo, marcada en color rojo',
        showConfirmButton: false,
        timer: 6500
      })
      
      
    }

    const generarMatriz = () => {
      let matrix = Array(nodes.length).fill(0).map(() => Array(nodes.length).fill(0));
    
      edges.forEach((edge) => {
          matrix[parseInt(edge.from)][parseInt(edge.to)] = edge.label;
      });
    
      rowList = [];
      colList = [];
    
      for (let i = 0; i < matrix.length; i++) {
          sumRow = 0;
          sumCol = 0;
          for (let j = 0; j < matrix.length; j++) {
              sumRow += parseFloat(matrix[i][j]);
              sumCol += parseFloat(matrix[j][i]);
          }
          rowList.push(sumRow);
          colList.push(sumCol);
      }
      nombresNodos = [];
    
      let showMatrix = " ,";
      nodes.forEach((node) => {
          showMatrix += node.label + ",";
          nombresNodos.push(node.label);
      });
    
      showMatrix += "SUMA|";
    
      for (let i = 0; i < matrix.length; i++) {
          showMatrix += nombresNodos[i] + ",";
          for (let j = 0; j < matrix.length; j++) {
              showMatrix += matrix[i][j] + ",";
          }
    
        showMatrix += rowList[i] + "|";
      }
    
      showMatrix += "SUMA,";
      colList.forEach((col) => (showMatrix += col + ","));
      
      console.log("ShowMatrix ", showMatrix)
      //parseArray(showMatrix);
  };

  const parseArray = (matriz) => {
    let final = Array(nodes.length + 2).fill(0).map(() => Array(nodes.length + 2).fill(0));
    let rows = matriz.split(["|"]);
  
    for (let i = 0; i < rows.length; i++) {
        let cols = rows[i].split(",");
    
        for (let j = 0; j < cols.length; j++) {
            final[i][j] = cols[j];
        }
    }
    crearTabla(final);
};

let permutations = []

function asignacion(task){ 
    let matrixad = Array(nodes.length).fill(0).map(() => Array(nodes.length).fill(0));
    
    edges.forEach((edge) => {
        matrixad[parseInt(edge.from)][parseInt(edge.to)] = parseInt(edge.label);
    });
    
    let colors = ["#800000","#FF0000","#FFA500","#808000","#800080","#FF00FF","#008000","#000080","#0000FF","#008080","#000000","#808080"];
    let response = {
        array: [],
        message: "",
    }
  
    let info = {
        sources: [],
        destinies: []
    };
    
    var matrix = correctMatrix(matrixad,info);
    if(info.sources.length>=info.destinies.length){
        permute(info.sources,0,info.sources.length-1);
        let resultCost;
        let solution;
        if(task == "max"){
            document.getElementById("matrizFinal").innerHTML = "";
            resultCost = -1000000;
            for(let i=0;i<permutations.length;i++){
                let iterationCost = 0;
                for(let j=0;j<info.destinies.length;j++){
                    iterationCost += matrixad[permutations[i][j]][info.destinies[j]];
                }
                if(iterationCost > resultCost){ 
                    resultCost = iterationCost;
                    solution = permutations[i];
                }
            }
            Swal.fire({
              icon: 'success',
              title: 'Costo Maximo',
              text: 'El costo maximo es '+resultCost
            })

            response.message = response.message.concat("El costo maximo es ",resultCost,"\n");
        }
        if(task == "min"){
            document.getElementById("matrizFinal").innerHTML = "";
            resultCost = 1000000;
            for(let i=0;i<permutations.length;i++){
                let iterationCost = 0;
                for(let j=0;j<info.destinies.length;j++){
                    iterationCost += matrixad[permutations[i][j]][info.destinies[j]];
                }
                if(iterationCost < resultCost){ 
                    resultCost = iterationCost;
                    solution = permutations[i];
                }
            }
            response.message = response.message.concat("El costo minimo es ",resultCost,"\n");
        }
        for(let i=0; i<info.destinies.length; i++){
            a = consegirlabel(solution[i]);
            b = consegirlabel(info.destinies[i]);

            edges.forEach((edge) => {
                if(parseInt(edge.from) == solution[i] && parseInt(edge.to) == info.destinies[i]){
                    matrixad[parseInt(edge.from)][parseInt(edge.to)] = "("+parseInt(edge.label)+")";
                }
              
            });
            let object1 = {
                type: "node",
                id: solution[i],
                color: colors[i]
            };
            let object2 = {
                type: "edge",
                source: solution[i],
                target: info.destinies[i],
                color: colors[i]
            };
            let object3 = {
                type: "node",
                id: info.destinies[i],
                color: colors[i]
            };
            response.array.push(object1);
            response.array.push(object2);
            response.array.push(object3);
          }
    }
    else{
        let resultCost;
        let solution;
        permute(info.destinies,0,info.destinies.length-1);
        if(task == "max"){
            document.getElementById("matrizFinal").innerHTML = "";
            resultCost = -1000000;
            for(let i=0;i<permutations.length;i++){
                let iterationCost = 0;
                for(let j=0;j<info.sources.length;j++){
                    iterationCost += matrixad[info.sources[j]][permutations[i][j]];
                }
                if(iterationCost > resultCost){ 
                    resultCost = iterationCost;
                    solution = permutations[i];
                }
            }
            Swal.fire({
              icon: 'success',
              title: 'Costo Maximo',
              text: 'El costo maximo es '+resultCost
            })
        }
        if(task == "min"){
            document.getElementById("matrizFinal").innerHTML = "";
            resultCost = 1000000;
            for(let i=0;i<permutations.length;i++){
                let iterationCost = 0;
                for(let j=0;j<info.sources.length;j++){
                    iterationCost += matrixad[info.sources[j]][permutations[i][j]];
                }
                if(iterationCost < resultCost){ 
                    resultCost = iterationCost;
                    solution = permutations[i];
                }
            }
            response.message = response.message.concat("El costo minimo es ",resultCost," <br> \n");
        }
        for(let i=0;i<info.sources.length;i++){
            a=consegirlabel(info.sources[i]);
            b=consegirlabel(solution[i]);
            edges.forEach((edge) => {
                if(parseInt(edge.from)==info.sources[i]&&parseInt(edge.to)==solution[i]){
                    matrixad[parseInt(edge.from)][parseInt(edge.to)] = "("+parseInt(edge.label)+")";
                }              
            });
            let object1 = {
                  type: "node",
                  id: info.sources[i],
                  color: colors[i]
              };
            let object2 = {
                type: "edge",
                source: info.sources[i],
                target: solution[i],
                color: colors[i]
            };
            
            let object3 = {
                type: "node",
                id: solution[i],
                color: colors[i]
            };
            response.array.push(object1);
            response.array.push(object2);
            response.array.push(object3);
        }
    }

    var gg = matrixad.slice(0, matrixad.length/2)

    console.log("gg", gg)
    var ff = gg.map(f=>{
        return f.slice(f.length/2);
    })
    
    console.log("Matriz Cortada: ", ff)
    genera_tabla(ff);

    Swal.fire({
      icon: 'success',
      title: 'Costo Calculado',
      text: response.message
    })
    return response;
}


function consegirlabel(id1){
    var label="";
    nodes.forEach((node)=>{
        if(node.id==id1){
            label= node.label;
        }
    });
    return label;
}
  
function swap (alphabets, index1, index2) {
    let temp = alphabets[index1];
    alphabets[index1] = alphabets[index2];
    alphabets[index2] = temp;
    return alphabets;
}
    
function permute (alphabets, startIndex, endIndex) {
    let aux = [];
    if (startIndex === endIndex) {
        for(let i=0;i<alphabets.length;i++){
            aux.push(alphabets[i]);
        }
        permutations.push(aux);
    } else {
        for (let i = startIndex; i <= endIndex; i++) {
            alphabets = swap(alphabets, startIndex, i);
            permute(alphabets, startIndex + 1, endIndex);
            alphabets = swap(alphabets, i, startIndex);
        }
    }
}

function correctMatrix(matrixad, info){
    let sources = [];
    let destinies = [];
    for(let i=0;i<matrixad.length;i++){
        let isDestiny = true;
        for(let j=0;j<matrixad.length;j++){
            if(matrixad[i][j]!=0){
                isDestiny = false;
            }
        }
        if(isDestiny){
            destinies.push(i);
        }
    }
    info.destinies = destinies;
    
    for(let i=0;i<matrixad.length;i++){
        let isSource = true;
        for(let j=0;j<matrixad.length;j++){
            if(matrixad[j][i]!=0){
                isSource = false;
            }
        }
        if(isSource){
            sources.push(i);
        }
    }
    info.sources = sources;
    let newMatrix = [];
    
    for(let i=0;i<sources.length;i++){
        let newRow = [];
        for(let j=0;j<destinies.length;j++){
            newRow.push(matrixad[sources[i]][destinies[j]]);
        }
        newMatrix.push(newRow);
    }
    return newMatrix;
}

function mat(matriz1){
    nodo1= [];
    
    nodes.forEach((node) => {
        nodo1.push({id:node.id, label:node.label, title:node.title, color:node.color});
    });
    var cad='<table class="table table-striped><tr><td></td>';
    for (i=0;i<nodes.length;i++){
        cad=cad+'<td>'+nodo1[i]["label"]+'</td>';
    }

    cad=cad+'</tr>';
    
    for(j=0;j<nodes.length;j++){
        cad=cad+'<tr><td>'+nodo1[j]["label"]+'</td>';
  
        for(k=0;k<nodes.length;k++){
            cad=cad+'<td>'+matriz1[j][k]+'</td>';
        }
        cad=cad+'</tr>';
    }

    cad=cad+'</table>';
    let ma= {
        ca: cad
    };
    return ma;
}
  
function genera_tabla(matriz1) {
    nodo1= [];
    
    nodes.forEach((node) => {
        nodo1.push({id:node.id, label:node.label, title:node.title, color:node.color});
    });
    var body = document.getElementsByTagName("body")[0];
    let finalTable = document.getElementById("matrizFinal");

    var tabla   = document.createElement("table");
    var tblBody = document.createElement("tbody");
     
    for (var i = 0; i < 1; i++) {
        var hilera = document.createElement("tr");
        for (var j = 0; j < 1; j++) {
            var celda = document.createElement("td");
            var textoCelda = document.createTextNode(" ");
            celda.appendChild(textoCelda);
            hilera.appendChild(celda);
        }
        for (var j = nodes.length/2; j < nodes.length; j++) {
            var celda = document.createElement("td");
            var textoCelda = document.createTextNode(nodo1[j]["label"]);
            celda.appendChild(textoCelda);
            hilera.appendChild(celda);
        }
        tblBody.appendChild(hilera);
    }

    for (var i = 0; i < nodes.length/2; i++) {
        var hilera = document.createElement("tr");
        var celda = document.createElement("td");
        var textoCelda = document.createTextNode(nodo1[i]["label"]);
        celda.appendChild(textoCelda);
        hilera.appendChild(celda);
  
        for (var j = 0; j < nodes.length/2; j++) {
            var celda = document.createElement("td");
            var textoCelda = document.createTextNode(matriz1[i][j]);
            celda.appendChild(textoCelda);
            hilera.appendChild(celda);
        }
    
        tblBody.appendChild(hilera);
    }

    tabla.appendChild(tblBody);
    finalTable.appendChild(tblBody);
    body.appendChild(tabla);
    tabla.setAttribute("border", "2");
}

    