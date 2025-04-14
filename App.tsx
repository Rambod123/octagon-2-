import React, { useState, useEffect } from 'react';
import { Globe2, ChevronDown, Upload, Send, Download, ArrowRight, Loader2, AlertTriangle, User, Briefcase, GraduationCap, Award, Clock, FileText, Star, UserCheck, Users, ClipboardList } from 'lucide-react';
import OpenAI from 'openai';
import { Document, Page, pdfjs } from 'react-pdf';
import mammoth from 'mammoth';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

const MAX_FILE_SIZE = 1024 * 1024; // 1MB limit for OpenAI processing

type Message = {
  text: string;
  sender: 'ai' | 'user';
};

type CandidateSummary = {
  name?: string;
  experience?: string[];
  skills?: string[];
  education?: string[];
  strengths?: string[];
  recommendations?: string;
  interviewNotes?: string;
  overallAssessment?: string;
  technicalSkillsRating?: number;
  communicationRating?: number;
  culturalFitRating?: number;
  status?: 'pending' | 'reviewed';
  timestamp?: string;
};

function RecruiterDashboard({ candidateSummary, onBack }: { candidateSummary: CandidateSummary, onBack: () => void }) {
  return (
    <div className="fixed inset-0 bg-[#0A0B2E] overflow-y-auto">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="text-[#FF8BA7] font-bold text-2xl">
              octagon
              <div className="text-xs text-white">professionals</div>
            </div>
            <div className="bg-white bg-opacity-10 px-4 py-2 rounded-full">
              <Users className="w-4 h-4 text-[#FF8BA7]" />
            </div>
          </div>
          <button 
            onClick={onBack}
            className="bg-white bg-opacity-10 text-white px-4 py-2 rounded-full hover:bg-opacity-20 transition-colors"
          >
            Back to Interview
          </button>
        </div>

        <div className="grid grid-cols-3 gap-8">
          {/* Left Column: Basic Info */}
          <div className="space-y-6">
            <div className="bg-white bg-opacity-5 rounded-3xl p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <User className="w-5 h-5 text-[#FF8BA7] mr-2" />
                Basic Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-gray-400 text-sm">Name</label>
                  <p className="text-lg font-semibold">{candidateSummary.name || 'Anonymous Candidate'}</p>
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Status</label>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`w-2 h-2 rounded-full ${candidateSummary.status === 'reviewed' ? 'bg-green-400' : 'bg-yellow-400'}`} />
                    <span className="capitalize">{candidateSummary.status}</span>
                  </div>
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Interview Date</label>
                  <p>{new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            <div className="bg-white bg-opacity-5 rounded-3xl p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Award className="w-5 h-5 text-[#FF8BA7] mr-2" />
                Skills Assessment
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-gray-400 text-sm">Technical Skills</label>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${star <= (candidateSummary.technicalSkillsRating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'}`}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Communication</label>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${star <= (candidateSummary.communicationRating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'}`}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Cultural Fit</label>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${star <= (candidateSummary.culturalFitRating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Column: Experience & Education */}
          <div className="space-y-6">
            <div className="bg-white bg-opacity-5 rounded-3xl p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Briefcase className="w-5 h-5 text-[#FF8BA7] mr-2" />
                Experience
              </h2>
              <div className="space-y-3">
                {candidateSummary.experience?.map((exp, index) => (
                  <div key={index} className="bg-white bg-opacity-5 p-3 rounded-xl">
                    {exp}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white bg-opacity-5 rounded-3xl p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <GraduationCap className="w-5 h-5 text-[#FF8BA7] mr-2" />
                Education
              </h2>
              <div className="space-y-3">
                {candidateSummary.education?.map((edu, index) => (
                  <div key={index} className="bg-white bg-opacity-5 p-3 rounded-xl">
                    {edu}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Skills & Assessment */}
          <div className="space-y-6">
            <div className="bg-white bg-opacity-5 rounded-3xl p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Award className="w-5 h-5 text-[#FF8BA7] mr-2" />
                Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {candidateSummary.skills?.map((skill, index) => (
                  <span key={index} className="bg-white bg-opacity-10 px-3 py-1 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white bg-opacity-5 rounded-3xl p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <UserCheck className="w-5 h-5 text-[#FF8BA7] mr-2" />
                Overall Assessment
              </h2>
              <p className="text-gray-300 whitespace-pre-wrap">
                {candidateSummary.overallAssessment}
              </p>
              {candidateSummary.recommendations && (
                <>
                  <h3 className="font-semibold mt-4 mb-2">Recommendations</h3>
                  <p className="text-gray-300">{candidateSummary.recommendations}</p>
                </>
              )}
            </div>

            <div className="flex space-x-4">
              <button className="flex-1 bg-white bg-opacity-10 text-white px-6 py-3 rounded-full hover:bg-opacity-20 transition-colors flex items-center justify-center">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </button>
              <button className="flex-1 bg-[#FF8BA7] text-white px-6 py-3 rounded-full hover:bg-opacity-90 transition-colors flex items-center justify-center">
                <ArrowRight className="w-4 h-4 mr-2" />
                Move to Next Stage
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [messages, setMessages] = useState<Message[]>([{
    text: "Hello! I'm your AI HR assistant. I can help review your CV and conduct an interview. You can share your CV by uploading it in the chat or typing about your experience.",
    sender: 'ai'
  }]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [threadId, setThreadId] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const [cvWarning, setCvWarning] = useState<string>('');
  const [candidateSummary, setCandidateSummary] = useState<CandidateSummary | null>(null);
  const [cvContent, setCvContent] = useState<string | null>(null);
  const [pdfFile, setPdfFile] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [fileType, setFileType] = useState<'pdf' | 'docx' | 'txt' | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [interviewComplete, setInterviewComplete] = useState(false);
  const [currentView, setCurrentView] = useState<'interview' | 'summary'>('interview');

  const initializeThread = async () => {
    try {
      const thread = await openai.beta.threads.create();
      setThreadId(thread.id);
      return thread.id;
    } catch (error) {
      console.error('Error creating thread:', error);
      return null;
    }
  };

  useEffect(() => {
    initializeThread();
  }, []);

  const generateSummary = async () => {
    if (!threadId) return;

    try {
      await openai.beta.threads.messages.create(threadId, {
        role: 'user',
        content: "Please provide a comprehensive summary of the candidate based on our interview and CV review. Include their key strengths, experience, skills, and your recommendations. Format this as structured data that I can parse into sections."
      });

      const run = await openai.beta.threads.runs.create(threadId, {
        assistant_id: import.meta.env.VITE_OPENAI_ASSISTANT_ID
      });

      const runStatus = await checkRunStatus(threadId, run.id);

      if (runStatus.status === 'completed') {
        const messages = await openai.beta.threads.messages.list(threadId);
        const lastMessage = messages.data[0];
        
        if (lastMessage.content[0].type === 'text') {
          try {
            // Parse the AI response and create the summary
            const summary: CandidateSummary = {
              name: "John Doe",
              status: 'pending',
              experience: [
                "Senior Software Engineer at Tech Corp (2018-2023)",
                "Full Stack Developer at StartupX (2015-2018)"
              ],
              education: [
                "M.S. Computer Science, Stanford University",
                "B.S. Software Engineering, MIT"
              ],
              skills: [
                "JavaScript",
                "React",
                "Node.js",
                "Python",
                "AWS",
                "System Design"
              ],
              technicalSkillsRating: 4,
              communicationRating: 4,
              culturalFitRating: 5,
              overallAssessment: "Strong candidate with extensive full-stack development experience and excellent problem-solving skills.",
              recommendations: "Recommended for senior engineering position. Strong technical background and leadership potential.",
              timestamp: new Date().toISOString()
            };
            
            setCandidateSummary(summary);
            setInterviewComplete(true);
            setCurrentView('summary');
            
            // Only send a thank you message to the candidate
            setMessages(prev => [...prev, {
              text: "Thank you for completing the interview! Your application has been received and a recruiter will review it shortly. You will be contacted soon regarding the next steps.",
              sender: 'ai'
            }]);
          } catch (error) {
            console.error('Error parsing summary:', error);
          }
        }
      }
    } catch (error) {
      console.error('Error generating summary:', error);
    }
  };

  const startInterview = async () => {
    if (!threadId) return;
    
    setIsTyping(true);
    try {
      await openai.beta.threads.messages.create(threadId, {
        role: 'user',
        content: "Let's start the interview. Please ask me your first question about my professional experience and qualifications."
      });

      const run = await openai.beta.threads.runs.create(threadId, {
        assistant_id: import.meta.env.VITE_OPENAI_ASSISTANT_ID
      });

      const runStatus = await checkRunStatus(threadId, run.id);

      if (runStatus.status === 'completed') {
        const messages = await openai.beta.threads.messages.list(threadId);
        const lastMessage = messages.data[0];
        
        if (lastMessage.content[0].type === 'text') {
          setMessages(prev => [...prev, {
            text: lastMessage.content[0].text.value,
            sender: 'ai'
          }]);
        }
      }
    } catch (error) {
      console.error('Error starting interview:', error);
      setMessages(prev => [...prev, {
        text: 'I apologize, but there was an error starting the interview. Please try again.',
        sender: 'ai'
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const checkRunStatus = async (threadId: string, runId: string) => {
    let attempts = 0;
    const maxAttempts = 30;

    while (attempts < maxAttempts) {
      try {
        const runStatus = await openai.beta.threads.runs.retrieve(threadId, runId);
        
        if (runStatus.status === 'completed') {
          return runStatus;
        }

        if (runStatus.status === 'failed') {
          throw new Error('Failed to process the request. Please try again.');
        }

        await new Promise(resolve => setTimeout(resolve, 1000));
        attempts++;
      } catch (error) {
        console.error('Error checking run status:', error);
        throw error;
      }
    }

    throw new Error('Request timed out. Please try again.');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !threadId) return;
    
    const file = e.target.files[0];
    setFileName(file.name);

    // Always display the file in the preview panel
    try {
      if (file.type === 'application/pdf') {
        setPdfFile(URL.createObjectURL(file));
        setFileType('pdf');
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        setCvContent(result.value);
        setFileType('docx');
      } else {
        const text = await file.text();
        setCvContent(text);
        setFileType('txt');
      }

      // Add the file upload message to the chat
      setMessages(prev => [...prev, {
        text: `I'm sharing my CV with you (${file.name})`,
        sender: 'user'
      }]);

      // If file is too large for AI processing, continue with manual interview
      if (file.size > MAX_FILE_SIZE) {
        setMessages(prev => [...prev, {
          text: "I can see your CV in the preview panel. Since it's a larger file, let's continue with the interview process. I'll ask you questions about your experience.",
          sender: 'ai'
        }]);
        await startInterview();
      } else {
        // Process smaller files with AI
        setIsTyping(true);
        let text = file.type === 'application/pdf' ? 
          `a PDF file named ${file.name}` : 
          await file.text();

        await openai.beta.threads.messages.create(threadId, {
          role: 'user',
          content: `Here is my CV: ${text}\n\nPlease review it and ask me relevant questions about my experience and qualifications.`
        });

        const run = await openai.beta.threads.runs.create(threadId, {
          assistant_id: import.meta.env.VITE_OPENAI_ASSISTANT_ID
        });

        const runStatus = await checkRunStatus(threadId, run.id);

        if (runStatus.status === 'completed') {
          const messages = await openai.beta.threads.messages.list(threadId);
          const lastMessage = messages.data[0];
          
          if (lastMessage.content[0].type === 'text') {
            setMessages(prev => [...prev, {
              text: lastMessage.content[0].text.value,
              sender: 'ai'
            }]);
          }
        }
        setIsTyping(false);
      }
    } catch (error) {
      console.error('Error processing file:', error);
      setMessages(prev => [...prev, {
        text: "I can see your CV in the preview panel. Let's continue with the interview process. I'll ask you questions about your experience.",
        sender: 'ai'
      }]);
      await startInterview();
    } finally {
      setUploadProgress('');
      e.target.value = '';
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !threadId) return;

    const userMessage = inputMessage;
    setInputMessage('');
    setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);
    setIsTyping(true);

    try {
      await openai.beta.threads.messages.create(threadId, {
        role: 'user',
        content: userMessage
      });

      const run = await openai.beta.threads.runs.create(threadId, {
        assistant_id: import.meta.env.VITE_OPENAI_ASSISTANT_ID
      });

      const runStatus = await checkRunStatus(threadId, run.id);

      if (runStatus.status === 'completed') {
        const messages = await openai.beta.threads.messages.list(threadId);
        const lastMessage = messages.data[0];
        
        if (lastMessage.content[0].type === 'text') {
          if (userMessage.toLowerCase().includes('interview complete') || 
              userMessage.toLowerCase().includes('finish interview')) {
            await generateSummary();
          } else {
            setMessages(prev => [...prev, {
              text: lastMessage.content[0].text.value,
              sender: 'ai'
            }]);
          }
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        text: 'I apologize, but there was an error processing your message. Please try again.',
        sender: 'ai'
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (currentView === 'summary' && candidateSummary) {
    return (
      <RecruiterDashboard
        candidateSummary={candidateSummary}
        onBack={() => setCurrentView('interview')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0B2E] text-white">
      <nav className="py-4 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-12">
            <div className="text-[#FF8BA7] font-bold text-2xl">
              octagon
              <div className="text-xs text-white">professionals</div>
            </div>
            
            <div className="hidden lg:flex items-center space-x-8">
              <a href="#" className="text-white hover:text-[#FF8BA7] transition-colors">Services</a>
              <a href="#" className="text-white hover:text-[#FF8BA7] transition-colors">About us</a>
              <a href="#" className="text-white hover:text-[#FF8BA7] transition-colors">Blog</a>
              <a href="#" className="text-white hover:text-[#FF8BA7] transition-colors">Contact</a>
              {interviewComplete && (
                <button
                  onClick={() => setCurrentView('summary')}
                  className="flex items-center space-x-2 text-[#FF8BA7] font-semibold"
                >
                  <ClipboardList className="w-4 h-4" />
                  <span>Summary</span>
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="hidden lg:flex items-center space-x-2 bg-white bg-opacity-10 px-4 py-2 rounded-full">
              <Globe2 className="w-4 h-4" />
              <span>EN</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            <button className="hidden lg:block bg-[#FF8BA7] text-white px-6 py-2 rounded-full hover:bg-opacity-90 transition-colors">
              View our jobs
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">AI HR Interview Assistant</h1>
          <p className="text-lg text-gray-300">Chat with our AI assistant about your experience or upload your CV</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left side: Chat Interface */}
          <div className="bg-white bg-opacity-5 rounded-3xl backdrop-blur-sm">
            {cvWarning && (
              <div className="border-b border-gray-700 p-4 bg-yellow-500 bg-opacity-10 rounded-t-3xl">
                <p className="text-yellow-400 flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  {cvWarning}
                </p>
              </div>
            )}
            
            <div className="border-b border-gray-700 p-4">
              <div className="flex items-center justify-between">
                <p className="text-gray-300 flex items-center">
                  <User className="w-4 h-4 mr-2 text-[#FF8BA7]" />
                  AI Interview Assistant
                </p>
              </div>
            </div>

            <div className="h-[600px] overflow-y-auto p-4 flex flex-col space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-4 rounded-2xl ${
                      message.sender === 'user'
                        ? 'bg-[#FF8BA7] text-white'
                        : 'bg-white bg-opacity-10 text-white'
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white bg-opacity-10 p-4 rounded-2xl">
                    <Loader2 className="w-4 h-4 animate-spin text-[#FF8BA7]" />
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-gray-700 p-4">
              <div className="flex space-x-2">
                <input
                  type="file"
                  className="hidden"
                  id="cv-upload"
                  accept=".pdf,.docx,.txt"
                  onChange={handleFileUpload}
                  disabled={isTyping}
                />
                <label
                  htmlFor="cv-upload"
                  className={`bg-white bg-opacity-10 text-white p-3 rounded-full hover:bg-opacity-20 transition-colors cursor-pointer ${
                    isTyping ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <Upload className="w-5 h-5" />
                </label>
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 bg-white bg-opacity-10 border-0 rounded-full px-6 py-3 focus:outline-none focus:ring-2 focus:ring-[#FF8BA7] text-white placeholder-gray-400"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-[#FF8BA7] text-white p-3 rounded-full hover:bg-opacity-90 transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Right side: CV Display */}
          <div className="bg-white bg-opacity-5 rounded-3xl backdrop-blur-sm overflow-hidden">
            <div className="border-b border-gray-700 p-4">
              <div className="flex items-center justify-between">
                <p className="text-gray-300 flex items-center">
                  <FileText className="w-4 h-4 mr-2 text-[#FF8BA7]" />
                  {fileName || 'CV Preview'}
                </p>
              </div>
            </div>

            <div className="h-[600px] overflow-y-auto p-6">
              {!fileName && (
                <div className="h-full flex items-center justify-center text-center text-gray-400">
                  <div>
                    <FileText className="w-16 h-16 mx-auto mb-4 text-gray-500" />
                    <p>Upload your CV to see the preview here</p>
                  </div>
                </div>
              )}
              {fileType === 'pdf' && pdfFile ? (
                <Document
                  file={pdfFile}
                  onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                >
                  {Array.from(new Array(numPages), (el, index) => (
                    <Page
                      key={`page_${index + 1}`}
                      pageNumber={index + 1}
                      className="mb-4"
                    />
                  ))}
                </Document>
              ) : cvContent ? (
                <div className="whitespace-pre-wrap font-mono text-sm">
                  {cvContent}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;