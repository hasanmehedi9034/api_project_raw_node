/*
 * Title: Environments
 * Description: Handle all environment related things
 * Author: Sumit Saha ( Learn with Sumit )
 * Date: 11/20/2020
 *
 */

// dependencies

// module scaffolding
const environments = {};

// staging environment
environments.staging = {
    port: 3000,
    envName: 'staging',
    secretKey: 'hsjdhsdhsjdhjshdjshd',
    maxChecks: 5,
    twilio: {
        fromPhone: '',
        accountSid: '',
        authToken: '',
    },
};

// production environment
environments.production = {
    port: 5000,
    envName: 'production',
    secretKey: 'djkdjskdjksdjksjdskjd',
    maxChecks: 5,
    twilio: {
        fromPhone: '+15005550006',
        accountSid: 'ACb32d411ad7fe886aac54c665d25e5cd5d',
        authToken: '9455e3eb3109edc12e3d8c92768f7a67',
    },
};

// determine which environment was passed
const currentEnvironment =
    typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV : 'staging';

// export corresponding environment object
const environmentToExport =
    typeof environments[currentEnvironment] === 'object'
        ? environments[currentEnvironment]
        : environments.staging;

// export module
module.exports = environmentToExport;