import app from './app.js'; // For ES modules

import cloudinary, { v2 } from 'cloudinary';

cloudinary.v2.config({
    cloud_name: 'CLOUDINARY_CLOUD_NAME',
    api_key: 'CLOUDINARY_API_KEY',
    api_secret: 'CLOUDINARY_API_SECRET',
})

app.listen(process.env.PORT, () => {
    console.log(`server is listening to the port ${process.env.PORT}`);
});
