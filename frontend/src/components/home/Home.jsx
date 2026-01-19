// import { useState,useEffect } from "react"
import { Link } from 'react-router-dom'

export const Home = ()=>{
    return(
        <div className="my-60 mx-10">
            <h1>
                <span className="hero-heading font-sans">
                    <span className="hero-heading-p1 leading-3">Start<br />
                    learning with</span><span className="hero-heading-p2 text-border-black text-shadow-black text-gray-50"> Dnyanodaya.</span>
                </span>
                <Link to="/learn"><button className="card mt-7">Launch App</button></Link>
            </h1>
        </div>
    );
}