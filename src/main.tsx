import { lazy } from 'react';
import { mount } from '@/bootstrap';
import { HomePage } from '@/pages/HomePage';

const CriteriaPage = lazy(() => import('@/pages/CriteriaPage').then((module) => ({ default: module.CriteriaPage })));
const GuideRoute = lazy(() => import('@/pages/GuideRoute').then((module) => ({ default: module.GuideRoute })));

mount({
  Home: HomePage,
  Criteria: CriteriaPage,
  Guide: GuideRoute,
});
