const assert = require('node:assert/strict');
const handler = require('./admin.js');

async function call(body, method = 'POST') {
  const res = {headers:{}, setHeader(k,v){this.headers[k]=v;}, end(body){this.body=JSON.parse(body);}};
  await handler({method, body}, res);
  return res;
}
(async () => {
  const original = global.fetch;
  try {
    assert.equal((await call({}, 'GET')).statusCode,405);
    assert.equal((await call('invalid')).statusCode,400);
    assert.equal((await call({action:'saveUser_'})).statusCode,400);
    let forwarded;
    global.fetch = async (url, options) => {
      forwarded = {url,options};
      return {ok:true, json:async () => ({ok:true,result:{token:'example-session'}})};
    };
    const result = await call({action:'signIn',username:'varun',password:'test-password'});
    assert.equal(result.statusCode,200);
    assert.equal(result.body.result.token,'example-session');
    assert.equal(result.headers['Cache-Control'],'no-store');
    assert.equal(JSON.parse(forwarded.options.body).username,'varun');
    assert.equal(forwarded.options.redirect,'follow');
    await call({action:'submitContact',name:'Guest',email:'guest@example.com'});
    assert.equal(JSON.parse(forwarded.options.body).action,'submitContact');
    global.fetch = async () => ({ok:true,json:async () => {throw new Error('HTML');}});
    const htmlResponse = await call({action:'signIn'});
    assert.match(htmlResponse.body.error,/instead of JSON/);
    assert.ok(htmlResponse.body.deployment);
    const custom = handler.createHandler('https://script.google.com/macros/s/test-deployment/exec');
    global.fetch = async (url) => {
      assert.equal(url,'https://script.google.com/macros/s/test-deployment/exec');
      return {ok:true,json:async () => ({ok:true,result:{}})};
    };
    const customRes = {setHeader(){},end(){}};
    await custom({method:'POST',body:{action:'loadView'}},customRes);
    assert.equal(customRes.statusCode,200);
    global.fetch = async () => {throw new Error('offline');};
    assert.equal((await call({action:'signIn'})).statusCode,502);
    console.log('Passed: proxy validation, allowed actions, credential forwarding, JSON response, no-store and upstream failures.');
  } finally { global.fetch = original; }
})().catch(e => {console.error(e);process.exitCode=1;});
