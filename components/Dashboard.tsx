
import React from 'react';
import { GRAMMAR_TOPICS, SUBJECT_COLORS } from '../constants';
import ComicPanel from './ComicPanel';

interface DashboardProps {
  onSelectTopic: (topic: any) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onSelectTopic }) => {
  return (
    <div className="flex-1 flex flex-col gap-8 py-4">
      <header className="text-center space-y-2">
        <h2 className="comic-text text-5xl text-black drop-shadow-md">HERO HEADQUARTERS</h2>
        <p className="marker-text text-xl text-gray-700 uppercase">Follow the path to grammar mastery!</p>
      </header>

      <div className="relative max-w-4xl mx-auto w-full p-8">
        {/* The Path (Visual Dotted Line) */}
        <div className="absolute top-0 bottom-0 left-1/2 w-2 border-l-4 border-dashed border-black -translate-x-1/2 hidden md:block opacity-20"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
          {GRAMMAR_TOPICS.map((topic, index) => {
            const isEven = index % 2 === 0;
            return (
              <div 
                key={topic.id} 
                className={`flex items-center ${isEven ? 'md:justify-end' : 'md:justify-start'} w-full group`}
              >
                <button
                  onClick={() => onSelectTopic(topic)}
                  className={`
                    relative comic-border p-6 w-full max-w-sm transition-all hover:scale-105 active:scale-95
                    ${SUBJECT_COLORS[topic.subject]} hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]
                    flex flex-col items-center text-center gap-4
                  `}
                >
                  {/* Step Number Badge */}
                  <div className="absolute -top-6 -left-6 bg-black text-white w-14 h-14 rounded-full flex items-center justify-center border-4 border-white transform -rotate-12 comic-text text-3xl shadow-lg">
                    {topic.step}
                  </div>

                  <span className="text-7xl group-hover:animate-bounce">{topic.icon}</span>
                  <div>
                    <h3 className="comic-text text-3xl leading-none mb-1">{topic.title}</h3>
                    <p className="marker-text text-sm uppercase opacity-80">{topic.subject} MISSION</p>
                  </div>
                  <p className="handwritten text-xl font-bold leading-tight">
                    {topic.description}
                  </p>

                  {/* Connection indicator */}
                  <div className={`hidden md:block absolute top-1/2 w-12 border-t-4 border-black ${isEven ? '-right-14' : '-left-14'}`}></div>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="text-center py-8">
        <div className="inline-block comic-border bg-white p-6 transform -rotate-1">
          <p className="comic-text text-2xl">MORE MISSIONS COMING SOON... STAY VIGILANT!</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
