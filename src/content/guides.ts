export type GuideSlug = 'movies-to-fall-asleep-to' | 'quiet-movies-for-bedtime' | 'comfort-movies-for-sleep' | 'visually-dark-movies-to-fall-asleep-to';

export interface GuideLink {
  phrase: string;
  to: string;
}

export interface GuideFaq {
  question: string;
  answer: string;
  links?: GuideLink[];
}

export interface GuideDefinition {
  slug: GuideSlug;
  eyebrow: string;
  title: string;
  answer: string;
  introduction: string;
  selectionNote: string;
  selectionLinks?: GuideLink[];
  lead?: string[];
  questionsFirst?: boolean;
  movieIds: string[];
  faq: GuideFaq[];
}

export const guides: GuideDefinition[] = [
  {
    slug: 'movies-to-fall-asleep-to',
    eyebrow: 'Start Here',
    title: 'Movies to fall asleep to',
    answer: 'Movies to nap to are usually familiar rewatches with steady pacing, predictable sound, and a mood you already know.',
    introduction: 'This owner-approved shortlist from the NapMovies catalog favors movies you can rejoin after drifting off. Familiar stories, longer runtimes, and consistent atmosphere carry more weight than conventional movie quality.',
    selectionNote: 'Start with something you already know. Familiarity is personal, so a lower-ranked favorite may work better for your quiet night than the highest-scoring unfamiliar title.',
    movieIds: ['01', '02', '03', '08', '24', '25', '26', '36'],
    faq: [
      { question: 'What makes a movie good to fall asleep to?', answer: 'NapMovies looks for familiar stories, steady pacing, manageable sound changes, visual calm, and enough runtime to avoid choosing another title quickly.' },
      { question: 'Does the highest Nap Index work for everyone?', answer: 'No. The Nap Index is an editorial guide, and your own familiarity with a movie can matter more than its position.' },
      { question: 'Are these sleep recommendations medical advice?', answer: 'No. NapMovies offers entertainment recommendations for quiet-night viewing, not medical or sleep advice.' },
      { question: 'What is the best Harry Potter movie to fall asleep to?', answer: 'Harry Potter (Complete Film Series) sits at number 2 on this list with a Nap Index of 9/10. The familiar wizarding world, gentle scoring, and a story you already know make it one of the strongest comfort rewatches in the archive.' },
    ],
  },
  {
    slug: 'quiet-movies-for-bedtime',
    eyebrow: 'Lower-Key Picks',
    title: 'Quiet bedtime movies',
    answer: 'Quiet bedtime movies tend to use still compositions, long scenes, restrained dialogue, or sustained ambient sound instead of constant cuts and abrupt shifts.',
    introduction: 'These official-catalog bedtime movies emphasize stillness, atmosphere, routine, and quieter stretches. Some contain serious themes, so the best choice is a title whose story and sound profile you already know.',
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
    title: 'Comfort movies for sleep',
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
  {
    slug: 'visually-dark-movies-to-fall-asleep-to',
    eyebrow: 'Dim & Muted Picks',
    title: 'Visually dark movies to fall asleep to',
    answer: 'Visually dark movies to fall asleep to are pictures with low brightness, a muted palette, and calm pacing. The short list below uses owner-approved NapMovies titles tagged Dark, Muted Colors, Fog, Stillness, or Slow.',
    introduction: 'Start with these owner-approved catalog titles for quiet-night viewing, not as medical or sleep advice.',
    selectionNote: 'Dark describes the picture, not the mood. Some of these stories are serious, so pick a title you already know. Read what visual stillness means in the Nap Index to see one editorial factor behind the score.',
    selectionLinks: [{ phrase: 'what visual stillness means in the Nap Index', to: '/criteria/' }],
    lead: [
      'Prisoners (2013), Nap Index 9/10. Catalog tags include Dark and Rain.',
      'Tinker Tailor Soldier Spy (2011), Nap Index 9/10. Catalog tags include Muted Colors and Slow.',
      'Arrival (2016), Nap Index 8/10. Catalog tags include Quiet and Fog.',
      'A Ghost Story (2017), Nap Index 8/10. Catalog tags include Stillness and Slow.',
    ],
    questionsFirst: true,
    movieIds: ['29', '18', '17', '07', '11', '12', '14'],
    faq: [
      {
        question: 'What is the best movie to fall asleep to?',
        answer: 'The highest Nap Index in the owner-approved archive is 9/10, shared by many titles. In that archive, sorted by score and then by title, A River Runs Through It is first. Its tags include Water and Nature, so it is a familiar outdoor rewatch, not a visually dark movie. For the broader shortlist, see the owner-approved movies to fall asleep to.',
        links: [{ phrase: 'owner-approved movies to fall asleep to', to: '/movies-to-fall-asleep-to/' }],
      },
      {
        question: 'What is the best scary movie to fall asleep to?',
        answer: 'NapMovies does not rank jump-scare horror, and no catalog title is tagged horror or scary. The still, slow option on this page is A Ghost Story. Its tags include Stillness and Slow, and its Nap Index is 8/10. Prisoners is the only title tagged Dark, at Nap Index 9/10, and its tags also include Rain. For lower-key pacing, see quiet movies for bedtime.',
        links: [{ phrase: 'quiet movies for bedtime', to: '/quiet-movies-for-bedtime/' }],
      },
      {
        question: 'What are some good dark movies?',
        answer: 'Catalog tags that match a dark or muted picture include Dark on Prisoners (Nap Index 9/10), Muted Colors and Slow on Tinker Tailor Soldier Spy (9/10), Night on Margin Call (8/10), and Fog on Arrival (8/10). A Ghost Story (8/10) has tags that include Stillness and Slow. Moon (8/10, tags include Isolation and Ambient) and Solaris (2002) (8/10, tags include Space and Dreamlike) are on this page as well. When a familiar story matters more than a dim image, see familiar comfort movies for sleep.',
        links: [{ phrase: 'familiar comfort movies for sleep', to: '/comfort-movies-for-sleep/' }],
      },
      {
        question: 'Are these sleep recommendations medical advice?',
        answer: 'No. NapMovies offers entertainment recommendations for quiet-night viewing, not medical or sleep advice.',
      },
    ],
  },
];


export const guideBySlug = Object.fromEntries(guides.map((guide) => [guide.slug, guide])) as Record<GuideSlug, GuideDefinition>;
