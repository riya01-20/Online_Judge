const express = require('express');
const router = express.Router();
const {generateFile} = require('../utils/generateFile');
const {executeCpp, executePython} = require('../utils/executeCpp');

const ProblemsSchema = require("../models/ProblemsSchema");
const SubmissionSchema = require("../models/SubmissionSchema");
// route used to add problems to the list of the total problems viewed by the user 
router.post('/addprob', async (req, res) => {
    try {
        const {statement, name, code, difficulty} = req.body;

        const problem = new ProblemsSchema({
            statement, name, code, difficulty
        })
    
        await problem.save();
        return res.json({message: "problem added successfully"});
    } catch(err){
        return res.json({Error: err.message});
    }
})
// route used to add add testcases to a particular problem by getting it problem_id 
//from the database used to check the correctness of the code submitted by the user
router.post('/add-testcases', async(req, res) => {
    try {
        const {probid, input, expectedOutput} = req.body;
        console.log("yess")
        const problem = await ProblemsSchema.findById(probid);
        // if problem id is not found then show the error message
        if(!problem){
            return res.json({message: "Problem not found"})
        }
        //else add the testcases to the particular problem
        problem.testCases.push({input, expectedOutput});
        await problem.save();

        return res.json({message: problem})
    } catch(err){
        return res.json({message: err});
    }
})
    // route to get all the problems
router.get('/all', async(req, res) => {
    try {
        const problems = await ProblemsSchema.find();
        return res.json({message: problems});

    } catch(err){
        return res.json({Error: err});
    }
})
    // route to get all the problems by its id
router.post('/get_prob_by_id', async(req, res) => {

    try {
        const _id = req.body;
        // console.log(id);// find problem by its id.
        const prob = await ProblemsSchema.find({_id});
        console.log(prob);
        //if exists then return the particular problem
        if(prob){
            return res.json({message: prob});
        }
    } catch (err){
        return res.json({Error: err});
    }
})
// submit route for the submission of the code on the compiler
router.post('/submit', async(req, res) => {
    const { lang, code, probid, user_id} = req.body;
    console.log(code);
    const problem = await ProblemsSchema.findById(probid);
    if(code === undefined){  // code can't be empty 
        return res.json({message: "Empty code body"});
    }

    try {
        const filePath = await generateFile(lang, code);
        console.log(filePath);
        var output;
        const results = [];
        for(const testcase of problem.testCases){
            const {input, expectedOutput} = testcase;
            try {
                if(lang == 'cpp'){
                    output = await executeCpp(filePath,input);
                }
                if(lang == 'python'){
                    output = await executePython(filePath, input);
                }
                const isCorrect = output.trim() === expectedOutput.trim();
                results.push({input, expectedOutput, output, isCorrect});

            } catch(err){
                console.log(err);
                results.push({input, expectedOutput, output: `${err.message}`, isCorrect: false});
            }
            
        }

        const submission = new SubmissionSchema({
            user_id: user_id,
            problem_name: problem.name,
            verdict: results.every((res)=> res.isCorrect)
        })
        await submission.save();

        // console.log(results);
    
    return res.json({filePath, output, results});

    } catch(err){
        return res.json({message: err.message})
    }
})
// route to run the code written by the user in the compiler window 
router.post('/run', async (req, res) => {
    const { lang="cpp", code, user_input} = req.body;
    console.log(code);
    if(code === undefined){
        return res.json({message: "Empty code body"});
    }

    try {
        // we need to generate the file from the request 
        const filePath = await generateFile(lang, code);
        var output;
        // select the language
        if(lang == 'cpp'){
            output = await executeCpp(filePath,user_input);
        }
        if(lang == 'python'){
            output = await executePython(filePath, user_input);
        }
    
    return res.json({filePath, output});

    } catch(err){
        return res.json({message: err.message})
    }
})
module.exports = router;