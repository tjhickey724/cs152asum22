var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const layouts = require("express-ejs-layouts");
const axios = require('axios');
const auth = require('./routes/auth');
const session = require("express-session"); 
const MongoDBStore = require('connect-mongodb-session')(session);

// *********************************************************** //
//  Loading JSON datasets
// *********************************************************** //
const courses = require('./public/data/courses20-21.json')

// *********************************************************** //
//  Loading models
// *********************************************************** //



// *********************************************************** //
//  Connecting to the database
// *********************************************************** //

const mongoose = require( 'mongoose' );
const mongodb_URI = process.env.mongodb_URI;
//const mongodb_URI = 'mongodb://localhost:27017/cs103a_todo'
//const mongodb_URI = 'mongodb+srv://cs_sj:BrandeisSpr22@cluster0.kgugl.mongodb.net/tjhickey?retryWrites=true&w=majority'

mongoose.connect( mongodb_URI, { useNewUrlParser: true, useUnifiedTopology: true } );
// fix deprecation warnings
//mongoose.set('useFindAndModify', false); 
//mongoose.set('useCreateIndex', true);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {console.log("we are connected!!!")});

// middleware to test is the user is logged in, and if not, send them to the login page
const isLoggedIn = (req,res,next) => {
  if (res.locals.loggedIn) {
    next()
  }
  else res.redirect('/login')
}
/*
  Load MongoDB models 
*/
const ToDoItem = require('./models/ToDoItem');
const Schedule = require('./models/Schedule');
const Course = require('./models/Course')



var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const cloudData = require('./routes/cloudData');

var app = express();

var store = new MongoDBStore({
  uri: mongodb_URI,
  collection: 'mySessions'
});

// Catch errors
store.on('error', function(error) {
  console.log(error);
});

app.use(require('express-session')({
  secret: 'This is a secret 7f89a789789as789f73j2krklfdslu89fdsjklfds',
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
  },
  store: store,
  // Boilerplate options, see:
  // * https://www.npmjs.com/package/express-session#resave
  // * https://www.npmjs.com/package/express-session#saveuninitialized
  resave: true,
  saveUninitialized: true
}));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(layouts);
app.use(auth);
app.use(cloudData);
app.use('/', indexRouter);
app.use('/users', usersRouter);

app.get('/simpleform',
  isLoggedIn,
  (req,res,next) => {
    res.render('simpleform')
  })

app.post("/simpleform", 
  isLoggedIn,
 (req, res, next) => {
  // res.json(req.body);
  const { username, age, height } = req.body;
  res.locals.username = username;
  res.locals.age = age;
  res.locals.ageInDays = age * 365;
  res.locals.height = height;
  res.locals.heightCm = height * 2.54;
  res.locals.version = "1.0.0";
  res.render("simpleformresult");
});

app.get('/bmi',
  (req, res, next) => {
    res.render('bmi')
  }
)

app.post('/bmi',
  (req,res,next) => {
    const {username, weight, height} = req.body;
    res.locals.username = username;
    res.locals.height = height;
    res.locals.weight = weight;
    res.locals.BMI = weight/(height*height)*703;
    res.locals.version = '1.0.0';
    res.render('bmiresults');
  }
)

app.get('/dist',
  (req, res, next) => {
    res.render('dist')
  }
)

app.post('/dist',
  (req,res,next) => {
    const {x,y,z} = req.body;
    res.locals.x = x
    res.locals.y = y
    res.locals.z = z
    res.locals.d = Math.sqrt(x*x+y*y+z*z)
    res.render('distResult');
  }
)
const family = [
  {name:'Tim',age:66,},
  {name:'Caitlin',age:27,},
  {name:'Ryan',age:23,},
];

app.get('/showFamily',
  (req,res,next) => {
    res.locals.family = family;
    res.render('showFamily');
  })

app.get('/apidemo/:email',
  async (req,res,next) => {
    const email = req.params.email;
    const response = await axios.get('https://www.cs.brandeis.edu/~tim/cs103aSpr22/courses20-21.json')
    console.dir(response.data.length)
    res.locals.courses = response.data.filter((c) => c.instructor[2]==email+"@brandeis.edu")
    res.render('showCourses')
    //res.json(response.data.slice(100,105));
  })

app.get('/exam3b',(req,res,next) => {
  res.render('exam3b')
})

app.post('/exam3b',
  async (req,res,next) => {
    res.locals.url = req.body.url;
    res.render('exam3bShowImage')
  });

app.get('/meals',(req,res,next) => {
  res.render('meals')
})

app.post('/meals',
  async (req,res,next) => {
    const ingredient = req.body.ingredient;
    const url="https://www.themealdb.com/api/json/v1/1/filter.php?i="+ingredient
    const response = await axios.get(url)
    console.dir(response.data)
    res.locals.ingredient = ingredient
    res.locals.meals = response.data.meals || []
    res.render('showMeals')
  })

