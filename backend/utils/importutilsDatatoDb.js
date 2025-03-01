const { models } = require('../config/db');
const fs = require('fs');
const path = require('path');
const { syncData } = require('./SyncData');
const Country = models.countries;
const State = models.state;

const jsonData = JSON.parse(fs.readFileSync(path.join(__dirname, 'countriesStates.json'), 'utf8'));
async function statesCountries() {
    try {
        for (const countryData of jsonData) {
            const country = await Country.create({
                name: countryData.name,
                code: countryData.iso2
            });

            let states = [];
            let statesData = countryData.states.map(state => {
                if (!states.includes(state.name)) {
                    states.push(state.name);
                    return {
                        name: state.name,
                        countryId: country.id
                    }
                }
            });
            statesData = statesData.filter(state => {
                return state;
            });
            await State.bulkCreate(statesData);
        }

        console.log('Data import completed.');
    } catch (error) {
        console.error('Error importing data:', error);
    } finally {
        console.log("Script execute done 100%")
    }
};
async function importData() {
    await syncData();
    await statesCountries();
};

importData();