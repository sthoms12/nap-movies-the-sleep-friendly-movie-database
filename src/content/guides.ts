export type GuideSlug = 'movies-to-fall-asleep-to' | 'quiet-movies-for-bedtime' | 'comfort-movies-for-sleep';

export interface GuideDefinition {
  slug: GuideSlug;
  eyebrow: string;
  title: string;
  answer: string;
  introduction: string;
  selectionNote: string;
  movieIds: string[];
  faq: Array<{ question: string; answer: string }>;
}

export const guides: GuideDefinition[] = [
  {
    slug: 'movies-to-fall-asleep-to',
    eyebrow: 'Start Here',
    title: 'Movies to Fall Asleep To',
    answer: 'The best movies to fall asleep to are usually familiar rewatches with steady pacing, predictable sound, and a mood you already know. NapMovies ranks those qualities with its owner-approved Nap Index.',
    introduction: 'This shortlist favors movies that are easy to rejoin after drifting off. It is built from the official NapMovies catalog, with familiar stories, longer runtimes, and consistent atmosphere carrying more weight than conventional movie quality.',
    selectionNote: 'Start with something you already know. Familiarity is personal, so a lower-ranked favorite may work better for your quiet night than the highest-scoring unfamiliar title.',
    movieIds: ['01', '02', '03', '08', '24', '25', '26', '36'],
    faq: [
      { question: 'What makes a movie good to fall asleep to?', answer: 'NapMovies looks for familiar stories, steady pacing, manageable sound changes, visual calm, and enough runtime to avoid choosing another title quickly.' },
      { question: 'Does the highest Nap Index work for everyone?', answer: 'No. The Nap Index is an editorial guide, and your own familiarity with a movie can matter more than its position.' },
      { question: 'Are these sleep recommendations medical advice?', answer: 'No. NapMovies offers entertainment recommendations for quiet-night viewing, not medical or sleep advice.' },
    ],
  },
  {
    slug: 'quiet-movies-for-bedtime',
    eyebrow: 'Lower-Key Picks',
    title: 'Quiet Movies for Bedtime',
    answer: 'Quiet bedtime movies tend to use still compositions, long scenes, restrained dialogue, or sustained ambient sound instead of constant cuts and abrupt shifts.',
    introduction: 'These official-catalog picks emphasize stillness, atmosphere, routine, and quieter stretches. Some contain serious themes, so the best choice is a title whose story and sound profile you already know.',
    selectionNote: '“Quiet” describes the overall viewing texture, not a promise that every scene is soft. Check the title first if sudden or intense moments are a concern.',
    movieIds: ['07', '11', '12', '14', '19', '31', '38', '39', '40', '46'],
    faq: [
      { question: 'Are quiet movies always low stress?', answer: 'No. A restrained visual or audio style can still accompany serious subject matter. Familiarity and personal comfort remain important.' },
      { question: 'How are these movies selected?', answer: 'This list draws from official NapMovies rankings and favors catalog tags connected with quiet, stillness, routine, ambient sound, and slower pacing.' },
      { question: 'Can community votes change this list?', answer: 'Community votes inform the weekly review, but published scores and rankings change only after owner approval.' },
    ],
  },
  {
    slug: 'comfort-movies-for-sleep',
    eyebrow: 'Familiar Favorites',
    title: 'Comfort Movies for Sleep',
    answer: 'Comfort movies for sleep are personal favorites you can follow without concentrating. Rewatch familiarity, a predictable emotional arc, and a world you enjoy revisiting matter most.',
    introduction: 'This list leans into recognizable worlds, classic rewatches, and reassuring routines. The selections are not guaranteed to make anyone sleep; they are owner-approved quiet-night choices from the NapMovies archive.',
    selectionNote: 'Choose the movie you know best, even if it is not number one. The comfort of knowing what happens next is the point of this list.',
    movieIds: ['01', '02', '03', '04', '24', '25', '44', '45', '49', '50'],
    faq: [
      { question: 'Why can a familiar movie feel easier at bedtime?', answer: 'A familiar rewatch asks less of your attention because you already know the characters, turns, and ending.' },
      { question: 'What is a comfort pick on NapMovies?', answer: 'It is a community signal that a visitor sees the title as a reassuring rewatch. It does not directly change the official Nap Index.' },
      { question: 'How often do the official rankings change?', answer: 'Community feedback is reviewed weekly. The public ranking changes only when a new snapshot is owner-approved.' },
    ],
  },
];

export const guideBySlug = Object.fromEntries(guides.map((guide) => [guide.slug, guide])) as Record<GuideSlug, GuideDefinition>;
