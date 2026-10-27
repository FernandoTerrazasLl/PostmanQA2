function fn() {
  var env = karate.env; // get system property 'karate.env'
  karate.log('karate.env system property was:', env);
  if (!env) {
    env = 'dev';
  }
  var gorestToken = java.lang.System.getenv('GOREST_TOKEN');
  if (!gorestToken) {
    karate.fail('GOREST_TOKEN es obligatorio. Defínelo como variable de entorno antes de ejecutar Karate.');
  }
  var gorestBaseUrl = java.lang.System.getenv('GOREST_BASE_URL') || 'https://gorest.co.in/public/v2';
  var config = {
    env: env,
    myVarName: 'someValue',
    gorestToken: gorestToken,
    gorestBaseUrl: gorestBaseUrl
  }
  if (env == 'dev') {
    // customize
    // e.g. config.foo = 'bar';
  } else if (env == 'e2e') {
    // customize
  }
  return config;
}
