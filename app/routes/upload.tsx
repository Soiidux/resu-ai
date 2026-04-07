import React from "react";
import { useEffect, useState } from "react";
import { usePuterStore } from "~/lib/puter";
import { useNavigate } from "react-router";
import Navbar from "~/components/Navbar";
import FileUploader from "~/components/FileUploader";

export default function Upload() {
  const { auth } = usePuterStore();
  const navigate = useNavigate();  
  useEffect(() => {
    if (!auth.isAuthenticated) {
      navigate("/auth?next=/upload")
    }
  }, [auth.isAuthenticated]);
  
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [statusText, setStatusText] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  

  
  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget.closest('form')
    if (!form) return;
    const formData = new FormData(form);
    const companyName = formData.get('company-name');
    const jobTitle = formData.get('job-title');
    const jobDescription = formData.get('job-description');
    
    console.log({companyName, jobTitle, jobDescription,file})
    
    setIsProcessing(false);
  }
  
  const handleFileSelect = (file: File | null) => {
    setFile(file);
  };
  
  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />
      <section className="main-section">
        <div className="page-heading p-16">
          <h1>Smart feedback for your dream job</h1>
          {isProcessing ? (
            <>
              <h2>{statusText}</h2>
              <img src="/images/resume-scan.gif" alt="processing resume" className="w-full" />
            </>
          ) : (
              <h2>Drop your resume for an ATS score and improvement tips</h2>
          )}
          {!isProcessing && (
            <form id="upload-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="form-div">
                <label htmlFor="company-name">Company Name</label>
                <input type="text" id="company-name" name="company-name" placeholder="Company Name"/>
              </div>
              <div className="form-div">
                <label htmlFor="job-title">Job Title</label>
                <input type="text" id="job-title" name="job-title" placeholder="Job Title" />
              </div>
              <div className="form-div">
                <label htmlFor="job-description">Job Description</label>
                <textarea id="job-description" name="job-description" placeholder="Job Description" />
              </div>
              <div className="form-div">
                <label htmlFor="uploader">Upload resume</label>
                <FileUploader onFileSelect={handleFileSelect} />
              </div>
              <button type="submit" className="primary-button">Analyze Resume</button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}