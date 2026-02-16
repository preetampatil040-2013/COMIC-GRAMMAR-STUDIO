
import React, { useState, useEffect, useRef } from 'react';
import { GRAMMAR_TOPICS, SUBJECT_COLORS } from './constants';
import { GrammarTopic, LessonContent, Message } from './types';
import { getGrammarLesson, chatWithStudio, checkSpelling } from './services/geminiService';
import Clock from './components/Clock';
import ComicPanel from './components/ComicPanel';
import SpeechBubble from './components/SpeechBubble';
import LockScreen from './components/LockScreen';
import Dashboard from './components/Dashboard';
import PhotoLab from './components/PhotoLab';
import Quiz from './components/Quiz';

type ViewState = 'lock' | 'dashboard' | 'mission';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('lock');
  const [selectedTopic, setSelectedTopic] = useState<GrammarTopic | null>(null);
  const [lesson, setLesson] = useState<LessonContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'KAPOW! Welcome to the Comic Grammar Studio! Pick a mission to start your training!' }
  ]);
  const [inputText, setInputText] = useState('');
  const [spellInput, setSpellInput] = useState('');
  const [spellResult, setSpellResult] = useState<{correctedText: string, errorsFound: boolean, explanation: string} | null>(null);
  const [spellLoading, setSpellLoading] = useState(false);
  const [actionFx, setActionFx] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const triggerFx = (text: string) => {
    setActionFx(text);
    setTimeout(() => setActionFx(null), 1000);
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(prev => prev + (prev ? ' ' : '') + transcript);
        setIsRecording(false);
        triggerFx('HEARD!');
      };

      recognition.onerror = () => {
        setIsRecording(false);
        triggerFx('ERROR!');
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleVoiceInput = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
    } else {
      if (recognitionRef.current) {
        setIsRecording(true);
        triggerFx('LISTEN!');
        recognitionRef.current.start();
      } else {
        alert("Speech Recognition is not supported in this browser.");
      }
    }
  };

  const handleTopicSelect = async (topic: GrammarTopic) => {
    triggerFx('ZAP!');
    setLoading(true);
    setSelectedTopic(topic);
    setView('mission');
    try {
      const lessonData = await getGrammarLesson(topic.title, topic.subject);
      setLesson(lessonData);
      setMessages(prev => [
        ...prev, 
        { role: 'model', text: `WHAM! Let's master ${topic.title} for ${topic.subject} missions!` }
      ]);
    } catch (error) {
      console.error("Failed to fetch lesson:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSpellCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!spellInput.trim()) return;
    setSpellLoading(true);
    triggerFx('SCAN!');
    try {
      const result = await checkSpelling(spellInput);
      setSpellResult(result);
    } catch (error) {
      console.error(error);
    } finally {
      setSpellLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: Message = { role: 'user', text: inputText };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    triggerFx('BAM!');

    try {
      const response = await chatWithStudio([...messages, userMsg]);
      const isProfessor = response.toLowerCase().includes('professor punctuation');
      setMessages(prev => [...prev, { role: isProfessor ? 'professor' : 'model', text: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: 'BLAM! Something went wrong. Try again, hero!' }]);
    }
  };

  const handleUnlock = () => {
    setView('dashboard');
    triggerFx('READY!');
  };

  const handleLock = () => {
    setView('lock');
  };

  const goHome = () => {
    setView('dashboard');
    triggerFx('HOME!');
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col gap-8 max-w-7xl mx-auto relative overflow-hidden">
      {/* Lock Screen Component */}
      {view === 'lock' && <LockScreen onUnlock={handleUnlock} />}

      {/* Action FX Overlay */}
      {actionFx && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="action-fx bg-yellow-400 border-8 border-black p-8 transform rotate-12">
            <span className="comic-text text-8xl text-black drop-shadow-xl">{actionFx}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-center gap-6 z-10">
        <div className="relative">
          <h1 className="comic-text text-5xl md:text-7xl text-black drop-shadow-lg transform -rotate-1">
            COMIC GRAMMAR <span className="text-red-600">STUDIO</span>
          </h1>
          <div className="absolute -bottom-4 right-0 bg-yellow-400 comic-border px-3 py-1 comic-text text-xl">
            SUBJECTS FOR ALL HEROES!
          </div>
        </div>
        <div className="flex items-center gap-4">
          {view !== 'lock' && (
            <button 
              onClick={goHome}
              className={`comic-border px-4 py-2 comic-text text-xl transition-colors ${view === 'dashboard' ? 'bg-yellow-300' : 'bg-white hover:bg-yellow-200'}`}
              title="Go Home"
            >
              🏠 HOME
            </button>
          )}
          <Clock />
          <button 
            onClick={handleLock}
            className="comic-border bg-black text-white p-2 hover:bg-gray-800 transition-colors"
            title="Lock App"
          >
            🔒
          </button>
        </div>
      </header>

      {view === 'dashboard' ? (
        <Dashboard onSelectTopic={handleTopicSelect} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Left Column: Mission Select & Tools */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <ComicPanel title="QUICK MISSION" color="bg-cyan-100">
              <div className="flex flex-col gap-3">
                {GRAMMAR_TOPICS.map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() => handleTopicSelect(topic)}
                    className={`
                      comic-border p-3 text-left transition-transform hover:scale-105 active:scale-95
                      ${selectedTopic?.id === topic.id ? 'bg-yellow-300 ring-4 ring-black' : 'bg-white'}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{topic.icon}</span>
                      <div>
                        <h3 className="comic-text text-lg leading-tight">{topic.title}</h3>
                        <p className="text-[10px] font-bold text-gray-600 uppercase tracking-tighter">{topic.subject}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </ComicPanel>

            <PhotoLab />

            {/* Spell-O-Scope Tool */}
            <ComicPanel title="SPELL-O-SCOPE" color="bg-purple-100">
              <form onSubmit={handleSpellCheck} className="flex flex-col gap-3">
                <textarea
                  value={spellInput}
                  onChange={(e) => setSpellInput(e.target.value)}
                  placeholder="Type a word to check..."
                  className="w-full comic-border p-3 handwritten text-xl focus:outline-none min-h-[120px]"
                />
                <button 
                  disabled={spellLoading}
                  className="comic-border bg-black text-white py-2 comic-text text-lg hover:bg-gray-800 disabled:bg-gray-400"
                >
                  {spellLoading ? 'SCANNING...' : 'SCAN SPELLING'}
                </button>
              </form>
              {spellResult && (
                <div className="mt-4 p-4 bg-white border-2 border-dashed border-black">
                  <p className="comic-text text-sm mb-1 text-red-600">SCAN RESULT:</p>
                  <p className="handwritten text-2xl mb-2">{spellResult.correctedText}</p>
                  <p className="text-sm font-bold italic">{spellResult.explanation}</p>
                </div>
              )}
            </ComicPanel>
          </div>

          {/* Center: Lesson Area */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            {loading ? (
              <div className="flex-1 flex flex-col items-center justify-center space-y-4 py-20">
                <div className="w-16 h-16 border-8 border-black border-t-yellow-400 rounded-full animate-spin"></div>
                <p className="comic-text text-4xl animate-pulse">INKING LESSON...</p>
              </div>
            ) : lesson && selectedTopic ? (
              <>
                <ComicPanel title={selectedTopic.title.toUpperCase()} color={SUBJECT_COLORS[selectedTopic.subject]} rotation="rotate-1">
                  <div className="space-y-6">
                    <p className="marker-text text-3xl leading-snug">
                      {lesson.explanation}
                    </p>
                    
                    <div className="grid grid-cols-1 gap-4">
                      <div className="bg-white p-6 comic-border transform -rotate-1">
                        <h4 className="comic-text text-2xl mb-3 text-blue-700 underline decoration-4">CLEAR EXAMPLES</h4>
                        <ul className="list-disc list-inside handwritten text-2xl space-y-3">
                          {lesson.examples.map((ex, i) => <li key={i}>{ex}</li>)}
                        </ul>
                      </div>
                      <div className="bg-white p-6 comic-border transform rotate-1">
                        <h4 className="comic-text text-2xl mb-3 text-green-700 underline decoration-4">MASTER TIPS</h4>
                        <ul className="space-y-4">
                          {lesson.tips.map((tip, i) => (
                            <li key={i} className="handwritten text-2xl flex items-start gap-3">
                              <span className="text-yellow-500">⚡</span> {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="bg-purple-100 p-6 comic-border relative mt-8">
                       <div className="absolute -top-3 -right-3 bg-purple-900 text-white px-3 py-1 comic-text text-sm border-2 border-white">PROFESSOR'S CORNER</div>
                       <div className="flex items-start gap-4">
                         <span className="text-5xl">🧐</span>
                         <p className="handwritten text-2xl font-bold italic text-purple-900 leading-snug">
                            "{lesson.professorTip}"
                         </p>
                       </div>
                    </div>
                  </div>
                </ComicPanel>

                <ComicPanel title="THE SHOWDOWN" color="bg-orange-50" rotation="-rotate-1">
                  <div className="flex flex-col md:flex-row items-center gap-4 py-2">
                    <div className="w-full md:w-1/6 flex flex-col items-center">
                      <div className="text-6xl mb-1">🦸‍♂️</div>
                      <div className="bg-black text-white px-2 py-1 comic-text text-[10px] whitespace-nowrap">CAPTAIN SYNTAX</div>
                    </div>
                    <div className="w-full md:w-1/6 flex flex-col items-center">
                      <div className="text-6xl mb-1">🧐</div>
                      <div className="bg-purple-900 text-white px-2 py-1 comic-text text-[10px] whitespace-nowrap">PROF. PUNCTUATION</div>
                    </div>
                    <div className="flex-1 italic marker-text text-lg text-center border-x-4 border-black px-4 py-4 bg-yellow-100 shadow-inner min-h-[120px] flex items-center justify-center">
                      "{lesson.comicDialogue}"
                    </div>
                    <div className="w-full md:w-1/6 flex flex-col items-center">
                      <div className="text-6xl mb-1">🦹‍♂️</div>
                      <div className="bg-red-600 text-white px-2 py-1 comic-text text-[10px] whitespace-nowrap">THE TYPO</div>
                    </div>
                  </div>
                </ComicPanel>

                <Quiz questions={lesson.quiz} />
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40 space-y-6 py-20">
                <div className="text-9xl">📖</div>
                <p className="comic-text text-5xl">MISSION BRIEFING</p>
                <p className="marker-text text-2xl">Select a step from the dashboard or a mission here!</p>
              </div>
            )}
          </div>

          {/* Right Column: Chat */}
          <div className="lg:col-span-1 flex flex-col gap-6 h-full">
             <ComicPanel title="CAPTAIN'S COMMS" color="bg-white" className="flex-1 flex flex-col min-h-[500px]">
              <div className="flex-1 overflow-y-auto mb-4 pr-2 max-h-[450px]">
                {messages.map((msg, i) => (
                  <SpeechBubble key={i} text={msg.text} sender={msg.role === 'user' ? 'user' : msg.role === 'professor' ? 'professor' : 'hero'} />
                ))}
                <div