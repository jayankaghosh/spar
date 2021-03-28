const readlineSync = require('readline-sync');



const Cli = {
    ask: (question, options) => {
        const defaultOptions = { isRequired: true };
        options = { ...options, ...defaultOptions };
        const answer = readlineSync.question(`${ question }: `, options);
        try {
            if (!answer && options.isRequired) {
                throw 'This is a required field';
            } else if (typeof options.validator === 'function') {
                options.validator(answer);
            }
        } catch (e) {
            console.log(e);
            return Cli.ask(question, options);
        }
        return answer;
    }
};

module.exports = Cli;
