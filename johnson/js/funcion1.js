var container = document.getElementById("mynetwork");
var nodes = new vis.DataSet();
var edges = new vis.DataSet();
var flag=0;
var nombres = [];
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
      var no = true;
      var n = nodes;
      for(var i=0;i<nombres.length;i++)
      {
        console.log(nodes[i]);
        if(nodes != null){
          if(resultado.value == nombres[i]  )
        {
         
             no=false;
          break;
        }
        }
      }
        if(no){
          if (resultado.value) {
            var auxid = 0;
            let nombre = resultado.value;
            console.log("Hola, " + nombre);
            nodeData.label=nombre;
            nombres.push(nombre);
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
          no = true;
      }
      
        }else{
          alert("Ese nombre esta en uso");
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
   var cellText = document.createTextNode("SUM");
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
  var cellText = document.createTextNode("SUM");
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
      document.getElementById('referencia').style.visibility = 'visible';
      nodes.forEach((node)=>{
        nodes.update({id:node.id,color:{background:"#939A9A"}});;
      });
      edges.forEach((edge)=>{
        edges.update({id:edge.id,label:edge.valor,color:{color:"#939A9A"}});;
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
          edges.update({id:edge.id,label:edge.label+"\n"+edge.sublabel1,color:{color:"#8AE35F"}}); 
          nodes.update({id:edge.to,color:{background:"#8AE35F"}});
          nodes.update({id:edge.from,color:{background:"#8AE35F"}});

        }
        else{
          edges.update({id:edge.id,label:edge.label+"\n"+edge.sublabel1});
           
        }
       
      });
      
        
      
      
    }
    function kruskal(){
      document.getElementById('referencia').style.visibility = 'visible';
      nodes.forEach((node)=>{
        nodes.update({id:node.id,color:{background:"#939A9A"}});;
      });
      edges.forEach((edge)=>{
        edges.update({id:edge.id,label:edge.valor,color:{color:"#939A9A"}});;
      });

      var valores=[];
      var froms=[];
      var tos=[];
      var x=0;
      var i=0;
      edges.forEach((edge)=>{ 
        valores.push(edge.valor);
        valores.sort();
        valores.reverse();
        console.log(valores);
      });
      const result = valores.reduce((acc,item)=>{
        if(!acc.includes(item)){
          acc.push(item);
        }
        return acc;
      },[])
      console.log(result);
      var p=1;
      for(var l=0;l<valores.length;l++)
      {
        console.log("PPP");
        if(i%2==0)
        {
          p=p+1;
        }
        edges.forEach((edge)=>{
          x=0;
          console.log("llll");
          if(edge.valor==result[i])
          {
            console.log(result[i]);
            console.log(froms);
            console.log(tos);
            const even = (element) => element == edge.to;
            const even1 = (element) => element == edge.from;
            if(tos.some(even))
            {
              x=x+1;
            }
            if(tos.some(even1))
            {
              x=x+1;
            }
            if(froms.some(even))
            {
              x=x+1;
            }
            if(froms.some(even1))
            {
              x=x+1;
            }
            if(x<p)
            {
              edges.update({id:edge.id,label:edge.label+"\n"+edge.sublabel1,color:{color:"#8AE35F"}}); 
              froms.push(edge.from);
              tos.push(edge.to);
            }  
          }       
        });
        i=i+1;
      }   
      
    }
    function kruskal2() {
        edges.forEach((edge)=>{
            if(edge.valor<0){
                edge.valor= edge.valor * -1;
            }
            
            });

        document.getElementById('btnMatriz').style.visibility = 'Minimizar';
      nodes.forEach((node)=>{
        nodes.update({id:node.id,color:{background:"#000080"}});;
      });
      edges.forEach((edge)=>{
         // edge.valor=edge.valor*-1;
        edges.update({id:edge.id,label:edge.valor,color:{color:"#000080"}});;
      });

      

          var g = new jsgraphs.WeightedGraph(edges.length);
          edges.forEach((edge)=>{
            g.addEdge(new jsgraphs.Edge(edge.to, edge.from, edge.valor));
          });
          var kruskal = new jsgraphs.KruskalMST(g); 
          var mst = kruskal.mst;
          var g_nodes = [];
          var g_edges = [];
          var v=0;
          nodes.forEach((node)=>{
            v++;
            g_nodes.push({
               id: v,
            });
          });
          for(var i=0; i < mst.length; ++i) {
            var e = mst[i];
            var v = e.either();
            var w = e.other(v);
            e.highlighted = true;
            console.log('(' + v + ', ' + w + '): ' + e.weight);
            edges.forEach((edge)=>{
              if(edge.from == w && edge.to==v)
                
                edges.update({id:edge.id,label:edge.label+"\n"+edge.sublabel1,color:{color:"#8AE35F"}}); 
                nodes.update({id:edge.to,color:{background:"#8AE35F"}});
                nodes.update({id:edge.from,color:{background:"#8AE35F"}});

            });
            g_edges.push({
                from: v,
                to: w,
                length: e.weight,
                label: '' + e.weight,
                color: '#ff0000',
                value: 2
            });
        }
        
        for(var v = 0; v < g.V; ++v) {
            
            var adj_v = g.adj(v);
            for(var i = 0; i < adj_v.length; ++i) {
                var e = adj_v[i];
                var w = e.other(v);
                if(w > v) continue; // make sure only one edge between w and v since the graph is undirected
                if(e.highlighted) continue;
                
                g_edges.push({
                    from: v,
                    to: w,
                    length: e.weight,
                    label: '' + e.weight
                });
            };
        }
    
        console.log(g.V); // display 6, which is the number of vertices in g
        console.log(g.adj(0)); // display [5, 1, 2], which is the adjacent list to vertex 0
    
          }
          
    function kruskal1() {
    console.log("Entrar prueba");
    document.getElementById('btnMatriz').style.visibility = 'Maximizar';
      nodes.forEach((node)=>{
        nodes.update({id:node.id,color:{background:"#000080"}});;
      });
      edges.forEach((edge)=>{
        edges.update({id:edge.id,label:edge.valor,color:{color:"#000080"}});;
      });
      
    edges.forEach((edge)=>{
        if(edge.valor>0){
            edge.valor= edge.valor * -1;
        }
        
        });
      var g = new jsgraphs.WeightedGraph(edges.length);
      edges.forEach((edge)=>{
        g.addEdge(new jsgraphs.Edge(edge.to, edge.from, edge.valor));
      });
      var kruskal = new jsgraphs.KruskalMST(g); 
      var mst = kruskal.mst;
      var g_nodes = [];
      var g_edges = [];
      var v=0;
      nodes.forEach((node)=>{
        v++;
        g_nodes.push({
           id: v,
        });
      });
      for(var i=0; i < mst.length; ++i) {
        var e = mst[i];
        var v = e.either();
        var w = e.other(v);
        e.highlighted = true;
        console.log('(' + v + ', ' + w + '): ' + e.weight);
        edges.forEach((edge)=>{
          if(edge.from == w && edge.to==v)
          edges.update({id:edge.id,label:edge.label+"\n"+edge.sublabel1,color:{color:"#8AE35F"}}); 
          nodes.update({id:edge.to,color:{background:"#8AE35F"}});
          nodes.update({id:edge.from,color:{background:"#8AE35F"}});

        });
        g_edges.push({
            from: v,
            to: w,
            length: e.weight,
            label: '' + e.weight,
            color: '#ff0000',
            value: 2
        });
    }
    
    for(var v = 0; v < g.V; ++v) {
        
        var adj_v = g.adj(v);
        for(var i = 0; i < adj_v.length; ++i) {
            var e = adj_v[i];
            var w = e.other(v);
            if(w > v) continue; // make sure only one edge between w and v since the graph is undirected
            if(e.highlighted) continue;
            
            g_edges.push({
                from: v,
                to: w,
                length: e.weight,
                label: '' + e.weight
            });
        };
    }

    console.log(g.V); // display 6, which is the number of vertices in g
    console.log(g.adj(0)); // display [5, 1, 2], which is the adjacent list to vertex 0

      }

      var jsgraphs = jsgraphs || {};

      (function(jss){
          
          jss.less = function(a1, a2, compare) {
              return compare(a1, a2) < 0;
          };
          
          jss.exchange = function(a, i, j) {
              var temp = a[i];
              a[i] = a[j];
              a[j] = temp;
          };
          
          var StackNode = function (value) {
              this.value = value;
              this.next = null;
          };
          
          jss.StackNode = StackNode;
          
          var Stack = function() {
              this.N = 0;
              this.first = null;
          };
          
          Stack.prototype.push = function (a) {
              this.first = this._push(this.first, a);  
          };
          
          Stack.prototype._push = function(x, a) {
              if(x == null) {
                  this.N++;
                  return new jss.StackNode(a);
              }  
              var oldX = x;
              this.N++;
              x = new jss.StackNode(a);
              x.next = oldX;
              return x;
          };
          
          Stack.prototype.pop = function () {
              if (this.first == null) {
                  return undefined;
              }  
              
              var oldFirst = this.first;
              var item = oldFirst.value;
              this.first = oldFirst.next;
              this.N--;
              
              return item;
          };
          
          Stack.prototype.size = function() {
              return this.N;  
          };
          
          Stack.prototype.isEmpty = function() {
              return this.N == 0;  
          };
          
          Stack.prototype.peep = function() {
              if (this.first == null) {
                  return undefined;
              }  
              
              return this.first.value;
          };
          
          Stack.prototype.toArray = function() {
              var result = [];
              x = this.first;
              while (x != null) {
                  result.push(x.value);
                  x = x.next;
              }
              return result;
          };
          
          jss.Stack = Stack;
          
          var QueueNode = function(a) {
              this.value = a;  
              this.next = null;
          };
          
          jss.QueueNode = QueueNode;
          
          var Queue = function() {
              this.first = null;
              this.last = null;
              this.N = 0;
          };
          
          Queue.prototype.enqueue = function(item) {
              var oldLast = this.last;
              this.last = new jss.QueueNode(item);
              if(oldLast != null){
                  oldLast.next = this.last;
              }
              if (this.first == null) {
                  this.first = this.last;
              }
              this.N++;
          };
          
          Queue.prototype.dequeue = function() {
              if(this.first == null) {
                  return undefined;
              }  
              
              var oldFirst = this.first;
              var item = oldFirst.value;
              this.first = oldFirst.next;
              
              if(this.first == null) {
                  this.last = null;
              }
              
              this.N--;
              
              return item;
          };
          
          Queue.prototype.size = function() {
              return this.N;  
          };
          
          Queue.prototype.isEmpty = function() {
              return this.N == 0;
          };
          
          Queue.prototype.toArray = function() {
              var result = [];
              var x = this.first;
              while (x != null) {
                  result.push(x.value);
                  x = x.next;
              }
              return result;
          };
          
          jss.Queue = Queue;
          
          var MinPQ = function(compare) {
              this.s = [];
              this.N = 0;
              if(!compare) {
                  compare = function(a1, a2) {
                      return a1 - a2;
                  };
              }
              this.compare = compare;;
          };
          
          MinPQ.prototype.enqueue = function(item) {
              while(this.s.lengh <= this.N+1) {
                  this.s.push(0);
              }   
              this.s[++this.N] = item;
              this.swim(this.N);
          };
          
          MinPQ.prototype.swim = function(k) {
              while (k > 1){
                  var parent = Math.floor(k / 2);
                  if(jss.less(this.s[k], this.s[parent], this.compare)){
                      jss.exchange(this.s, k, parent);
                      k = parent;
                  } else {
                      break;
                  }
              }
          };
          
          MinPQ.prototype.delMin = function() {
              if(this.N == 0) {
                  return undefined;
              }  
              
              var item = this.s[1];
              jss.exchange(this.s, 1, this.N--);
              this.sink(1);
              return item;
          };
          
          MinPQ.prototype.sink = function(k) {
              while(k * 2 <= this.N) {
                  var child = 2 * k;
                  if(child < this.N && jss.less(this.s[child+1], this.s[child], this.compare)){
                      child++;
                  }
                  if(jss.less(this.s[child], this.s[k], this.compare)){
                      jss.exchange(this.s, child, k);
                      k = child;
                  } else {
                      break;
                  }
              }  
          };
          
          MinPQ.prototype.size = function(){
              return this.N;
          };
          
          MinPQ.prototype.isEmpty = function() {
              return this.N == 0;
          };
          
          jss.MinPQ = MinPQ;
          
          var QuickUnion = function(V) {
              this.id = [];
              for (var v = 0; v < V; ++v) {
                  this.id.push(v);
              }
          };
          
          QuickUnion.prototype.union = function(v, w) {
              var q = this.root(v);
              var p = this.root(w);
              
              if(p != q) {
                  this.id[p] = q;
              }
          };
          
          QuickUnion.prototype.root = function(q) {
              while(this.id[q] != q) {
                  q = this.id[q];
              }  
              return q;
          };
          
          QuickUnion.prototype.connected = function(v, w) {
              return this.root(v) == this.root(w);  
          };
          
          jss.QuickUnion = QuickUnion;
          
          var IndexMinPQ = function(N, compare) {
              this.keys = [];
              this.pq = [];
              this.qp = []; // positions of key in pq
              for(var i = 0; i <= N; ++i) {
                  this.keys.push(null);
                  this.pq.push(0);
                  this.qp.push(-1);
              }
              this.N = 0;
              
              if(!compare) {
                  compare = function(a1, a2) {
                      return a1 - a2;  
                  };
              } 
              this.compare = compare;
          };
          
          IndexMinPQ.prototype.insert = function (index, key) {
              this.keys[index] = key;
              
              this.pq[++this.N] = index;
              this.qp[index] = this.N;
              this.swim(this.N);
          };
          
          IndexMinPQ.prototype.decreaseKey = function(index, key) {
              if(jss.less(key, this.keys[index], this.compare)){
                  this.keys[index] = key;
                  this.swim(this.qp[index]);
              }
          };
          
          IndexMinPQ.prototype.minKey = function() {
              return this.keys[this.pq[1]];  
          };
          
          IndexMinPQ.prototype.min = function() {
              return this.pq[1];  
          };
          
          IndexMinPQ.prototype.delMin = function() {
              var key = this.pq[1];
              jss.exchange(this.pq, 1, this.N);
              this.qp[this.pq[1]] = 1;
              
              this.qp[this.pq[this.N]] = -1;
              this.keys[this.pq[this.N]] = null;
          
              this.N--;
              
              this.sink(1);
              
              return key;
          };
          
          IndexMinPQ.prototype.swim = function (k) {
              while( k > 1) {
                  var parent = Math.floor(k / 2);
                  if(jss.less(this.keys[this.pq[k]], this.keys[this.pq[parent]], this.compare)){
                      jss.exchange(this.pq, k, parent);
                      this.qp[this.pq[k]] = k;
                      this.qp[this.pq[parent]] = parent;
                      k = parent;
                  } else {
                      break;
                  }
              }  
          };
          
          IndexMinPQ.prototype.sink = function (k) {
              while(2 * k <= this.N) {
                  var child = k * 2;
                  if(child < this.N && jss.less(this.keys[this.pq[child+1]], this.keys[this.pq[child]], this.compare)){
                      child++;
                  }
                  if(jss.less(this.keys[this.pq[child]], this.keys[this.pq[k]], this.compare)) {
                      jss.exchange(this.pq, k, child);
                      this.qp[this.pq[k]] = k;
                      this.qp[this.pq[child]] = child;
                      k = child;
                  } else {
                      break;
                  }
              }  
          };
          
          IndexMinPQ.prototype.containsIndex = function (index) {
              return this.qp[index] != -1;  
          };
          
          IndexMinPQ.prototype.isEmpty = function() {
              return this.N == 0;  
          };
          
          IndexMinPQ.prototype.size = function() {
              return this.N;
          }
          
          jss.IndexMinPQ = IndexMinPQ;
          
        var Graph = function (V) {
              this.V = V;
              this.adjList = [];
              this.nodeInfo = [];
              this.edges = {};
              for (var i = 0; i < V; ++i) {
                  this.adjList.push([]);
                  this.nodeInfo.push({});
              }
          };
          
          Graph.prototype.addEdge = function(v, w){
              this.adjList[v].push(w);
              this.adjList[w].push(v);
              var edge_id = v + '_' + w;
              if(v > w) {
                  edge_id = w + '_' + v;
              }
              this.edges[edge_id] = new jss.Edge(v, w, 0);
          };
          
          Graph.prototype.adj = function(v) {
              return this.adjList[v];  
          };
          
          Graph.prototype.node = function(v) {
              return this.nodeInfo[v];  
          };
          
          Graph.prototype.edge = function(v, w) {
              var edge_id = v + '_' + w;
              if(v > w) {
                  edge_id = w + '_' + v;
              }
              if (edge_id in this.edges) {
                  return this.edges[edge_id];
              }
              return null;
          };
          
          jss.Graph = Graph;
          
          var DiGraph = function(V) {
              this.V = V;
              this.adjList = [];
              this.nodeInfo = [];
              this.edges = {};
              for (var v = 0; v < V; ++v){
                  this.adjList.push([]);
                  this.nodeInfo.push({});
              }
          };
          
          DiGraph.prototype.addEdge = function(v, w){
              this.adjList[v].push(w);
              var edge_id = v + '_' + w;
              this.edges[edge_id] = new jss.Edge(v, w, 0);
          };
          
          DiGraph.prototype.edge = function(v, w) {
              var edge_id = v + '_' + w;
              if(edge_id in this.edges) {
                  return this.edges[edge_id];
              } else {
                  return null;
              }
          };
          
          DiGraph.prototype.adj = function(v) {
              return this.adjList[v];  
          };
          
          DiGraph.prototype.node = function(v) {
              return this.nodeInfo[v];  
          };
          
          DiGraph.prototype.reverse = function(){
              var g = new DiGraph(this.V);
              for (var v = 0; v < this.V; ++v) {
                  var adj_v = this.adjList[v];
                  for (var i = 0; i < adj_v.length; ++i){
                      var w = adj_v[i];
                      g.addEdge(w, v);
                  }
              }
              return g;
          };
          
          jss.DiGraph = DiGraph;
          
          var Edge = function(v, w, weight) {
              this.v = v;
              this.w = w;
              this.weight = weight;
          };
          
          Edge.prototype.either = function() {
              return this.v;
          };
          
          Edge.prototype.other = function(x) {
              return x == this.v ? this.w : this.v;
          };
          
          Edge.prototype.from = function() {
              return this.v;
          };
          
          Edge.prototype.to = function() {
              return this.w;
          };
          
          jss.Edge = Edge;
          
          var WeightedGraph = function(V) {
              this.V = V;
              this.adjList = [];
              this.nodeInfo = [];
              
              for ( var v = 0; v < V; ++v) {
                  this.adjList.push([]);
                  this.nodeInfo.push({});
              }
          };
          
          WeightedGraph.prototype.adj = function(v) {
              return this.adjList[v];  
          };
          
          WeightedGraph.prototype.edge = function(v, w) {
              var adj_v = this.adjList[v];
              for(var i=0; i < adj_v.length; ++i) {
                  var x = adj_v[i].other(v);
                  if(x == w) {
                      return adj_v[i];
                  }
              }
              return null;
          };
          
          WeightedGraph.prototype.node = function(v) {
              return this.nodeInfo[v];  
          };
          
          WeightedGraph.prototype.addEdge = function(e) {
              var v = e.either();
              var w = e.other(v);
              this.adjList[v].push(e);
              this.adjList[w].push(e);
          };
          
          jss.WeightedGraph = WeightedGraph;
          
          var WeightedDiGraph = function(V) {
              WeightedGraph.call(this, V);
          };
          
          WeightedDiGraph.prototype = Object.create(jss.WeightedGraph.prototype);
          
          WeightedDiGraph.prototype.addEdge = function(e) {
              var v = e.from();
              this.adjList[v].push(e);
          };
          
          WeightedDiGraph.prototype.edge = function(v, w) {
              var adj_v = this.adjList[v];
              for(var i=0; i < adj_v.length; ++i) {
                  var x = adj_v[i].other(v);
                  if(x == w) {
                      return adj_v[i];
                  }
              }
              return null;
          };
          
          WeightedDiGraph.prototype.toDiGraph = function() {
              var g = new jss.DiGraph(this.V);
              for(var v = 0; v < this.V; ++v) {
                  var adj_v = this.adjList[v];
                  for (var i =0; i < adj_v.length; ++i) {
                      var e = adj_v[i];
                      var w = e.other(v);
                      g.addEdge(v, w);
                  }
              }
              return g;
          };
          
          jss.WeightedDiGraph = WeightedDiGraph;
          
          var FlowEdge = function(v, w, capacity) {
              this.v = v;
              this.w = w;
              this.capacity = capacity;
              this.flow = 0;
          };
          
          FlowEdge.prototype.residualCapacityTo = function (x) {
              if(x == this.v) {
                  return this.flow;
              } else {
                  return this.capacity - this.flow;
              }
          };
          
          FlowEdge.prototype.addResidualFlowTo = function (x, deltaFlow) {
              if(x == this.v) {
                  this.flow -= deltaFlow;
              } else if(x == this.w) {
                  this.flow += deltaFlow;
              }
          };
          
          FlowEdge.prototype.from = function() {
              return this.v;
          };
          
          FlowEdge.prototype.to = function() {
              return this.w;
          };
          
          FlowEdge.prototype.other = function(x) {
              return x == this.v ? this.w : this.v;
          }
          
          
          jss.FlowEdge = FlowEdge;
          
          var FlowNetwork = function(V) {
              this.V = V;
              this.adjList = [];
              this.nodeInfo = [];
              for(var v = 0; v < V; ++v) {
                  this.adjList.push([]);
                  this.nodeInfo.push({});
              }
          };
          
          FlowNetwork.prototype.node = function(v) {
              return this.nodeInfo[v];
          };
          
          FlowNetwork.prototype.edge = function(v, w) {
              var adj_v = this.adjList[v];
              for(var i=0; i < adj_v.length; ++i) {
                  var x = adj_v[i].other(v);
                  if(x == w) {
                      return adj_v[i];
                  }
              }
              return null;
          };
          
          FlowNetwork.prototype.addEdge = function(e) {
              var v = e.from();
              this.adjList[v].push(e);
              var w = e.other(v);
              this.adjList[w].push(e);
          };
          
          FlowNetwork.prototype.adj = function(v) {
              return this.adjList[v];  
          };
          
          jss.FlowNetwork = FlowNetwork;
          
          var DepthFirstSearch = function(G, s) {
              this.s = s;
              var V = G.V;
              this.marked = [];
              this.edgeTo = [];
              for (var v = 0; v < V; ++v) {
                  this.marked.push(false);
                  this.edgeTo.push(-1);
              }
              
              this.dfs(G, s);
          };
          
          DepthFirstSearch.prototype.dfs = function (G, v) {
              this.marked[v] = true;
              var adj_v = G.adj(v);
              for (var i = 0; i < adj_v.length; ++i){
                  var w = adj_v[i];
                  if (!this.marked[w]){
                      this.edgeTo[w] = v;
                      this.dfs(G, w);
                  }
              }
          };
          
          DepthFirstSearch.prototype.hasPathTo = function(v) {
              return this.marked[v];
          };
          
          DepthFirstSearch.prototype.pathTo = function(v) {
              var path = new jss.Stack();
              if(v == this.s) return [v];
              
              for(var x = v; x != this.s; x = this.edgeTo[x]) {
                  path.push(x);
              }
              path.push(this.s);
              return path.toArray();
          };
          
          jss.DepthFirstSearch = DepthFirstSearch;
          
          var BreadthFirstSearch = function(G, s) {
              var V = G.V;
              this.s = s;
              
              var queue = new jss.Queue();
              queue.enqueue(s);
              this.marked = [];
              this.edgeTo = [];
              
              for(var v = 0; v < V; ++v) {
                  this.marked.push(false);
                  this.edgeTo.push(-1);
              }
              
              while (!queue.isEmpty()) {
                  var v = queue.dequeue();
                  this.marked[v] = true;
                  var adj_v = G.adj(v);
                  for (var i = 0; i < adj_v.length; ++i) {
                      var w = adj_v[i];
                      if(!this.marked[w]){
                          this.edgeTo[w] = v;
                          queue.enqueue(w);
                      }
                  }
              }
          };
          
          BreadthFirstSearch.prototype.hasPathTo = function(v) {
              return this.marked[v];
          };
          
          BreadthFirstSearch.prototype.pathTo = function(v) {
              var path = new jss.Stack();
              if(v == this.s) return [v];
              
              for(var x = v; x != this.s; x = this.edgeTo[x]) {
                  path.push(x);
              }
              path.push(this.s);
              return path.toArray();
          };
          
          jss.BreadthFirstSearch = BreadthFirstSearch;
          
          var ConnectedComponents = function(G) {
              this.count = 0;
              var V = G.V;
              this.marked = [];
              this.id = [];
              for (var v = 0; v < V; ++v) {
                  this.marked.push(false);
                  this.id.push(-1);
              }
              
              for (var v = 0; v < V; ++v) {
                  if(!this.marked[v]){
                      this.dfs(G, v);
                      this.count++;
                  }
              }
          };
          
          ConnectedComponents.prototype.dfs = function(G, v) {
              this.marked[v] = true;
              this.id[v] = this.count;
              var adj_v = G.adj(v);
              
              for(var i = 0; i < adj_v.length; ++i){
                  var w = adj_v[i];
                  if(!this.marked[w]){
                      this.dfs(G, w);
                  }
              }
          };
          
          ConnectedComponents.prototype.componentId = function(v) {
              return this.id[v];
          };
          
          ConnectedComponents.prototype.componentCount = function(){
              return this.count;
          };
          
          
          jss.ConnectedComponents = ConnectedComponents;
          
          var TopologicalSort = function(G) {
              this.postOrder = new jss.Stack();
              this.marked = [];
              var V = G.V;
              for (var v = 0; v < V; ++v) {
                  this.marked.push(false);
              }
              
              for (var v = 0; v < V; ++v) {
                  if(!this.marked[v]) {
                      this.dfs(G, v);
                  }
              }
          };
          
          TopologicalSort.prototype.dfs = function(G, v) {
              this.marked[v] = true;
              var adj_v = G.adj(v);
              for (var i = 0; i < adj_v.length; ++i) {
                  var w = adj_v[i];
                  if(!this.marked[w]){
                      this.dfs(G, w);
                  }
              }
              this.postOrder.push(v);
          };
          
          TopologicalSort.prototype.order = function() {
              return this.postOrder.toArray();  
          };
          
          jss.TopologicalSort = TopologicalSort;
          
          var StronglyConnectedComponents = function(G) {
              var V = G.V;
              this.count = 0;
              this.marked = [];
              this.id = [];
              
              for(var v = 0; v < V; ++v) {
                  this.marked.push(false);
                  this.id.push(-1);
              }
              
              var order = new jss.TopologicalSort(G.reverse()).order();
              for( var i = 0; i < order.length; ++i) {
                  var v = order[i];
                  if(!this.marked[v]){
                      this.dfs(G, v);
                      this.count++;
                  }
              }
          };
          
          StronglyConnectedComponents.prototype.dfs = function (G, v) {
              this.marked[v] = true;
              this.id[v] = this.count;
              var adj_v = G.adj(v);
              for (var i = 0; i < adj_v.length; ++i){
                  var w = adj_v[i];
                  if(!this.marked[w]){
                      this.dfs(G, w);
                  }
              }
          };
          
          
          StronglyConnectedComponents.prototype.componentId = function(v) {
              return this.id[v];
          };
          
          StronglyConnectedComponents.prototype.componentCount = function(){
              return this.count;
          };
          
          jss.StronglyConnectedComponents = StronglyConnectedComponents;
          
          var KruskalMST = function(G) {
              var V = G.V;
              var pq = new jss.MinPQ(function(e1, e2){
                  return e1.weight - e2.weight;
              });
              for(var v = 0; v < G.V; ++v){
                  var adj_v = G.adj(v);
                  for (var i = 0; i < adj_v.length; ++i) {
                      var e = adj_v[i];
                      if(e.either() != v) {
                          continue;
                      }
                      pq.enqueue(e);
                  }
              }
              
              this.mst = [];
              
              var uf = new jss.QuickUnion(V);
              while (!pq.isEmpty() && this.mst.length < V-1) {
                  var e = pq.delMin();
                  var v = e.either();
                  var w = e.other(v);
                  
                  if(!uf.connected(v, w)){
                      uf.union(v, w);
                      this.mst.push(e);
                  }
              }
          };
          
          
          
          jss.KruskalMST = KruskalMST;
          
          var LazyPrimMST = function(G) {
              var V = G.V;
              this.marked = [];
              for( var v = 0; v < V; ++v) {
                  this.marked.push(false);
              }
              
              this.pq = new jss.MinPQ(function(e1, e2){
                  return e1.weight - e2.weight;
              });
              
              this.mst = [];
              
              this.visit(G, 0);
              
              while(!this.pq.isEmpty() && this.mst.length < V-1) {
                  var e = this.pq.delMin();
                  var v = e.either();
                  var w = e.other(v);
                  if(this.marked[v] && this.marked[w]) continue;
                  this.mst.push(e);
                  if(!this.marked[v]) this.visit(G, v);
                  if(!this.marked[w]) this.visit(G, w);
              }
          };
          
          LazyPrimMST.prototype.visit = function(G, v) {
              this.marked[v]  = true;
              var adj_v = G.adj(v);
              for (var i = 0; i < adj_v.length; ++i) {
                  var e = adj_v[i];
                  if(!this.marked[e.other(v)]){
                      this.pq.enqueue(e);
                  }
              }
          };
          
          jss.LazyPrimMST = LazyPrimMST;
          
          var EagerPrimMST = function(G) {
              var V = G.V;
              this.pq = new jss.IndexMinPQ(V, function(e1, e2) {
                  return e1.weight - e2.weight;
              });
              this.marked = [];
              for(var v = 0; v < V; ++v) {
                  this.marked.push(false);
              }
              this.mst = [];
              this.visit(G, 0);
              while(!this.pq.isEmpty()) {
                  var e = this.pq.minKey();
                  var w = this.pq.delMin();
                  
                  this.mst.push(e);
                  
                  if(!this.marked[w]){
                      this.visit(G, w);
                  }
                  
              }
          };
          
          EagerPrimMST.prototype.visit = function(G, v) {
              this.marked[v]  = true;
              var adj_v = G.adj(v);
              for(var i = 0; i < adj_v.length; ++i) {
                  var e = adj_v[i];
                  var w = e.other(v);
                  if(this.marked[w]) continue;
                  if(this.pq.containsIndex(w)){
                      this.pq.decreaseKey(w, e);
                  } else {
                      this.pq.insert(w, e);
                  }
              }
          };
          
          jss.EagerPrimMST = EagerPrimMST;
          
          var Dijkstra = function(G, s) {
              var V = G.V;
              this.s = s;
              this.marked = [];
              this.edgeTo = [];
              this.cost = [];
              this.pq = new jss.IndexMinPQ(V, function(cost1, cost2){
                  return cost1, cost2;
              });
              
              for(var v =0; v < V; ++v){
                  this.marked.push(false);
                  this.edgeTo.push(null);
                  this.cost.push(Number.MAX_VALUE);
              }
              
              this.cost[s] = 0;
              
              this.pq.insert(s, this.cost[s]);
              
              while(!this.pq.isEmpty()) {
                  var v = this.pq.delMin();
                  this.marked[v] = true;
                  var adj_v = G.adj(v);
                  for(var i = 0; i < adj_v.length; ++i) {
                      var e = adj_v[i];
                      this.relax(e);
                  }
              }
              
          };
          
              
          
          
          Dijkstra.prototype.relax = function(e) {
              
              var v = e.from();
              var w = e.to();
              
              if(this.cost[w] > this.cost[v] + e.weight) {
                  this.cost[w] = this.cost[v] + e.weight;
                  this.edgeTo[w] = e;
                  if(this.pq.containsIndex(w)){
                      this.pq.decreaseKey(w, this.cost[w]);
                  } else {
                      this.pq.insert(w, this.cost[w]);
                  }
              }
          };
          
      
          
          Dijkstra.prototype.hasPathTo = function(v) {
              return this.marked[v];  
          };
      
          
          Dijkstra.prototype.pathTo = function(v) {
              var path = new jss.Stack();
              for(var x = v; x != this.s; x = this.edgeTo[x].other(x)) {
                  path.push(this.edgeTo[x]);
              }  
              return path.toArray();
          };
          
          Dijkstra.prototype.distanceTo = function(v) {
              return this.cost[v];  
          };
          
          
          jss.Dijkstra = Dijkstra;
          
          var BellmanFord = function(G, s) {
              var V = G.V;
              this.s = s;
              this.marked = [];
              this.edgeTo = [];
              this.cost = [];
              
              
              for(var v =0; v < V; ++v){
                  this.marked.push(false);
                  this.edgeTo.push(null);
                  this.cost.push(Number.MAX_VALUE);
              }
              
              this.cost[s] = 0;
              this.marked[s] = true;
              
              for(var j = 0; j < V; ++j) {
                  for(var v = 0; v < V; ++v){
                      var adj_v = G.adj(v);
                      for(var i = 0; i < adj_v.length; ++i) {
                          var e = adj_v[i];
                          this.relax(e);
                      }
                  }
              }
              
          };
          
          BellmanFord.prototype.relax = function(e) {
              
              var v = e.from();
              var w = e.to();
              
              if(this.cost[w] > this.cost[v] + e.weight) {
                  this.cost[w] = this.cost[v] + e.weight;
                  this.marked[w] = true;
                  this.edgeTo[w] = e;
              }
          };
          
          BellmanFord.prototype.hasPathTo = function(v) {
              return this.marked[v];  
          };
      
          
          BellmanFord.prototype.pathTo = function(v) {
              var path = new jss.Stack();
              for(var x = v; x != this.s; x = this.edgeTo[x].other(x)) {
                  path.push(this.edgeTo[x]);
              }  
              return path.toArray();
          };
          
          BellmanFord.prototype.distanceTo = function(v) {
              return this.cost[v];  
          };
          
          jss.BellmanFord = BellmanFord;
          
          var TopologicalSortShortestPaths = function(G, s) {
              var V = G.V;
              this.s = s;
              this.marked = [];
              this.edgeTo = [];
              this.cost = [];
              
              
              for(var v =0; v < V; ++v){
                  this.marked.push(false);
                  this.edgeTo.push(null);
                  this.cost.push(Number.MAX_VALUE);
              }
              
              this.cost[s] = 0;
              this.marked[s] = true;
              
              var order = new jss.TopologicalSort(G.toDiGraph()).order();
              
              
              for(var j = 0; j < order.length; ++j){
                  var v = order[j];
                  var adj_v = G.adj(v);
                  for(var i = 0; i < adj_v.length; ++i) {
                      var e = adj_v[i];
                      this.relax(e);
                  }
              }
              
              
          };
          
          TopologicalSortShortestPaths.prototype.relax = function(e) {
              
              var v = e.from();
              var w = e.to();
              
              if(this.cost[w] > this.cost[v] + e.weight) {
                  this.cost[w] = this.cost[v] + e.weight;
                  this.marked[w] = true;
                  this.edgeTo[w] = e;
              }
          };
          
          TopologicalSortShortestPaths.prototype.hasPathTo = function(v) {
              return this.marked[v];  
          };
      
          
          TopologicalSortShortestPaths.prototype.pathTo = function(v) {
              var path = new jss.Stack();
              for(var x = v; x != this.s; x = this.edgeTo[x].other(x)) {
                  path.push(this.edgeTo[x]);
              }  
              return path.toArray();
          };
          
          TopologicalSortShortestPaths.prototype.distanceTo = function(v) {
              return this.cost[v];  
          };
          
          jss.TopologicalSortShortestPaths = TopologicalSortShortestPaths;
          
          var FordFulkerson = function(G, s, t) {
              this.value = 0;
              var V = G.V;
              var bottle = Number.MAX_VALUE;
              this.marked = null;
              this.edgeTo = null;
              this.s = s;
              this.t = t;
              while(this.hasAugmentedPath(G)){
                  
                  for(var x = this.t; x != this.s; x = this.edgeTo[x].other(x)) {
                      bottle = Math.min(bottle, this.edgeTo[x].residualCapacityTo(x));
                  }
                  
                  for(var x = this.t; x != this.s; x = this.edgeTo[x].other(x)) {
                      this.edgeTo[x].addResidualFlowTo(x, bottle);
                  }
                  
                  
                  this.value += bottle;
              }
          };
          
          FordFulkerson.prototype.hasAugmentedPath = function(G) {
              var V = G.V;
              this.marked = [];
              this.edgeTo = [];
              for(var v = 0; v < V; ++v) {
                  this.marked.push(false);
                  this.edgeTo.push(null);
              }
              
              var queue = new jss.Queue();
              queue.enqueue(this.s);
              
              this.marked[this.s] = true;
              while(!queue.isEmpty()){
                  var v = queue.dequeue();
                  var adj_v = G.adj(v);
                  
                  for (var i = 0; i < adj_v.length; ++i) {
                      var e = adj_v[i];
                      var w = e.other(v);
                      if(!this.marked[w] && e.residualCapacityTo(w) > 0){
                          this.edgeTo[w] = e;
                          this.marked[w] = true;
                          if(w == this.t){
                              return true;
                          }
                          
                          queue.enqueue(w);
                      }
                  }
              }
              
              return false;
          };
          
          FordFulkerson.prototype.minCut = function(G) {
              var cuts = [];
              var V = G.V;
              for(var v = 0; v < V; ++v){
                  var adj_v = G.adj(v);
                  for(var i = 0; i < adj_v.length; ++i) {
                      var e = adj_v[i];
                      if(e.from() == v && e.residualCapacityTo(e.other(v)) == 0) {
                          cuts.push(e);
                      }
                  }
              }
              
              return cuts;
          };
      
          jss.FordFulkerson = FordFulkerson;
      })(jsgraphs);
      
      var module = module || {};
      if(module) {
        module.exports = jsgraphs;
      }

      
      console.log(edges.to);


      function johnson2(){
        document.getElementById('referencia').style.visibility = 'visible';
        nodes.forEach((node)=>{
          nodes.update({id:node.id,color:{background:"#939A9A"}});;
        });
        edges.forEach((edge)=>{
          edges.update({id:edge.id,label:edge.valor,color:{color:"#939A9A"}});;
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
        cont="0";
        edges.forEach((edge)=>{
        
          if(edge.sublabel1=="h=0")
          {
            nodes.update({id:edge.from,color:{background:"#8AE35F"},label: cont});
            auxa=parseInt(edge.label)+parseInt(cont);
            cont=""+auxa+"";
            edges.update({id:edge.id,label:edge.label,color:{color:"#8AE35F"}}); 
            nodes.update({id:edge.to,color:{background:"#8AE35F"}, label: cont});
            
          }
          else{
            console.log("to:"+edge.to);
            console.log("from:"+edge.from);
            
            nodes.update({id:edge.to,color:{background:"#939A9A"},label: edge.label});
            edges.update({id:edge.id,label:edge.label});
             
          }
         
        });

        nodes.forEach((node)=>{
            console.log("node:"+node.id)
            a=0;
            edges.forEach((edge)=>{

                if(node.id == edge.to){
                    console.log("label"+node.label);
                    if(edge.sublabel1 != "h=0"){
                        b=parseInt(node.label)+parseInt(edge.label);
                        console.log("RESULTADO:"+b);
                    }
                    
                }
                a++;
                console.log(a+"edge:"+edge.to)
            });
          });
        
        
      }
      var a=0;
      var b=0;
      var auxa=0;
      var conta="0";
      var cont="0";