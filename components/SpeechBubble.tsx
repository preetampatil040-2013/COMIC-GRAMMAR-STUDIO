
import React from 'react';

interface SpeechBubbleProps {
  text: string;
  sender: 'hero' | 'villain' | 'user' | 'professor';
}

const SpeechBubble: React.FC<SpeechBubbleProps> = ({ text, sender }) => {
  const isUser = sender === 'user';
  const isVillain = sender === 'villain';
  const isProfessor = sender === 'professor';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`
        relative max-w-[80%] p-4 rounded-3xl comic-border
        ${isUser ? 'bg-blue-100 text-right' : isVillain ? 'bg-red-100' : isProfessor ? 'bg-purple-100 border-purple-900' : 'bg-white'}
      `}>
        {isProfessor && <p className="comic-text text-xs text-purple-900 mb-1 uppercase">Professor Punctuation:</p>}
        <p className={`${isUser ? 'handwritten' : 'marker-text'} text-lg leading-tight`}>
          {text}
        </p>
        <div className={`
          absolute w-0 h-0 
          border-l-[15px] border-l-transparent 
          border-r-[15px] border-r-transparent 
          border-t-[20px] 
          ${isUser ? 'border-t-black -bottom-5 right-6' : isProfessor ? 'border-t-purple-900 -bottom-5 left-6' : 'border-t-black -bottom-5 left-6'}
        `}></div>
      </div>
    </div>
  );
};

export default SpeechBubble;
