import { AppService } from './app.service';
import { CloudinaryService } from './cloudinary/cloudinary.service';
export declare class AppController {
    private readonly appService;
    private readonly cloudinaryService;
    constructor(appService: AppService, cloudinaryService: CloudinaryService);
    getHello(): string;
    getHealth(): {
        status: string;
    };
    uploadFile(file: Express.Multer.File): Promise<{
        url: any;
        originalName: string;
    }>;
}
