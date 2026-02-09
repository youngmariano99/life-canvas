"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudinaryProvider = void 0;
const cloudinary_1 = require("cloudinary");
exports.CloudinaryProvider = {
    provide: 'CLOUDINARY',
    useFactory: () => {
        return cloudinary_1.v2.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'SegundoCerebro',
            api_key: process.env.CLOUDINARY_API_KEY || '222411363674524',
            api_secret: process.env.CLOUDINARY_API_SECRET || '4m_EcZrdp31Q98sL4o7qwDa_D-g',
        });
    },
};
//# sourceMappingURL=cloudinary.provider.js.map