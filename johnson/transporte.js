var nodeIdCounter = 0;
var edgesIdCounter = 0;

var nodes = new vis.DataSet([]);

var edges = new vis.DataSet([]);

var container = document.getElementById("mynetwork");

var disp = 0;
var dem = 0;

var cargado = false;

var data = {
    nodes: nodes,
    edges: edges,
};

var options = {
  width: "100%",
  height: "400px",
  manipulation: {
    addNode: function (nodeData, callback) {
        añadirNodo(nodeData, callback)
    },

    editNode: function (nodeData, callback){
      editarNodo(nodeData, callback)
    },
    addEdge: function (edgeData, callback) {
      añadirEnlace(edgeData, callback)
    },
    editEdge: function (edgeData, callback){
      editarEnlace(edgeData, callback)
    },
    "initiallyActive": true
  },



  edges:{
    arrows:{
        to:{
            enabled: true
        }
    }
}
};

function añadirNodo (nodeData, callback) {
    if (nodes.length === 0) {
        nodeIdCounter = 0;
    }
    var valor;

    var label = prompt("Nombre del nodo:");
    
    nodeData.id = nodeIdCounter++;
    nodeData.label = label;
    nodeData.title = "Nodo " + label;   
    
    //oferta y demanda
    //var valor = prompt("Oferta (O)   Demanda (D)");
    //if(valor=="O"){
    if (window.confirm('Disponibilidad (Aceptar)   Demanda (Cancelar)')){
        nodeData.tipo = true;
        valor = prompt("Disponibilidad:");
        disp = disp + 1;
    }else{
        nodeData.tipo = false;
        valor = prompt("Demanda:");
        dem = dem + 1;
    }
    nodeData.valor = valor;
    callback(nodeData);
}

const editarNodo = (nodeData, callback) => {
  var label = prompt("Nuevo nombre del nodo:");
  nodeData.label = label;
  nodeData.title = "Nodo " + label;
  callback(nodeData);
}

const añadirEnlace = (edgeData, callback) => {
    if (edges.length === 0) {
        edgesIdCounter = 0;
    }

    if (edgeData.from === edgeData.to) {
        var r = confirm("Esta seguro de querer unir el mismo nodo");
        if (r === true) {
            var label = prompt("Ingrese el valor del atributo: ");
            edgeData.id = edgesIdCounter++;
            edgeData.label = label;
            callback(edgeData);
        }
    } 
    else {
        var label = prompt("Ingrese el valor del atributo: ");
        edgeData.id = edgesIdCounter++;
        edgeData.label = label;
        callback(edgeData);
    }
}

const editarEnlace = (edgeData, callback) => {
    var label = prompt("Ingrese el nuevo valor del atributo: ");
    edgeData.label = label;
    callback(edgeData);
}

//transporte
function transporte(task){
    nod1=[];
    nodes.forEach(nod => {
        nod1.push({id: nod.id, nodeInputModalName: nod.label, nodeInputModalValue: parseInt(nod.valor) });
    });

    let matrixad = Array(nodes.length).fill(0).map(() => Array(nodes.length).fill(0));
    
    edges.forEach((edge) => {
        matrixad[parseInt(edge.from)][parseInt(edge.to)] = parseInt(edge.label);
    });
    noroeste(matrixad, nod1, task);
}

