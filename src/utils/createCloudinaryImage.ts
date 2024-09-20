import { BadRequestException } from '@nestjs/common';

const cloudinary = require('cloudinary').v2;

const createCloudinaryImage = async (dataStream: string) => {
  return await new Promise((resolve) => {
    cloudinary.uploader
      .upload_stream((error: string, uploadResult: {}) => {
        if (error) {
          throw new BadRequestException('Something went wrong', error);
        }
        return resolve(uploadResult);
      })
      .end(dataStream);
  });
};

module.exports = { createCloudinaryImage };
