import React, { useState } from 'react';
import axios from 'axios';

const Pdf = () => {
  const [file, setFile] = useState(null);
  const [fileUploaded, setFileUploaded] = useState(false)
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [isHovered, setIsHovered] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    try {
      if (!file) {
        alert('Please select a file!');
        return;
      }

      const formData = new FormData();
      formData.append('pdfFile', file);

      // Replace 'YOUR_BACKEND_API_URL' with your actual backend API endpoint
      const response = await axios.post('http://localhost:3005/pdf/upload', formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "enctype" :"multipart/form-data"
        },
      });
      setFileUploaded(true)
      console.log('File uploaded successfully!', response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleQuestion = async () => {
    const response = await axios.post("http://localhost:3005/pdf/question", JSON.stringify({question : question}), {
        headers: {
            "Content-Type" : "application/json"
        }
    })
    setAnswer(response.data.data)
  }

  return (
    !fileUploaded?
    (
    <div className="mx-14 mt-32 w-100%">
      <h1 className="font-bold text-3xl mb-5">PDF File Upload</h1>
      <input type="file" onChange={handleFileChange} className="border border-black py-1 px-1 rounded-lg font-sans"/>
      <button onClick={handleUpload} className="font-extrabold bg-black text-white border py-2 px-5 rounded-lg font-sans hover:transition-all delay-200 mt-3 flex">Upload <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 ml-1">
  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
</svg>
</button>
    </div> ) : (
      <div>
        <div className="mx-14 mt-60 w-100% flex">
            <span className="px-6 font-bold font-sans rounded-l-2xl bg-neutral-200 border-t-4 border-black border-l-4 border-b-2 border-r-2">Ask the questions based on pdf...</span>
            <input value={question} onChange={({target: {value}}) => setQuestion(value)} placeholder='Ask question' className="inp px-6 py-4 font-bold font-sans rounded-r-2xl border-t-2 border-black border-b-4 border-r-4 border-l-2 w-1/2"/>
            <button onClick={handleQuestion} className="font-extrabold bg-black text-white border ml-7 py-5 px-10 rounded-2xl flex font-si hover:transition-all delay-200" onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}>Ask {isHovered? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 ml-1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
          </svg> : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
      </svg>}</button>
      </div>
            <br />
            <br />
            <div className="bg-black text-white py-5 px-10 font-sans rounded-2xl w-11/12 ml-14">
            <p style={!answer?{'border':'none'}:{'border': '1px solid black'}} className="font-sans">{answer}</p>
            </div>  
        </div>
    )
  );
};

export default Pdf;