function genera_tabla(matriz1) {
    document.getElementById("matrizFinal").innerHTML = "";
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
        for (var j = disp; j < nodes.length; j++) {
            var celda = document.createElement("td");
            var textoCelda = document.createTextNode(nodo1[j]["label"]);
            celda.appendChild(textoCelda);
            hilera.appendChild(celda);
        }
        tblBody.appendChild(hilera);
    }

    for (var i = 0; i < disp; i++) {
        var hilera = document.createElement("tr");
        var celda = document.createElement("td");
        var textoCelda = document.createTextNode(nodo1[i]["label"]);
        celda.appendChild(textoCelda);
        hilera.appendChild(celda);
  
        for (var j = 0; j < dem; j++) {
            var celda = document.createElement("td");
            if(matriz1[i][j]==0){
                var textoCelda = document.createTextNode(matriz1[i][j]);
            }else{
                var textoCelda = document.createTextNode("("+matriz1[i][j]+")");
            }
            
            celda.appendChild(textoCelda);
            hilera.appendChild(celda);
        }
    
        tblBody.appendChild(hilera);
    }

    tabla.appendChild(tblBody);
    finalTable.appendChild(tblBody);
    body.appendChild(tabla);
    tabla.setAttribute("border", "2");
    console.log("Demanda", dem);
    console.log("Disponibilidad", disp)
}

