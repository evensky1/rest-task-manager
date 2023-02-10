const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const multer = require('multer')
const mongoose = require('mongoose')
const authMiddleware = require('./auth/authMiddleware')

const app = express()
const port = 8085;
__dirname = path.resolve();
const authRouter = require('./auth/authRouter.js')
app.use(express.static(path.resolve(__dirname, 'static')))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use('/auth', authRouter)
app.use(authMiddleware)

mongoose.connect(process.env.CONNECTION_URL).then(_ => console.log('Connection to mongoDB was successful'))

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },

    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({storage: storage});

const dataStorage = [
    {
        id: 1,
        key: "First task",
        summary: "This task have crucial importance for us",
        postDate: new Date(),
        status: 'wip',
        fileName: 'file-1111111111',
        fid: '',
        dueTo: "00-00-00"
    },
    {
        id: 2,
        key: "Second task",
        summary: "This task haven't crucial importance for us",
        postDate: new Date(),
        status: 'done',
        fileName: 'file-1111111111',
        fid: '',
        dueTo: "00-00-00"
    },
    {
        id: 3,
        key: "Third task",
        summary: "This task have no any importance for us",
        postDate: new Date(),
        status: 'wip',
        fileName: 'file-1111111111',
        fid: '',
        dueTo: "00-00-00"
    }];

app.route('/api/v1/tasks')
    .get((req, res) => {
        return res.status(200).send({data: dataStorage})
    })
    .post(upload.single('file'), (req, res) => {
        let task = {
            id: dataStorage.length + 1,
            key: req.body.key,
            summary: req.body.summary,
            postDate: new Date(),
            status: 'wip',
            fileName: req.file.originalname,
            fid: req.file.filename,
            dueTo: req.body.dueTo
        }

        dataStorage.unshift(task)

        return res.status(201)
            .send({newTask: task});
    })
    .put((req, res) => {
        dataStorage.find(t =>
            t.postDate.getVarDate === new Date(req.body.postDate).getVarDate)
            .status = 'done'

        return res.sendStatus(201)
    })

app.route('/api/v1/tasks/:id')
    .delete((req, res) => {
        let id = req.params['id'] - 1;
        if (id > dataStorage.length - 1 || id < 0) return res.sendStatus(404)
        delete dataStorage[id]
        return res.sendStatus(200)
    })

app.get('/download', (req, res) => {
    res.status(200)
        .download(path.resolve(__dirname, 'uploads', req.query.fid))
})

app.listen(port, () => {
    console.log('Server has been started on port ' + port)
})