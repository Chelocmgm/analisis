import React from "react";
import { useHistory } from "react-router-dom";
import Button from '../button/Button.js';

import { Link } from "react-router-dom";
import "./Header.css";

const Header = ({title, logo, btnText, onClick, dir}) => {
    const history = useHistory();
    const redirectToContactUs = () => {
        history.push("/contacto");
    }
    const openManual = () => {
        console.log("HOLA");
        const newWindow = window.open(`${dir}`, "_blank", "noopener,noreferrer");
        if(newWindow) {
            newWindow.opener = null;
        }
    }

    if(btnText !== ""){

        return (
            
            <div>
                
                <div className="footer">
               
                
                    <div className="button-container">
                    <div className="header-logo">
                    <Link to="/dijkstra" ><img src={logo} alt="logo" /></Link>
                </div>
                <Button text={btnText} onClick={onClick}/>
                        <Button text="Manual de Usuario" onClick={openManual}/>
                        
                        
                    </div>
                    
                </div>
            </div>
            );
    }
    else{
        return (
            <div>
                <div className="footer">
                    <div className="button-container">
                        <Button text="Manual de Usuario" onClick={openManual}/>
                    </div>
                </div>
            </div>
            );
    }




    if(logo === ""){
        return (
            <div className="container-header">
                <div className="header-logo">
                </div>
                <div className="title">
                    <h2>{title}</h2>
                </div>
            </div>
        );
    }
    else{
        return (
            <div className="container-header">
                <div className="header-logo">
                    <Link to="/" ><img src={logo} alt="logo" /></Link>
                </div>
                <div className="title">
                    <h2>{title}</h2>
                </div>
            </div>
        );
    }
    

};

export default Header;
