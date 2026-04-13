import React from "react";
import { useEffect, useState } from "react";
import { usePuterStore } from "~/lib/puter";
import { useNavigate } from "react-router";
import Navbar from "~/components/Navbar";
import FileUploader from "~/components/FileUploader";
import { convertPdfToImage } from "~/lib/pdf2img";
import { generateUUID } from "~/lib/utils";
import { prepareInstructions } from "~/constants";

export default function Upload() {
  const { auth, fs , ai, kv} = usePuterStore();
  const navigate = useNavigate();  
  useEffect(() => {
    if (!auth.isAuthenticated) {
      navigate("/auth?next=/upload")
    }
  }, [auth.isAuthenticated]);
  
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [statusText, setStatusText] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  

  const handleAnalyze = async ({companyName, jobTitle, jobDescription, file}: {companyName: string; jobTitle: string; jobDescription: string; file: File}) => {
    setIsProcessing(true);
    setStatusText("Uploading file...");
    const uploadedFile = await fs.upload([file]);
    if (!uploadedFile) return setStatusText('Error: failed to upload file');
    
    setStatusText('Converting to image...');
    const imageFile = await convertPdfToImage(file);
    if (!imageFile.file) return setStatusText('Error: Failed to convert PDF to image');
    
    setStatusText('Uploading the image...');
    const uploadedImage = await fs.upload([imageFile.file]);
    if (!uploadedImage) return setStatusText('Error: failed to upload image');
    
  
    setStatusText('Preparing data...');
    const uuid = generateUUID();
    const data = {
      id: uuid,
      resumePath: uploadedFile.path,
      imagePath: uploadedImage.path,
      companyName,
      jobTitle,
      jobDescription,
      feedback:"",
    }
    
    await kv.set(`resume:${uuid}`, JSON.stringify(data));
    
    setStatusText('Analysis in progress...');
    
    const feedback = await ai.feedback(uploadedFile.path, prepareInstructions({jobTitle,jobDescription}));
    
    if (!feedback) return setStatusText('Error: failed to get feedback')
    
    const feedbackText = typeof feedback.message.content === 'string' ? feedback.message.content : feedback.message.content[0].text;
    data.feedback = JSON.parse(feedbackText);
    
    await kv.set(`resume:${uuid}`, JSON.stringify(data));
    
    setStatusText('Analysis complete. Feedback saved.');
    console.log(data);
    navigate(`/resume/${uuid}`)
  };
  
  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget.closest('form')
    if (!form) return;
    const formData = new FormData(form);
    const companyName = formData.get('company-name') as string;
    const jobTitle = formData.get('job-title') as string;
    const jobDescription = formData.get('job-description') as string;
    
    if (!file) return;
    await handleAnalyze({ companyName, jobTitle, jobDescription, file })
    
    
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