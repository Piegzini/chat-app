const app = require('../app');

const port = process.env.PORT || 8080;
app.set('port', port);

const server = app.listen(app.get('port'), () => {
  console.log(`Serwer is running on ${port} port`);
});
