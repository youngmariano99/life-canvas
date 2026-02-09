
import { v2 as cloudinary } from 'cloudinary';

export const CloudinaryProvider = {
    provide: 'CLOUDINARY',
    useFactory: () => {
        return cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'SegundoCerebro',
            api_key: process.env.CLOUDINARY_API_KEY || '222411363674524',
            api_secret: process.env.CLOUDINARY_API_SECRET || '4m_EcZrdp31Q98sL4o7qwDa_D-g',
        });
    },
};
