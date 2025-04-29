require('dotenv').config()

const express = require('express')
const cors = require('cors')
const mysql = require('mysql2')
const session = require('express-session')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');

const SALT_ROUNDS_COUNT = 10;

const app = express()
const allowed_origins = ['http://localhost:5173',
    'https://workout-tracking-app-lake.vercel.app',
    'https://workout-tracking-app-ben-st-clairs-projects.vercel.app',
    'https://workout-tracking-app-git-main-ben-st-clairs-projects.vercel.app']
app.use(cors({
    origin: allowed_origins, // React app origin
    credentials: true
  }));;
app.use(express.json());

app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: true,
        httpOnly: true,
        sameSite: 'none',
      },
    })
  );

var connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: 3306
})

connection.connect(function(err) {
    if (err) {
      throw err;
    };
    console.log("Connected to MYSQL database!");
})

app.get('/api', (req, res) => {
    const sql = 'SELECT * FROM Users'
    connection.query(sql, function(error, result) {
        if (error) throw error;
        else {
            res.json(result[0])
        }
    })
})
app.get('/exercises', (req, res) => {
    const sql = `SELECT * FROM Exercises 
                WHERE user_id = ? OR user_id = ?
                ORDER BY name`
    const userId = req.session.user
    console.log("/exercises UserID: ", userId)
    connection.query(sql, [process.env.ROOT_USER_ID, userId], function(error, result) {
        if (error) throw error;
        else {
            res.json(result)
        }
    })
})
app.get('/exerciseData/:input', (req, res) => {
    const exercise_id = req.params.input;
    const user_id = req.session.user
    console.log("/exercideData/:input UserID: ", user_id)
    const sql = `SELECT Sets.reps, Sets.weight, Workouts.date
                FROM Sets 
                INNER JOIN Workouts ON Sets.workout_id = Workouts.id
                WHERE Sets.exercise_id = ? AND Workouts.user_id = ?`;
    connection.query(sql, [exercise_id, user_id], function(err, setsResult) {
        if (err) return res.status(500).json({ error: err.message })
        connection.query(
            `SELECT name FROM Exercises where id = ?`,
            [exercise_id], function(err, nameResult) {
                if (err) return res.status(500).json({ error: err.message })
                res.json({
                    exercise: nameResult[0].name,
                    sets: setsResult
                });
            
        })
    })
})
app.get('/weightData', (req, res) => {
    const userId = req.session.user
    console.log("/weightData UserID: ", userId)
    const sql = `SELECT weight, date
                FROM WeightLogs
                WHERE userId = ?`
    connection.query(sql, [userId], function(err, result) {
        if (err) {
            console.log("Error: ", err.message)
            return res.status(500).json({ error: err.message })
        }
        res.json(result)
    })
})


