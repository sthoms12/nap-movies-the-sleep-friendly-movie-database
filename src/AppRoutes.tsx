import type { ComponentType } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Shell } from '@/components/layout/Shell';

export type AppPages = {
  Home: ComponentType;
  Criteria: ComponentType;
  Guide: ComponentType;
  NotFound: ComponentType;
};

const guidePaths = [
  'movies-to-fall-asleep-to',
  'quiet-movies-for-bedtime',
  'comfort-movies-for-sleep',
];

export function AppRoutes({ pages }: { pages: AppPages }) {
  return (
    <Routes>
      <Route element={<Shell />}>
        <Route index element={<pages.Home />} />
        <Route path="criteria" element={<pages.Criteria />} />
        <Route path="criteria/" element={<pages.Criteria />} />
        {guidePaths.flatMap((path) => [
          <Route key={path} path={path} element={<pages.Guide />} />,
          <Route key={`${path}-slash`} path={`${path}/`} element={<pages.Guide />} />,
        ])}
        <Route path="*" element={<pages.NotFound />} />
      </Route>
    </Routes>
  );
}
