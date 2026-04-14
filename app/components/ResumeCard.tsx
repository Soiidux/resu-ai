import { useEffect, useState } from "react";
import { Link } from "react-router";
import ScoreCircle from "./ScoreCircle";
import { usePuterStore } from "~/lib/puter";

export default function ResumeCard({resume: {id, companyName, jobTitle, feedback, imagePath}}:{resume:Resume}) {
  const { fs } = usePuterStore();
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  useEffect(() => {
    const loadResumes = async () => {
      const blob = await fs.read(imagePath);
      if (!blob) return;
      const imageUrl = URL.createObjectURL(blob);
      setResumeUrl(imageUrl);
    };
    loadResumes();
  }, [imagePath]);
  
  return (
    <Link to={`/resume/${id}`} className="resume-card animate-in fade-in duration-1000">
      <div className="resume-card-header">
        <div className="flex flex-col gap-2">
          {companyName && <h2 className="text-black! font-bold wrap-break-word">{companyName}</h2>}
          {jobTitle && <p className="text-lg wrap-break-word text-gray-500">{jobTitle}</p>}
          {!companyName && !jobTitle && <h2 className="text-black! font-bold">Resume</h2>}
        </div>
        <div className="shrink-0">
          <ScoreCircle score={feedback.overallScore} />
        </div>
      </div>
      {resumeUrl && (
        <div className="gradient-border animate-in fade-in duration-1000">
          <div className="w-full h-full">
            <img
            src={resumeUrl}
            alt="resume"
            className="w-full h-[350px] max-sm:h-[200px] object-cover object-top"
          />
        </div>
      </div>)}
    </Link>
  )
}