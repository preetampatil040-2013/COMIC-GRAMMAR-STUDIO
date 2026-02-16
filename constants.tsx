
import { GrammarTopic } from './types';

export interface OrderedGrammarTopic extends GrammarTopic {
  step: number;
}

export const GRAMMAR_TOPICS: OrderedGrammarTopic[] = [
  { id: 'nouns', step: 1, title: 'Noble Nouns', subject: 'General', description: 'People, places, and heroic things!', icon: '🦸‍♂️' },
  { id: 'verbs', step: 2, title: 'Action Verbs', subject: 'Science', description: 'Describing experiments and dynamic forces.', icon: '⚡' },
  { id: 'adjectives', step: 3, title: 'Awesome Adjectives', subject: 'General', description: 'Adding color and detail to your story.', icon: '🎨' },
  { id: 'punctuation', step: 4, title: 'Punctuation POW!', subject: 'Literature', description: 'Periods, commas, and dramatic pauses.', icon: '💥' },
  { id: 'tenses', step: 5, title: 'Time-Travel Tenses', subject: 'History', description: 'Past, present, and future events.', icon: '🕰️' },
  { id: 'equations', step: 6, title: 'Math Metaphors', subject: 'Mathematics', description: 'The grammar of logic and problem solving.', icon: '🔢' },
];

export const SUBJECT_COLORS: Record<string, string> = {
  General: 'bg-yellow-400',
  Science: 'bg-green-400',
  History: 'bg-red-400',
  Literature: 'bg-blue-400',
  Mathematics: 'bg-purple-400',
};