function noroeste(matrizad, nodes, task){
    let matriz1 = Array(nodes.length)
      .fill(0)
      .map(() => Array(nodes.length).fill(0));
    let colors = ["#800000","#FF0000","#FFA500","#808000","#800080","#FF00FF","#008000","#000080","#0000FF","#008080","#000000","#808080"];
    let response = {
        array: [],
        message: "",
    };
    let info = {
        sources: [],
        destinies: [],
        demand: [],
        disponibility: [],
        cost_matrix: []
    };
    let correctness = check_correctness(matrizad,nodes,info);
    if(correctness){
        console.log("SOURCES");
        console.log(info.sources.join(','));
        console.log("DESTINIES");
        console.log(info.destinies.join(','));
        console.log("DISPONIBILITY");
        console.log(info.disponibility.join(','));
        console.log("DEMAND");
        console.log(info.demand.join(','));
        console.log("Cost Matrix");
        console.log(info.cost_matrix.join("\n"));

        //Solution
        //Precharge Solution
        let sol = [];
        for(let i=0;i<info.cost_matrix.length;i++){
            let aux = [];
            for(let j=0;j<info.cost_matrix[i].length;j++){
                aux.push(0);
            }
            sol.push(aux);
        }
        if(task == "max"){
            document.getElementById("matrizFinal").innerHTML = "";
            //Maximization
            while(sum(info.disponibility)>0 && sum(info.demand)>0){
                //Calculate penalities and identify the maximum penality
                //rows
                let max_penalty_row = -1;
                let id_penalty_row = -1;
                let aux = [];
                for(let i=0;i<info.cost_matrix.length;i++){
                    aux = [];
                    for(let j=0;j<info.cost_matrix[i].length;j++){
                        if(info.disponibility[i]!=0 && info.demand[j]!=0){
                            aux.push(info.cost_matrix[i][j]);
                        }
                        if(aux.length > 0){
                            let penalty_row = calc_penalty_max(aux);
                            if(penalty_row>max_penalty_row){
                                max_penalty_row = penalty_row;
                                id_penalty_row = i;
                            }
                        }
                    }
                }
                let max_penalty_col = -1;
                let id_penalty_col = -1;
                aux = [];
                for(let i=0;i<info.cost_matrix[0].length;i++){
                    aux = [];
                    for(let j=0;j<info.cost_matrix.length;j++){
                        if(info.disponibility[j]!=0 && info.demand[i]!=0){
                            aux.push(info.cost_matrix[j][i]);
                        }
                        if(aux.length>0){
                            let penalty_col = calc_penalty_max(aux);
                            if(penalty_col>max_penalty_col){
                                max_penalty_col= penalty_col;
                                id_penalty_col = i;
                            }
                        }
                    }
                }
                if(max_penalty_row >= max_penalty_col){
                    let target = get_col_of_maximum_value_row(info.cost_matrix,id_penalty_row,info.disponibility,info.demand);
                    if(info.disponibility[id_penalty_row]>=info.demand[target]){
                        info.disponibility[id_penalty_row] -= info.demand[target];
                        sol[id_penalty_row][target] = info.demand[target];
                        info.demand[target] = 0;
                    }
                    else{
                        info.demand[target] -= info.disponibility[id_penalty_row];
                        sol[id_penalty_row][target] = info.disponibility[id_penalty_row];
                        info.disponibility[id_penalty_row] = 0;
                    }
                }
                else{
                    //search for 
                    let target = get_row_of_maximum_value_col(info.cost_matrix,id_penalty_col,info.disponibility,info.demand);
                    if(info.disponibility[target]>=info.demand[id_penalty_col]){
                        info.disponibility[target] -= info.demand[id_penalty_col];
                        sol[target][id_penalty_col] = info.demand[id_penalty_col];
                        info.demand[id_penalty_col] = 0;
                    }
                    else{
                        info.demand[id_penalty_col] -= info.disponibility[target];
                        sol[target][id_penalty_col] = info.disponibility[target];
                        info.disponibility[target] = 0;
                    }
                }
            }
            console.log(sol.join("\n"));
        }
        else{
            document.getElementById("matrizFinal").innerHTML = "";
            while(sum(info.disponibility)>0 && sum(info.demand)>0){
                let max_penalty_row = -1;
                let id_penalty_row = -1;
                let aux = [];
                for(let i=0;i<info.cost_matrix.length;i++){
                    aux = [];
                    for(let j=0;j<info.cost_matrix[i].length;j++){
                        if(info.disponibility[i]!=0 && info.demand[j]!=0){
                            aux.push(info.cost_matrix[i][j]);
                        }
                        if(aux.length > 0){
                            let penalty_row = calc_penalty_min(aux);
                            if(penalty_row>max_penalty_row){
                                max_penalty_row = penalty_row;
                                id_penalty_row = i;
                            }
                        }
                    }
                }
                let max_penalty_col = -1;
                let id_penalty_col = -1;
                aux = [];
                for(let i=0;i<info.cost_matrix[0].length;i++){
                    aux = [];
                    for(let j=0;j<info.cost_matrix.length;j++){
                        if(info.disponibility[j]!=0 && info.demand[i]!=0){
                            aux.push(info.cost_matrix[j][i]);
                        }
                        if(aux.length>0){
                            let penalty_col = calc_penalty_min(aux);
                            if(penalty_col>max_penalty_col){
                                max_penalty_col= penalty_col;
                                id_penalty_col = i;
                            }
                        }
                    }
                }
                //maximize penalty
                if(max_penalty_row >= max_penalty_col){
                    //search for row
                    let target = get_col_of_minimum_value_row(info.cost_matrix,id_penalty_row,info.disponibility,info.demand);
                    if(info.disponibility[id_penalty_row]>=info.demand[target]){
                        info.disponibility[id_penalty_row] -= info.demand[target];
                        sol[id_penalty_row][target] = info.demand[target];
                        info.demand[target] = 0;
                    }
                    else{
                        info.demand[target] -= info.disponibility[id_penalty_row];
                        sol[id_penalty_row][target] = info.disponibility[id_penalty_row];
                        info.disponibility[id_penalty_row] = 0;
                    }
                }
                else{
                    //search for 
                    let target = get_row_of_minimum_value_col(info.cost_matrix,id_penalty_col,info.disponibility,info.demand);
                    if(info.disponibility[target]>=info.demand[id_penalty_col]){
                        info.disponibility[target] -= info.demand[id_penalty_col];
                        sol[target][id_penalty_col] = info.demand[id_penalty_col];
                        info.demand[id_penalty_col] = 0;
                    }
                    else{
                        info.demand[id_penalty_col] -= info.disponibility[target];
                        sol[target][id_penalty_col] = info.disponibility[target];
                        info.disponibility[target] = 0;
                    }
                }
            }
            console.log(sol.join("\n"));
        }
        //Fill animation

        let total_cost = 0,color_id = 0;;
        for(let i=0;i<sol.length;i++){
            for(let j=0;j<sol[i].length;j++){
                if(sol[i][j]>0){
                    total_cost += (sol[i][j]*info.cost_matrix[i][j]);
                    let object = {
                        type: "edge",
                        source: info.sources[i],
                        target: info.destinies[j],
                        color: colors[color_id%12],
                        ro: sol[i][j]
                    };
                    response.array.push(object);
                    console.log(info.sources[i]);
                    console.log(info.destinies[j]);
                    
                    matriz1[parseInt(info.sources[i])][parseInt(info.destinies[j])] = (sol[i][j].toString());
                      
                   //response.message = response.message + label_of(info.sources[i],nodes) + " envia " + sol[i][j].toString() + " unidades a "+ label_of(info.destinies[j],nodes)+ "#";
                    color_id += 1;
                }
            }
        }
        alert("El costo total es " + total_cost.toString());
    }
    else{
        alert("La demanda no coincide con la disponibilidad");
    }
    console.log(matriz1);

    var gg = matriz1.slice(0, dem)

    console.log("gg", gg)

    var ff = gg.map(f=>{
        return f.slice(disp);
    })
    
    console.log("Matriz Cortada: ", ff)

    genera_tabla(ff);

    return response;
}

