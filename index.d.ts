import { History } from 'history';

type Stringify = (query: any) => string;
type Parse = (query: string) => any;
const historyWithQuery: (history: History, stringify: Stringify, parse: Parse) => History;

export default historyWithQuery;
