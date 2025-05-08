// ===========================================================================>> Core Library
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
// ===========================================================================>> Third Party Library
import * as express from 'express';
import * as expressHandlebars from 'express-handlebars';
import { join } from 'path';
// ===========================================================================>> Costom Library
import { AppModule } from './app/app.module';

class AppInitializer {

    private readonly logger = new Logger(AppInitializer.name);
    private app: NestExpressApplication;

    private async initializeApplication() {
        this.app = await NestFactory.create<NestExpressApplication>(AppModule);
        this.configureMiddlewares();
        this.configureViews();
        this.configuareAssets();
    }

    private configureMiddlewares() {
        this.app.enableCors(); // Enables CORS with default settings
        this.app.useGlobalPipes(new ValidationPipe({
            whitelist: true,
            transform: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
        }));
        this.app.use(express.json({ limit: '50mb' }));
        this.app.use(express.urlencoded({ limit: '50mb', extended: true }));
    }

    private configureViews() {
        this.app.setBaseViewsDir(join(__dirname, '..', 'src'));
        const hbs = expressHandlebars.create({
            extname: '.html',
            layoutsDir: join(__dirname, '..', 'src'),
            defaultLayout: null
        });
        this.app.engine('html', hbs.engine);
        this.app.setViewEngine('html');
    }

    private configuareAssets() {
        this.app.useStaticAssets(join(__dirname, '..', 'public'));
    }

    public async start(port: number) {
        try {

            await this.initializeApplication();
            await this.app.listen(port);
            
            this.logger.log(`\x1b[32m I Love You.: \x1b[34mhttp://localhost:${port}\x1b[37m`);
        
        } catch (error) {
            this.logger.error(`\x1b[31mError starting the server: ${error.message}\x1b[0m`);
            process.exit(1);
        }
    }
    
}

const appInitializer = new AppInitializer();
appInitializer.start(Number(process.env.PORT) || 3000);