function label_of(target, nodes){
    let res;
    for(let i=0;i<nodes.length;i++){
        if(nodes[i].id == target){
            res = nodes[i].nodeInputModalName;
        }
    }
    return res;
}

function calc_penalty_max(lista){
    let res =0;
    if(lista.length>1){
        //1st iteration
        let pos,max_value1=-1;
        for(let i=0;i<lista.length;i++){
            if(lista[i]>max_value1){
                max_value1 = lista[i];
                pos = i;
            }
        }
        lista[pos] = -1;
        //2nd iteration
        let max_value2 = -1;
        for(let i=0;i<lista.length;i++){
            if(lista[i]>max_value2){
                max_value2 = lista[i];
            }
        }
        res = max_value1 - max_value2;
    }
    else{
        res = lista[0];
    }
    return res;

}

function calc_penalty_min(lista){
    let res =0;
    if(lista.length>1){
        //1st iteration
        let pos,min_value1=1000000000;
        for(let i=0;i<lista.length;i++){
            if(lista[i]<min_value1){
                min_value1 = lista[i];
                pos = i;
            }
        }
        lista[pos] = 1000000000;
        //2nd iteration
        let min_value2 = 1000000000;
        for(let i=0;i<lista.length;i++){
            if(lista[i]<min_value2){
                min_value2 = lista[i];
            }
        }
        res = min_value2 - min_value2;
    }
    else{
        res = lista[0];
    }
    return res;

}

function get_col_of_maximum_value_row(cost, row, disponibility, demand){
    let pos_max, max_val = -1;
    for(let i=0;i<cost[row].length;i++){
        if(disponibility[row]!=0 && demand[i]!=0){
            if(cost[row][i]>max_val){
                max_val = cost[row][i];
                pos_max = i;
            }
        }
    }
    return pos_max;
}

function get_row_of_maximum_value_col(cost, col, disponibility, demand){
    let pos_max, max_val = -1;
    for(let i=0;i<cost.length;i++){
        if(disponibility[i]!=0 && demand[col]!=0){
            if(cost[i][col]>max_val){
                max_val = cost[i][col];
                pos_max = i;
            }
        }
    }
    return pos_max;
}

function get_col_of_minimum_value_row(cost, row, disponibility, demand){
    let pos_max, min_val = 1000000000;
    for(let i=0;i<cost[row].length;i++){
        if(disponibility[row]!=0 && demand[i]!=0){
            if(cost[row][i]<min_val){
                min_val = cost[row][i];
                pos_max = i;
            }
        }
    }
    return pos_max;
}

function get_row_of_minimum_value_col(cost, col, disponibility, demand){
    let pos_max, min_val = 1000000000;
    for(let i=0;i<cost.length;i++){
        if(disponibility[i]!=0 && demand[col]!=0){
            if(cost[i][col]<min_val){
                min_val = cost[i][col];
                pos_max = i;
            }
        }
    }
    return pos_max;
}