app.post('/newExercise', (req, res) => {
    const postData = req.body;
    const userId = req.session.user
    console.log("/newExercise UserID: ", userId)
    const query = {
        name: postData.exerciseName,
        user_id: userId
    }
    connection.query('INSERT INTO Exercises SET ?', query, function(err, result) {
        if (err) throw err;
        else {
            console.log("New exercise inserted")
            res.json({
                id: result.insertId,
                name: postData.exerciseName
            })
        }
    })
})
app.post('/editExercise', (req, res) => {
    const postData = req.body
    const user_id = req.session.user
    console.log("/editExercise UserID: ", user_id)
    const sql = `UPDATE Exercises
                SET name = ?
                WHERE id = ? AND user_id = ?`
    connection.query(sql, [postData.name, postData.id, user_id], function(err, result) {
        if (err) throw err;
        else {
            res.status(200).json({ message: 'Successful exercise edit'})
        }
    })
})
app.post('/deleteExercise', (req, res) => {
    const postData = req.body
    const user_id = req.session.user
    console.log("/deleteExercise UserID: ", user_id)
    const sql = `DELETE FROM Exercises
                WHERE id = ? and user_id = ?`
    connection.query(sql, [postData.id, user_id], function(err, result) {
        if (err) throw err;
        else { 
            res.status(200).json({ message: 'Successful exercise delete' })
        }
    })
})
app.post('/submitWorkout', (req, res) => {
    const exercises = req.body;
    const userId = req.session.user
    console.log("/submitWorkout UserID: ", userId)
    insertWorkoutData(exercises, userId)
    return res.status(200).json({message: 'Successful workout submit'})
})
async function insertWorkoutData(workoutData, userId) {
    var workoutId = null
    try {
        workoutId = await getNewWorkoutId(workoutData, userId);
    } catch (error) {
        console.error("Error creating workout: ", error)
    }
    try {
        const exercises = workoutData.exercises
        for (var i=0; i<exercises.length; i++) {
            const exerciseObj = exercises[i]
            for (var j=0; j<exerciseObj.sets.length; j++) {
                const set = {
                    workout_id: workoutId,
                    exercise_id: exerciseObj.exercise.id,
                    reps: exerciseObj.sets[j].reps,
                    weight: exerciseObj.sets[j].weight,
                }
                console.log("Workout id", workoutId)
                console.log("set object: ", set)
                insertSet(set)
            }
        }
        return 200
    } catch (error) {
        console.log("Error:", error)
        return 400
    }
}
function getNewWorkoutId(workoutData, userId) {
    return new Promise((resolve, reject) => {
        connection.query(
            'INSERT INTO Workouts (user_id, date, notes) VALUES (?, ?, ?)', [userId, workoutData.date, workoutData.notes], 
            function(err, result) {
                if (err) reject(err);
                else {
                    console.log("insertId: ", result.insertId)
                    resolve(result.insertId)
                }
            }
        )
    })
}
function insertSet(set) {
    connection.query('INSERT INTO Sets SET ?', set, function(err, result) {
        if (err) throw err;
    })
}
app.get('/workouts', (req, res) => {
    const user_id = req.session.user
    console.log("/workouts UserID: ", user_id)
    const sql = `SELECT id, date, notes
                FROM Workouts
                WHERE user_id = ?
                ORDER BY date DESC`
    connection.query(sql, [user_id], function(err, result) {
        if (err) {
            console.log("Error: ", err.message)
            return res.status(500).json({ error: err.message })
        }
        res.json(result)
    })
})
app.get('/workoutData/:input', (req, res) => {
    const workout_id = req.params.input
    const user_id = req.session.user
    console.log("/workoutData/:input UserID: ", user_id)
    const sql = `SELECT date, notes
                FROM Workouts
                WHERE id = ? AND user_id = ?`
    connection.query(sql, [workout_id, user_id], function(err, workoutResult) {
        if (err) return res.status(500).json({ error: err.message })
        else if ( workoutResult.length == 0 ) return res.status(500).json({ message: "unauthorized workout" })
        const sql_2 = `SELECT Sets.reps, Sets.weight, Exercises.name
                    FROM Sets
                    INNER JOIN Exercises ON Sets.exercise_id = Exercises.id
                    WHERE Sets.workout_id = ?`
        connection.query(sql_2, [workout_id], function(err, setsResult) {
            if (err) return res.status(500).json({ error: err.message })
            res.json({
                date: workoutResult[0].date,
                notes: workoutResult[0].notes,
                sets: setsResult
            })
        })
    })
})
app.post('/submitWeightLog', (req, res) => {
    const data = req.body
    const userId = req.session.user
    console.log("/submitWeightLog userId: ", userId)
    const sql = `INSERT INTO WeightLogs (userId, weight, date) VALUES (?, ?, ?)`
    connection.query(sql, [userId, data.weight, data.date], function(err, result) {
        if (err) res.status(500).json({ error: err.message })
        else {
            return res.status(200).json({message: 'Successful weight log submission'})
        }
    })

})
app.post('/sign-up', (req, res) => {
    const {username, password} = req.body;
    const hashedPassword = bcrypt.hashSync(password, SALT_ROUNDS_COUNT);
  
    // if username is not taken, make query to insert new username and hashed password in database
    connection.query('INSERT INTO Users (username, password_hash) VALUES (?, ?)', [username, hashedPassword], (error, result) => {
      if (error) {
        console.log("Username taken");
        return res.status(401).json({message: 'Username taken'});
      } else {
        const userId = result.insertId
        req.session.user = userId;
        
        const jwtToken = jwt.sign(
            { userId: userId},
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        )
        req.session.save((err) => {
            if (err) return res.status(500).json({ error: "Session error" });
            res.status(200).json({
                message: "SignUp successful",
                token: jwtToken,
                user: { id: userId, username: username }
        })});
      }
    });
})

app.post('/login', (req, res) => {
    const {username, password} = req.body
    console.log("userData:", username)
    const sql = 'SELECT * FROM Users WHERE username = ?'
    connection.query(sql, [username], function(error, result) {
        if (error) throw error;
        if (result.length == 0) {
            console.log("no username match")
            res.status(401).json({message: 'Incorrect username/password'})
        } else if (!bcrypt.compareSync(password, result[0].password_hash)) {
            console.log("password doesn't match")
            res.status(401).json({message: 'Incorrect username/password'})
        } else {
            console.log("Successful username and password")
            const userId = result[0].id
            req.session.user = userId

            const jwtToken = jwt.sign(
                { userId: userId},
                process.env.JWT_SECRET,
                { expiresIn: '1d' }
            )
            req.session.save((err) => {
                if (err) return res.status(500).json({ error: "Session error" });
                res.status(200).json({
                    message: "Login successful",
                    token: jwtToken,
                    user: { id: userId, username: username }
            })});
        }
    })
})

app.post("/logout", (req, res) => {
    req.session.user = null
    res.status(200).json({ message: "successfully logged out" })
})



app.listen(4800, () => { console.log("server has started on port 4800") })