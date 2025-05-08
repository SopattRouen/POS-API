// ================================================================>> Third Party Library
import "colors";
import * as readlineSync from 'readline-sync';
import { Sequelize } from 'sequelize-typescript';

// ================================================================>> Custom Library
import sequelizeConfig from '@config/sequelize.config';

import { OrderSeeder } from "./seeds/pos/order.seeder";
import { ProductSeeder } from "./seeds/pos/product.seeder";
import { UserSeeder } from "./seeds/user/user.seed";

class SeederInitializer {

    private sequelize: Sequelize;

    constructor() {
        this.sequelize = new Sequelize(sequelizeConfig);
    }

    private async confirmSeeding(): Promise<boolean> {
        const tableNames = await this.sequelize.getQueryInterface().showAllTables();
        if (tableNames.length > 0) {
            const message = 'This will drop and seed again. Are you sure you want to proceed?'.yellow;
            return readlineSync.keyInYNStrict(message);
        }
        return true;
    }

    private async dropAndSyncDatabase() {
        await this.sequelize.sync({ force: true });
    }

    private async seedData() {
        
        //===================== user data
        await UserSeeder.seed();
        //===================== pos data
        await ProductSeeder.seed();
        await OrderSeeder.seed();
    }

    private async handleSeedingError(error: Error) {
        await this.sequelize.sync({ force: true });
        console.log('\x1b[31m%s\x1b[0m', error.message);
        process.exit(0);
    }

    public async startSeeding() {
        try {
            const confirmation = await this.confirmSeeding();
            if (!confirmation) {
                console.log('\nSeeders have been cancelled.'.cyan);
                process.exit(0);
            }

            await this.dropAndSyncDatabase();
            await this.seedData();
            process.exit(0);
        } catch (error) {
            await this.handleSeedingError(error);
        }
    }
}

const seederInitializer = new SeederInitializer();
seederInitializer.startSeeding();
