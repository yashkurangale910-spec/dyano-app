import { useState} from "react";
import axios from "axios";
const Hero = ()=>{
    const [ans,setAns] = useState('');
    const [text,setText] = useState('');
    const [imageUrl, setImageUrl] = useState("")
    const [isHovered, setIsHovered] = useState(false);
    const [questions, setQuestions] = useState([])
    const [answers, setAnswers] = useState([])
    const [showAnswers, setShowAnswers] = useState(false)

    function handleClick(){
        axios.post('http://localhost:3005/img',{"prompt":text}).then((res)=>{
            console.log(res);
            setAns(res.data.data);
            setImageUrl(res.data.imgUrl)
            setQuestions([])
            setAnswers([])
        }).catch((err)=>{console.log(err)});
    }

    const handleQuiz = () => {
        axios.post('http://localhost:3005/quiz', {"prompt": `${text}. Generate a short quiz for the same. Give me 5 questions only and give questions in one array and answers in one array`}).then(res => {
            console.log(res.data)
            setQuestions(res.data.questions)
            setAnswers(res.data.answers)
        })
    }

    const handleAnswers = () => {
        setShowAnswers(!showAnswers)
    }
    

    return(
        
        <div className="mx-14 mt-60 w-100%">
            <div className="ip-area flex w-100%">
                <span className="px-6 font-bold font-sans rounded-l-2xl bg-neutral-200 border-t-4 border-black border-l-4 border-b-2 border-r-2">Ask a question...</span>
                <input type="text" placeholder="Enter text" value={text} className="inp px-6 py-4 font-bold font-sans rounded-r-2xl border-t-2 border-black border-b-4 border-r-4 border-l-2 w-1/2" onChange={(e)=>{
                        setText(e.target.value);
                    }}/>
                <button className="font-extrabold bg-black text-white border ml-7 py-5 px-10 rounded-2xl flex font-si hover:transition-all delay-200" onClick={handleClick} onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>Submit {isHovered? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 ml-1">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
    </svg> : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
</svg>
    } 
</button>
            </div>  
            <br/>
            <div style={!ans?{'border':'none'}:{'border': '1px solid black'}} className="bg-black text-white py-5 px-10 font-sans rounded-2xl flex justify-between">
            {imageUrl && <img src={imageUrl} alt="image"/>}
            <p className="ml-20 font-sans ">{ans}</p>
            </div>
            {/* <img src={null} alt="Rendered Image" className="ren-img" style={{display: "none"}} ref={ref}/><br/> */}
            <br />
            <br />
            {ans? <div className="flex justify-center">
                <button className="w-32 bg-black text-white py-4 px-3 rounded-md" onClick={handleQuiz}>Generate Quiz</button>
            </div>: null}
            <br />
            <br />

            {
                questions.length > 0? <div className="bg-black text-white py-5 px-10 font-sans rounded-2xl">
                {questions.map((question, index) => {
                    return <div key={index}>{index + 1}. {question}</div>
                })}
            </div>:null
            }
            <br />
            <br />

            {questions.length > 0? <div className="flex justify-center">
                <button className="w-32 bg-black text-white py-4 px-3 rounded-md" onClick={handleAnswers}>{showAnswers?"Hide Answers": "Show Answers"}</button>
            </div>: null}
            <br />
            <br />

            {
                showAnswers? <div className="bg-black text-white py-5 px-10 font-sans rounded-2xl">
                {answers.map((answer, index) => {
                    return <div key={index}>{index + 1}. {answer}</div>
                })}
            </div>:null
            }
            <br />
        </div>
    );
}

export default Hero;