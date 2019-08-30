const repl = require('repl');
const user = process.env.USER;
const say = message => () => console.log(message);
//Welcome
const sayWelcome = say(`
  Hello, ${user}!
  Welcome to King Shan's Family!
`);
// Goodbye
const sayBye = say(`
  Goodbye, ${user}!
`);
// Print welcome message
sayWelcome();
// Start  REPL
var context = repl.start(
    { prompt: 'King Shan\'s Family: > ' }
);
context.relations = require('./relations');
// Exit REPL
context.on("exit", sayBye);
context.defineCommand('GET_RELATIONSHIP', {
    help: 'Find the people belonging to a relationship by passing Name and Relationship',
    action(argurments) {
        let params = {arguments}.arguments;
        let arguements = context.relations.getArguements(params);
        let getRelationship = context.relations.getRelationship(arguements);
        console.log(getRelationship);
        this.displayPrompt();
    }
});
context.defineCommand('bye', {
    help: 'Say GoodBye',
    action(){
      console.log(sayBye);
      this.close();
    }
});