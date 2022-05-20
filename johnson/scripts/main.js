var inp_as=document.getElementById('a_size'),array_size=inp_as.value;
var inp_gen=document.getElementById("a_generate");
var inp_aspeed=document.getElementById("a_speed");
var inp_manual2=document.getElementById("a_man");
var inp_manual3=document.getElementById("a_agre");


var butts_algos=document.querySelectorAll(".algos button");

var div_sizes=[];
var divs=[];
var margin_size;
var cont=document.getElementById("array_container");
cont.style="flex-direction:row";
var datos = [];


inp_gen.addEventListener("click",generate_array);
inp_as.addEventListener("input",update_array_size);
inp_manual3.addEventListener("click",agregar_elemento);
inp_manual2.addEventListener("click",mostrar_elemento);

function generate_array()
{
    array_size=inp_as.value;
    cont.innerHTML="";
    for(var i=0;i<array_size;i++)
    {
        div_sizes[i]=Math.floor(Math.random() * 0.5*(inp_as.max - inp_as.min) ) + 10;
        divs[i]=document.createElement("div");
        cont.appendChild(divs[i]);
        margin_size=0.1;
        divs[i].style=" margin:0% " + margin_size + "%; background-color:blue; width:" + (100/array_size-(2*margin_size)) + "%; height:" + (div_sizes[i]) + "%;";
    }
    datos.splice(0, datos.length);
}

/*function generate_array_manual()
{
    var inp_manual=document.getElementById("arrman").value;
    var array_size1=inp_manual.length;
    console.log("holaaaa");
    console.log(inp_manual[1]);
    console.log(arrman);
    console.log(document.getElementById("arrman").value);
    console.log(inp_manual);
    console.log(array_size1);
    cont.innerHTML="";
    for(var i=0;i<array_size1;i++)
    {
        div_sizes[i]=Math.floor(Math.random() * 0.5*(array_size1 - inp_as.min) ) + 10;
        divs[i]=document.createElement("div");
        cont.appendChild(divs[i]);
        margin_size=0.1;
        divs[i].style=" margin:0% " + margin_size + "%; background-color:blue; width:" + (100/array_size1-(2*margin_size)) + "%; height:" + (div_sizes[i]) + "%;";
    }
}*/

function agregar_elemento()
{
    let dato = document.getElementById("arrman").value;
    datos.push(dato);
    console.log("Dato ingresado:",dato);
    document.getElementById("arrman").value = "";
}

function mostrar_elemento()
{
    cont.innerHTML="";
    /*console.log("largo:",datos.length);
    console.log("maximo largo:",Math.max.apply(null, datos));
    console.log("height0",(0*100)/Math.max.apply(null, datos));
    console.log("height1",(1*100)/Math.max.apply(null, datos));
    console.log("height2",(2*100)/Math.max.apply(null, datos));
    console.log("height3",(3*100)/Math.max.apply(null, datos));*/
    
    for(var i=0;i<datos.length;i++)
    {
        div_sizes[i]=(datos[i]*100)/Math.max.apply(null, datos);
        divs[i]=document.createElement("div");
        //let $value = $("<p></p>").text(datos[i]);
        //console.log("Dato ",i,": ",$value);
        cont.appendChild(divs[i]);
        console.log(divs[i].text);
        
        margin_size=0.1;
        divs[i].style=" margin:0% " + margin_size + "%; background-color:blue; width:" + (100/(datos.length)-(2*margin_size)) + "%; height:" + (div_sizes[i]) + "%;";
    }
    array_size=datos.length;
}

function update_array_size()
{
    array_size=inp_as.value;
    generate_array();
}

window.onload=function(){
    update_array_size();
} 

for(var i=0;i<butts_algos.length;i++)
{
    butts_algos[i].addEventListener("click",runalgo);
}

function disable_buttons()
{
    for(var i=0;i<butts_algos.length;i++)
    {
        butts_algos[i].classList=[];
        butts_algos[i].classList.add("butt_locked");
        butts_algos[i].disabled=true;
        inp_as.disabled=true;
        inp_gen.disabled=true;
        inp_aspeed.disabled=true;
    }
}

function runalgo()
{
    disable_buttons();

    this.classList.add("butt_selected");
    switch(this.innerHTML)
    {
        case "Bubble":Bubble();
                        break;
        case "Selection":Selection_sort();
                        break;
        case "Insertion":Insertion();
                        break;
        case "Merge":Merge();
                        break;
        case "Quick":Quick();
                        break;
        case "Heap":Heap();
                        break;
    }
}