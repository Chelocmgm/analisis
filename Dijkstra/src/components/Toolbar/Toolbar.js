import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetIndex } from "../../redux/actions/currentIndex";
import { importState } from "../../redux/actions/cytoscape";

// action creators
import {
    setNodeActive,
    setEdgeActive,
    setEraserActive,
    disableAll,
} from "../../redux/actions/toolbar";
import { nextIndex, previousIndex } from "../../redux/actions/currentIndex";
import { setTargetNode, setSourceNode } from "../../redux/actions/edgeCreator";

import "./Tool-bar.css";

const Toolbar = () => {
    const dispatch = useDispatch();
    const toolbar = useSelector((state) => state.toolbar);
    const cytoscapeArray = useSelector((state) => state.cytoscapeData);
    const currentIndex = useSelector((state) => state.currentIndex);

    const inputRef = useRef(null);

    const fileChange = (e) => {
        console.log(e.target.files[0]);
        if(e.target.files) {
            const fr = new FileReader();
            fr.onload = () => {
                const importedData = JSON.parse(fr.result);
                dispatch(resetIndex());
                dispatch(importState(importedData));
            }
            fr.readAsText(e.target.files[0]);
        }
    };

    const nodeSelected = toolbar.node;
    const edgeSelected = toolbar.edge;
    const eraserSelected = toolbar.eraser;

    const importFromJSON = () => {
        inputRef.current.click();
    };

    const exportToJSON = () => {
        const data = JSON.stringify(cytoscapeArray[currentIndex]);
        const filename = "Dijkstra.json";
        const fileType = "text/json";

        const blob = new Blob([data], { type: fileType });
        const a = document.createElement("a");
        a.download = filename;
        a.href = window.URL.createObjectURL(blob);
        const clickEvt = new MouseEvent("click", {
            view: window,
            bubbles: true,
            cancelable: true,
        });
        a.dispatchEvent(clickEvt);
        a.remove();
    };

    const setNode = () => {
        dispatch(disableAll());
        dispatch(setTargetNode(""));
        dispatch(setSourceNode(""));
        dispatch(setNodeActive());
    };

    const setEdge = () => {
        dispatch(disableAll());
        dispatch(setTargetNode(""));
        dispatch(setSourceNode(""));
        dispatch(setEdgeActive());
    };

    const setEraser = () => {
        dispatch(disableAll());
        dispatch(setTargetNode(""));
        dispatch(setSourceNode(""));
        dispatch(setEraserActive());
    };

    const undoAction = () => {
        dispatch(previousIndex());
        dispatch(setTargetNode(""));
        dispatch(setSourceNode(""));
    };

    const redoAction = () => {
        dispatch(setTargetNode(""));
        dispatch(setSourceNode(""));
        if (currentIndex + 1 < cytoscapeArray.length) {
            dispatch(nextIndex());
        }
    };

    return (
        <div className="tool-bar">
            <button
            
                title="Agregar vértice"
                onClick={setNode}
                className={nodeSelected ? "selected" : ""}
            >
                Agregar Nodo
            </button>
            <button
                title="Agregar arista"
                onClick={setEdge}
                className={edgeSelected ? "selected" : ""}
            >
                Agregar Arista
            </button>
            <button
                title="Borrar elemento"
                onClick={setEraser}
                className={eraserSelected ? "selected" : ""}
            >
                Eliminar
            </button>
            <button title="Deshacer" onClick={undoAction}>
Deshacer            </button>
            
            <button title="Guardar" onClick={exportToJSON}>
Guardar            </button>
            <button title="Importar" onClick={importFromJSON}>
Seleccionar Archivo                <input
                    ref={inputRef}
                    type="file"
                    name="file"
                    className="input--hidden"
                    onChange={fileChange}
                    accept="text/json"
                />
            </button>
        </div>
    );
};
export default Toolbar;
