import AWS from 'aws-sdk'
import multer from 'multer'
import multerS3 from 'multer-s3'
import path from 'path'


AWS.config.update({
	region: 'ap-northeast-2',
	accessKeyId: 'AKIAWMM5MTHLCGPA5XHZ',
	secretAccessKey: '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',
});

const s3 = new AWS.S3();

const allowedExtensions = ['.mp3', '.webm', '.mp4']

const s3Uploader = multer = (sessionId) => ({
    storage = multerS3({
        s3: s3,
        bucket: 'onxmoreplzbucket',
        key: (req, file, callback) => {
            try {
                const extension = path.extname(file.originalname)
                if(!allowedExtensions.includes(extension)) {
                    return callback(new Error('wrong extension'))
                }
                callback(null, `/${sessionId}.webm`)
            } catch {
                return callback(new Error('multer image upload error'));
            }
        },
        acl: 'public-read-write'
    }),
})

export default s3Uploader