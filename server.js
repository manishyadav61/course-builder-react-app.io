const jsonServer = require('json-server');
const multer = require('multer');
// Add any other import statements here

const server = jsonServer.create();
const router = jsonServer.router('db.json')
const middlewares = jsonServer.default()

//set default 
server.use(middlewares)

// Multer configuration for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public');
    },
    filename: function (req, file, cb) {
        let date = new Date();
        let fileName = date.getTime() + " " + file.originalname;
        req.body.imageFile = fileName;
        cb(null, fileName);
    }
});

const upload = multer({ storage: storage }).fields([
    { name: 'imageFile', maxCount: 1 },
    { name: 'pdfFile', maxCount: 1 }
]);

// Middleware to handle file uploads
server.use((req, res, next) => {
    upload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err);
        } else if (err) {
            return res.status(500).json(err);
        }
        next();
    });
});


  const bodyPerser = multer({ storage: storage }).any()


//tohandle Post nad PUT
server.use(bodyPerser)
server.post( "/products", (req,res, next) => {
    let data = new Date();
    req.body.createdAt = date.toISOString();

    if(req.body.price){
        req.body.price = Number(req.body.price)
    }

    let hasErrors =false
    let errors = {}

    if(req.body.name.length < 2){
        hasErrors = true
        errors.coursename = "The name length Should be at Least 2 characters"
    }

    if(req.body.teacher.length < 2){
        hasErrors = true
        errors.teacher = "The Teacher name length Should be at Least 2 characters"
    }

    if(req.body.price.length <= 0){
        hasErrors = true
        errors.price = "The price is Not valid"
    }

    if(req.body.name.length <10){
        hasErrors = true
        errors.name = "The description length Should be at Least 10 characters"
    }

    if(hasErrors){
        res.status(400).jsonp(errors)
        return
    }

    //continue json server
    next()
})

//use default router  
server.use(router)
server.listen(3000, () => {
    console.log('JSON Server is running')
})