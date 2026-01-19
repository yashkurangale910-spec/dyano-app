import { useState } from "react";
import Hero from "../hero";
export const Learn = ()=>{
    const [temp,setTemp] = useState(0);
    return(
        <div>
            <Hero temp={temp} setTemp={setTemp}/>
        </div>
    );
}