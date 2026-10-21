import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-black uppercase tracking-tight text-white">Page not found</h1>
      <p className="mt-4 max-w-2xl text-sm leading-6 text-retro-text">This NapMovies page does not exist. Return to the ranked movie archive or review the Nap Index methodology.</p>
      <div className="mt-6 flex flex-wrap">
        <Link to="/" className="tap-target text-xs font-black uppercase tracking-widest text-retro-accent underline underline-offset-4">Ranked archive</Link>
        <Link to="/criteria/" className="tap-target text-xs font-black uppercase tracking-widest text-retro-accent underline underline-offset-4">Methodology</Link>
      </div>
    </main>
  );
}
