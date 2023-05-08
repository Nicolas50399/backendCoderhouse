const multer = require('multer');
const path = require('path')
let imageName
let folder = "./uploads"

function userUpload(){
    folder = "./uploads/users"
}
function productUpload(){
    folder = "./uploads/products"
}

const storage = multer.diskStorage({
    destination: path.join(__dirname, folder),
    filename: function (req, file, cb) {
        // generate the public name, removing problematic characters
        const originalName = encodeURIComponent(path.parse(file.originalname).name).replace(/[^a-zA-Z0-9]/g, '')
        const timestamp = Date.now()
        const extension = path.extname(file.originalname).toLowerCase()
        imageName = originalName + '_' + timestamp + extension
        cb(null, imageName)
    }
})

const upload = multer({
    storage: storage,
    limits: { fileSize: 1 * 1024 * 1024 }, // 1 Mb
    fileFilter: (req, file, callback) => {
        const acceptableExtensions = ['png', 'jpg', 'jpeg', 'jpg']
        if (!(acceptableExtensions.some(extension => 
            path.extname(file.originalname).toLowerCase() === `.${extension}`)
        )) {
            return callback(new Error(`Extension no permitida, las aceptadas son ${acceptableExtensions.join(',')}`))
        }
        callback(null, true)
    }
}).single('foto')


module.exports = {upload, userUpload, productUpload, imageName}