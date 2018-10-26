import * as React from 'react';

import Paper from '@material-ui/core/Paper';
import { StyleRulesCallback, withStyles, WithStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import DashboardCard from '../DashboardCard';
import { useBlogData } from './useBlogData';

type ClassNames = 'root' |
  'itemTitle';

const styles: StyleRulesCallback<ClassNames> = (theme) => ({
  root: {
    padding: theme.spacing.unit * 3,
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  itemTitle: {
    marginBottom: theme.spacing.unit,
  },
});

export interface BlogItem {
  description: string;
  link: string;
  title: string;
};

type CombinedProps = WithStyles<ClassNames>;

const BlogDashboardCard = (props: CombinedProps) => {

  const [loading, items, errors] = useBlogData();

  const renderBlogItem = (item: BlogItem, idx: number) =>
    <Paper key={idx} className={props.classes.root}>
      <Typography variant="subheading" className={props.classes.itemTitle}>
        <a href={item.link} className="blue" target="_blank" data-qa-blog-post>{item.title}</a>
      </Typography>
      <Typography variant="caption" data-qa-post-desc>
        {item.description.replace(' [&#8230;]', '...')}
      </Typography>
    </Paper>

  if (errors || loading || !items) { return null; }

  return (
    <DashboardCard
      title="Blog"
      headerAction={() =>
        <a href="https://blog.linode.com/" className="blue" target="_blank" data-qa-read-more>Read More</a>}
    >
      {items.map((item: BlogItem, i: number) => renderBlogItem(item, i))}
    </DashboardCard>
  );
}

const styled = withStyles(styles, { withTheme: true });

export default styled(BlogDashboardCard);
