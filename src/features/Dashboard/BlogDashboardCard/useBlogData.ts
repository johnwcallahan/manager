import Axios from 'axios';
import { compose, map, pathOr, take } from 'ramda';
// tslint:disable-next-line
const React = require('react');
import { parseString } from 'xml2js';

import { BlogItem } from './BlogDashboardCard';


const useEffect = React.useEffect;
const useState = React.useState;


// From the React docs:
//
// > You can tell React to skip applying an effect if certain values haven’t changed between re-renders.
// > To do so, pass an array as an optional second argument to useEffect ... If you want to run an effect and clean
// > it up only once (on mount and unmount), you can pass an empty array ([]) as a second argument.
//
// This method automatically includes an empty array as the second argument by default. This is so that if you're
// using useEffect/useState to preload a component with data, the request is only made once.
export const safelyUseEffect = (fn: () => any, updateProps: any[] = []) =>
  useEffect(fn, updateProps);

export const useBlogData = (): [boolean, BlogItem[], any[] | undefined] => {

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [errors, setErrors] = useState();

  safelyUseEffect(() => {
    Axios.create().get(`https://blog.linode.com/feed/`, { responseType: 'text' })
    .then(({ data }) => parseXMLStringPromise(data))
    .then(processXMLData)
    .then((res: BlogItem[]) => {
      setItems(res);
      setLoading(false);
    })
    .catch(() =>{
      setLoading(false);
      setErrors([{ reason: 'Unable to parse blog data.' }]);
    });
  });

  return [loading, items, errors];
}

const parseXMLStringPromise = (str: string) => new Promise((resolve, reject) =>
  parseString(str, (err, result) => err ? reject(err) : resolve(result)));

const processXMLData = compose(
  map((item: any) => ({
    description: item.description[0],
    link: item.link[0],
    title: item.title[0],
  })),
  take(5),
  pathOr([], ['rss', 'channel', 0, 'item']),
);