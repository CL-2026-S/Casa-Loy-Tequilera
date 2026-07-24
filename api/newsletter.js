import subscribeHandler from './_newsletter/subscribe.js';
import unsubscribeHandler from './_newsletter/unsubscribe.js';

export default async function handler(req, res) {
  const action = req.query.action || (req.method === 'POST' ? 'subscribe' : 'unsubscribe');

  if (action === 'subscribe') {
    return subscribeHandler(req, res);
  } else {
    return unsubscribeHandler(req, res);
  }
}
