import { useLocation } from 'react-router-dom';
import { guideBySlug, type GuideSlug } from '@/content/guides';
import { GuidePage } from '@/pages/GuidePage';
import { NotFoundPage } from '@/pages/NotFoundPage';

function slugFromPath(pathname: string) {
  return pathname.replace(/^\/|\/$/g, '');
}

export function GuideRoute() {
  const slug = slugFromPath(useLocation().pathname) as GuideSlug;
  const guide = guideBySlug[slug];
  if (!guide) return <NotFoundPage />;
  return <GuidePage guide={guide} />;
}
