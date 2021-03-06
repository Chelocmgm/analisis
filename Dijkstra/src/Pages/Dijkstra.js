import React, { useState } from "react";
import { useDispatch } from "react-redux";
import Graph from "../components/Graph/Graph";
import Header from "../components/header/Header.js";
import Toolbar from "../components/Toolbar/Toolbar";
import Footer from "../components/footer/Footer.js";
import Modal from "../components/Modal/Modal";
import { useSelector } from "react-redux";
import { dijkstra } from "../utils/graphs/dijkstra";
import popper from "cytoscape-popper";
import cytoscape from "cytoscape";
import { generateMatrix } from "../utils/adjacencyMatrix";
import {
    setAdjacencyMatrix,
    setMatrixLabels,
    setMatrixDisplay,
} from "../redux/actions/adjacencyMatrix";
import { setDisplay } from "../redux/actions/modalStyle";

import "../Styles/johnson.css";


cytoscape.use(popper);
let sum =0;
const Dijkstra = () => {
    const [selected, setSelected] = useState("");
    const dispatch = useDispatch();
    const currentIndex = useSelector((state) => state.currentIndex);
    const data = useSelector((state) => state.cytoscapeData[currentIndex]);

    const onClick = () => {
        const sourceNode = prompt("Indique el nombre del nodo de origen:");
        // ejecutar algoritmo
        // console.log();
        const { adjacencyMatrix, indexes } = generateMatrix(data.elements);
        dispatch(setAdjacencyMatrix(adjacencyMatrix));
        dispatch(setMatrixLabels(Array.from(indexes)));
        let fixedAdjMatrix = [];
        adjacencyMatrix.forEach(row => {
            let newRow = [];
            row.forEach(column => newRow.push(column === -1 ? 0 : column))
            fixedAdjMatrix.push(newRow);
        })
        const vertexList = [];
        indexes.forEach((e) => vertexList.push(e[1]));
        const indexMap = new Map(indexes);
        const sourceIndex = indexMap.get(sourceNode);
        const dijkstraResult = dijkstra(vertexList, fixedAdjMatrix, sourceIndex, selected === "min");

        const keys = Array.from(indexMap.keys());
        console.log(keys);
        console.log("keys");

        //No se si es valido pero funca
        // generamos un cy con los valores obtenidos del estado
        const cy = cytoscape({
            container: document.getElementById("cy"),
            style: data.style,
            zoomingEnabled: false,
            userZoomingEnabled: true,
            panningEnabled: true,
            userPanningEnabled: true,
        });
        if (data.elements) {
            if (data.elements.nodes) {
                data.elements.nodes.forEach((element) => {
                    cy.add(element);
                });
            }
            if (data.elements.edges) {
                data.elements.edges.forEach((element) => {
                    cy.add(element);
                });
            }
        }

        // generar poppers
        const makePopperNode = (node, distance) => {
            const popper = node.popper({
                content: () => {
                    const div = document.createElement("div");
                    div.classList.add("popper-div");
                    div.innerHTML = `<table class="node">
                                         <tr>
                                             <td>${distance}</td>
                                         </tr>
                                     </table>`;
                    document.body.appendChild(div);
                    return div;
                },
                popper: {
                    placement: "bottom",
                },
            });
            return popper;
        };
        sum=0;

        // //Agregando los popper a cada nodo
        vertexList.forEach((e) => {
            //Obtenemos la referencia del nodo del cy declarado
            //console.log(keys[e]);
            
            const node = cy.getElementById(keys[e]);
            //Se envia la referencia del nodo y los valores de los poppers
            const popperNode = makePopperNode(
                 node,
                 dijkstraResult.dist.get(e)
                 
            );
            console.log(dijkstraResult.dist.get(e));
                sum= sum+parseInt(dijkstraResult.dist.get(e),10);
                

            let updateNode = () => {
                popperNode.update();
            };
            node.on("position", updateNode);
            cy.on("render", updateNode);
        });
        console.log('Suma total:', sum);
        
    };

    const radioButtonChange = (e) => {
        e.preventDefault();
        setSelected(e.target.id);
    }

    return (
        <div className="container">
            <Modal />
            <Header logo="/img/logo-yaigo.png" btnText="Resolver con Algoritmo de Dijkstra" onClick={onClick} dir="/Dijkstra_manual.pdf" />
                     
            <div className="radio-wrapper">
              <input onChange={radioButtonChange} type="radio" id="max" name="radio" />
              <label htmlFor="max">MAX</label>

              <input onChange={radioButtonChange} type="radio" id="min" name="radio" />
              <label htmlFor="min">MIN</label>

            </div>
            <Graph />
            
            <Toolbar />
        </div>
    );
};

export default Dijkstra;
