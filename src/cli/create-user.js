const db = require('../db');
const logger = require('../logger');
const { ask }  = require('../util/cli');
const User = require('../util/user');


class CreateUser {

    async execute() {
        console.log('Welcome to Create User wizard');
        console.log('Please fill in the following information\n');
        const firstName = ask('First name');
        const lastName = ask('Last name');
        const email = ask('Email', {
            validator: (value) => {
                const emailRegex = new RegExp('^[a-zA-Z0-9.!#$%&\'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$');
                if (!emailRegex.test(value)) {
                    throw 'Invalid email address format. Example: john@example.com';
                }
            }
        });
        const password = ask('Password', {
            hideEchoBack: true
        });
       const userUtil = new User();
       const user = await userUtil.create({
           firstName,
           lastName,
           email,
           password
       });
       logger.log(`New user "${ user.email }" created successfully`);
       console.log('\nUser data\n');
       console.log(user);
       return true;
    }

}

(async () => {
    try {
        const createUser = new CreateUser();
        await createUser.execute();
    } catch (e) {
        logger.log(e);
    } finally {
        await db.disconnect();
    }
})();
