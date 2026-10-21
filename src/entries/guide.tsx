import { lazy } from 'react';
import { mount } from '@/bootstrap';
import { GuideRoute } from '@/pages/GuideRoute';

const HomePage = lazy(() => import('@/pages/HomePage').then((module) => ({ default: module.HomePage })));
const CriteriaPage = lazy(() => import('@/pages/CriteriaPage').then((module) => ({ default: module.CriteriaPage })));

mount({
  Home: HomePage,
  Criteria: CriteriaPage,
  Guide: GuideRoute,
});