function sum(lista){
    let sum = 0;
    for(let i=0;i<lista.length;i++){
        sum += lista[i];
    }
    return sum;
}

function check_correctness(matrizad, nodes, info){
    let total_demand = 0, total_disponibility = 0;
    let res = false;
    for(let i=0;i<nodes.length;i++){
        let current_node = nodes[i].id;
        let value_node = nodes[i].nodeInputModalValue;
        if(is_source(current_node, matrizad)){
            total_disponibility += value_node;
            info.sources.push(current_node);
            info.disponibility.push(value_node);
        }
        else{
            total_demand += value_node;
            info.destinies.push(current_node);
            info.demand.push(value_node);
        }
    }
    for(let i=0;i<info.sources.length;i++){
        let aux = [];
        for(let j=0;j<info.destinies.length;j++){
            aux.push(matrizad[info.sources[i]][info.destinies[j]]);
        }
        info.cost_matrix.push(aux);
    }
    if(total_demand == total_disponibility){
        res = true;
    }
    return res;
}

function is_source(id, matrizad){
    let res = true;
    for(let i=0;i<matrizad.length;i++){
        if(matrizad[i][id]!=0){
            res = false;
        }
    }
    return res;
}

//Guardar archivo
function Arraydenodos() {
    var array1=[];
    var array2=[];
    const s = nodes.forEach((nodo) => {
        array1.push({id: nodo.id, label: nodo.label, valor: nodo.valor, tipo: nodo.tipo});
    });
    const n = edges.forEach((linea) => {
        array2.push({from: linea.from, to: linea.to, id: linea.id, label: linea.label});
    });
    var data1={
        node:array1,
        edge:array2,
  
    };  
    return(data1);
} 
  
function descarga(){
    filename=prompt("Ingrese el nombre del archivo: ");
  
    let file=new Blob([JSON.stringify(Arraydenodos())],{type:"aplication/.json"});
    let a=document.createElement("a");
    a.href= URL.createObjectURL(file);
    a.download= filename+'.json';
    a.click();
}

//Recuperar
var network2=null;
  
function cargar(dn,de){
    cargado = true;
    nodeIdCounter ==dn[dn.length-1]["id"];
    nodeIdCounter ++;
    nodes = new vis.DataSet(dn);
    edges = new vis.DataSet(de);
    edgesIdCounter = de[de.length-1]["id"];
    edgesIdCounter++;
    data={
        nodes: nodes,
        edges: edges,
    };
    arrayNodos = []
    
    data.nodes.forEach((n)=> {
        console.log("Valor de n: ", n)
        arrayNodos.push(n)});
    

    console.log("Nodos: ",nodes);
    console.log(typeof nodes)
    console.log("Array Nodos: ",arrayNodos)

    let dem1 = arrayNodos.filter((d) => d.tipo == false).length;
    let disp1 = arrayNodos.filter((d) => d.tipo == true).length;
    
    console.log("Demanda1", dem1)
    console.log("Disponibilidad1", disp1)
    
    if(cargado){
        dem = dem1;
        disp = disp1;
    }
    network2= new vis.Network(container,data,options);
    
}
  
if(network2!=null){
    network=network2;
}
  
function leerArchivo(e){
    var archivo= e.target.files[0];
    if(!archivo){
        return;
    }
    var lector= new FileReader();
    lector.onload= function(e){
        var contenido= e.target.result;
        gf=JSON.parse(contenido);
        cargar(gf["node"],gf["edge"]);
    }
    lector.readAsText(archivo);
}
  
function mostrar(contenido){
    var gf
    gf=JSON.parse(contenido);
    console.log(gf["node"]);
}
  
document.getElementById('import').addEventListener('change', leerArchivo, false);
  
//Limpiar area
function Limpiar() {
    location.reload();
}
  
var network = new vis.Network(container, data, options);
