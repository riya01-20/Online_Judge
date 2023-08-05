import React from 'react';
import Navbar from "../components/Navbar"
import { useNavigate } from 'react-router-dom';
import background from "../components/img/bg.png";

export default function Home(){
    const navigate = useNavigate();
    return(
        <>
        <Navbar />
        <div className="bgimg" >
        <div className="font-poppin m-3 p-5 text-center">
            <h1 className="text-[5rem] font-semibold text-green-200">COMPETE, LEARN</h1>
            <h2 className="text-[5rem] font-semibold text-amber-100">&</h2>
            <h1 className="text-[5rem] font-semibold text-green-200">CONQUER</h1>
        </div>
        <div className="m-3 p-5 text-center">
            <button className="text-[2rem] text-cyan-200 font-bold hover:italic hover:text-fuchsia-200 text-poppin p-2 hover:bg-gray-600 bg-gray-950 borderRadius:40%" onClick={() => navigate('/problems')}>Solve Problems</button>
        </div>
        </div>
        </>
    )
}