
import React, { useState, useRef } from 'react';
import ComicPanel from './ComicPanel';
import { editHeroImage } from '../services/geminiService';

const PhotoLab: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('');
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMimeType(file.type);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setResultImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = async () => {
    if (!selectedImage || !prompt.trim()) return;

    setIsProcessing(true);
    try {
      // Remove data:image/xxx;base64, prefix
      const base64Data = selectedImage.split(',')[1];
      const result = await editHeroImage(base64Data, mimeType, prompt);
      setResultImage(result);
    } catch (error) {
      console.error("Image editing failed:", error);
      alert("POW! Something went wrong with the photo lab processing!");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ComicPanel title="HERO PHOTO LAB" color="bg-orange-100">
      <div className="flex flex-col gap-4">
        <p className="handwritten text-lg mb-2 font-bold">ZAP YOUR PHOTOS INTO COMIC MASTERPIECES!</p>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="comic-border bg-white aspect-square flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors relative group"
            >
              {selectedImage ? (
                <img src={selectedImage} alt="Selected" className="w-full h-full object-contain" />
              ) : (
                <div className="text-center p-4">
                  <span className="text-5xl block mb-2">📸</span>
                  <p className="comic-text text-xl">UPLOAD SOURCE</p>
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <p className="text-white comic-text text-2xl">CHANGE IMAGE</p>
              </div>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept="image/*"
            />
          </div>

          <div className="flex-1 flex flex-col gap-4">
            <div className="bg-white p-4 comic-border h-full flex flex-col">
              <h4 className="comic-text text-xl mb-2 text-red-600 underline">EDIT COMMANDS</h4>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. 'Add a retro comic filter' or 'Give me a superhero cape'"
                className="flex-1 w-full handwritten text-xl focus:outline-none resize-none p-2 border-2 border-dashed border-gray-300 mb-4"
              />
              <button
                onClick={handleEdit}
                disabled={isProcessing || !selectedImage || !prompt.trim()}
                className={`comic-border py-3 comic-text text-2xl transition-all ${isProcessing ? 'bg-gray-400 cursor-not-allowed animate-pulse' : 'bg-black text-white hover:bg-gray-800'}`}
              >
                {isProcessing ? 'ZAPPING...' : 'ZAP IMAGE!'}
              </button>
            </div>
          </div>
        </div>

        {resultImage && (
          <div className="mt-6 animate-in fade-in zoom-in duration-500">
            <h3 className="comic-text text-3xl mb-4 text-center text-blue-700">LAB RESULT!</h3>
            <div className="comic-border bg-white p-2 transform rotate-1 shadow-[15px_15px_0px_0px_rgba(0,0,0,1)]">
              <img src={resultImage} alt="Edited Result" className="w-full h-auto" />
            </div>
            <a 
              href={resultImage} 
              download="hero-masterpiece.png"
              className="mt-6 block text-center comic-border bg-yellow-400 p-4 comic-text text-2xl hover:bg-yellow-300 active:scale-95 transition-all"
            >
              DOWNLOAD MASTERPIECE!
            </a>
          </div>
        )}
      </div>
    </ComicPanel>
  );
};

export default PhotoLab;
