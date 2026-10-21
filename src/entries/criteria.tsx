import { lazy } from 'react';
import { mount } from '@/bootstrap';
import { CriteriaPage } from '@/pages/CriteriaPage';

const HomePage = lazy(() => import('@/pages/HomePage').then((module) => ({ default: module.HomePage })));
const GuideRoute = lazy(() => import('@/pages/GuideRoute').then((module) => ({ default: module.GuideRoute })));

mount({
  Home: HomePage,
  Criteria: CriteriaPage,
  Guide: GuideRoute,
});
