import appHandlers from './app';
import stacHandlers from './stac';

const handlers = [...appHandlers, ...stacHandlers];

export default handlers;
