import { Link } from "react-router-dom";
export const Header = ()=>{

    return(
        <div className="mt-3">
            <div className="flex justify-around">
                <h1 className="font-bold text-4xl font-sans">Dnyanodaya</h1>
                    <ul className="flex border-4 font-bold border-black rounded-lg justify-around w-3/5 font-sans">
                        <li className="hover:bg-black hover:text-white rounded-lg px-3 py-1 my-1 transition-all delay-50"><Link to="/Home">Home</Link></li>
                        <li className="hover:bg-black hover:text-white rounded-lg px-3 py-1 my-1 transition-all delay-50"><Link to="/learn">Learn</Link></li>
                        <li className="hover:bg-black hover:text-white rounded-lg px-3 py-1 my-1 transition-all delay-50"><Link to="/pdf">Upload Pdf</Link></li>
                        <li className="hover:bg-black hover:text-white rounded-lg px-3 py-1 my-1 transition-all delay-50"><Link to="/about">About</Link></li>
                        <li className="hover:bg-black hover:text-white rounded-lg px-3 py-1 my-1 transition-all delay-50"><Link to="/contact">Contact us</Link></li>
                    </ul>
                    <button style={{color: "white"}}>Light/Dark</button>
            </div>
        </div>
    );
}