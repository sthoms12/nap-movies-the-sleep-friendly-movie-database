import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { AppRoutes } from '@/AppRoutes';
import { CriteriaPage } from '@/pages/CriteriaPage';
import { GuideRoute } from '@/pages/GuideRoute';
import { HomePage } from '@/pages/HomePage';
import { NotFoundPage } from '@/pages/NotFoundPage';

export function render(url: string) {
  return renderToString(
    <StaticRouter location={url}>
      <AppRoutes
        pages={{
          Home: HomePage,
          Criteria: CriteriaPage,
          Guide: GuideRoute,
          NotFound: NotFoundPage,
        }}
      />
    </StaticRouter>,
  );
}