app.get('/showIngredients',
  async (req,res,next) => {
    const url="https://www.themealdb.com/api/json/v1/1/list.php?i=list"
    const response = await axios.get(url)
    console.dir(response.data)
    res.locals.ingredients = response.data.meals || []
    res.render('showIngredients')
  })

app.get('/githubInfo/:githubId',
  async (req,res,next) => {
    const id = req.params.githubId;
    const response = await axios.get('https://api.github.com/users/'+id+'/repos')
    console.dir(response.data.length)
    res.locals.repos = response.data
    res.render('showRepos')
    //res.json(response.data.slice(100,105));
  })

app.get('/uploadDB',
  async (req,res,next) => {
    await Course.deleteMany({});
    await Course.insertMany(courses);

    const num = await Course.find({}).count();
    res.send("data uploaded: "+num)
  }
)

app.get('/bigCourses',
  async (req,res,next) => {
    try{
      const bigCourses =  await Course.find({enrolled:{$gt:150}})
                          //.select("subject coursenum name enrolled term")
                          //.sort({term:1,enrolled:-1})
                          //.limit(3)
                          ;
      res.json(bigCourses);
    }catch(e){
      next(e)
    }
  })



app.get('/addCourse/:courseId',
   isLoggedIn,
   async (req,res,next) => {
    try {
      const schedItem = 
         new Schedule(
          {
            userid:res.locals.user._id,
            courseId:req.params.courseId}
          )
      await schedItem.save();
      res.redirect('/coursesBySubject')
    }catch(e) {
      next(e)
    }
   }

)

app.get('/showSchedule',
  isLoggedIn,
  async (req,res,next) => {
    try{
      const courses = 
         await Schedule.find({userId:res.locals.user.id})
             .populate('courseId');
      //res.json(courses);
      res.locals.courses = courses;
      res.render('showmyschedule')

    }catch(e){
      next(e);
    }
  }
)

app.get('/deleteFromSchedule/:itemId',
    isLoggedIn,
    async (req,res,next) => {
      try {
        const itemId = req.params.itemId;
        await Schedule.deleteOne({_id:itemId});
        res.redirect('/showSchedule');
      } catch(e){
        next(e);
      }
    }
)
	

app.get('/coursesBySubject',
  isLoggedIn,
  async (req,res,next) => {
    res.locals.courses =[]
    console.log('rendering couresBySubject')
    const scheduledCourses = 
    await Schedule.find({userId:res.locals.user.id});
    res.locals.schedIds = 
      scheduledCourses.map(x => {
        let y = x.courseId.valueOf();
        console.log(y); console.log(typeof y);
        return y+"";
      });
    res.render('coursesBySubject')
})
  


app.post('/coursesBySubject',
  async (req,res,next) => {
    try{
      const subject = req.body.subject;
      const term = req.body.term;
      const data = await Course.find({
        subject:subject,
        term:term, 
        enrolled:{$gt:10}
      })
               .sort({enrolled:-1})
      //res.json(data); 
      const scheduledCourses = 
         await Schedule.find({userId:res.locals.user.id});
      res.locals.schedIds = 
         scheduledCourses.map(x => x.courseId);
      res.locals.courses = data;
      res.render('coursesBySubject');

    }catch(e){
      next(e)
    }
  }
)



app.get('/todo', (req,res,next) => res.render('todo'))

app.post('/todo',
  isLoggedIn,
  async (req,res,next) => {
    try {
      const desc = req.body.desc;
      const todoObj = {
        userId:res.locals.user._id,
        descr:desc,
        completed:false,
        createdAt: new Date(),
      }
      const todoItem = new ToDoItem(todoObj); // create ORM object for item
      await todoItem.save();  // stores it in the database
      res.redirect('/showTodoList');


    }catch(err){
      next(err);
    }
  }
)

app.get('/showTodoList',
        isLoggedIn,
  async (req,res,next) => {
   try {
    const todoitems = await ToDoItem.find({userId:res.locals.user._id});

    res.locals.todoitems = todoitems
    res.render('showTodoList')
    //res.json(todoitems);
   }catch(e){
    next(e);
   }
  }
)

app.get('/deleteToDoItem/:itemId',
    isLoggedIn,
    async (req,res,next) => {
      try {
        const itemId = req.params.itemId;
        await ToDoItem.deleteOne({_id:itemId});
        res.redirect('/showTodoList');
      } catch(e){
        next(e);
      }
    }
)

app.get('/toggleToDoItem/:itemId',
    isLoggedIn,
    async (req,res,next) => {
      try {
        const itemId = req.params.itemId;
        const item = await ToDoItem.findOne({_id:itemId});
        item.completed = ! item.completed;
        await item.save();
        res.redirect('/showTodoList');
      } catch(e){
        next(e);
      } 
    }
)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
