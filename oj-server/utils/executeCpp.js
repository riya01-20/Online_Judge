const { exec, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const {v4: uuid} = require('uuid');

const outputPath = path.join(__dirname, 'output');//give the directory path of output folder

//if dirCodes doesn't exists then make a directory name output
if(!fs.existsSync(outputPath)){
    fs.mkdirSync(outputPath, {recursive: true});
}

const executeCpp = (filepath, user_input, timeoutMillis = 3000) => {
    const jobId = 'temp';
    const outPath = path.join(outputPath, `${jobId}.exe`);
    const inputFilePath = path.join(outputPath, 'input.txt');
  
    fs.writeFileSync(inputFilePath, user_input);
  
    return new Promise((resolve, reject) => {
      if (fs.existsSync(outPath)) {
        fs.unlinkSync(outPath);
      }
  
      const compileCommand = `g++ ${filepath} -o ${outPath}`;
      const executeCommand = `${outPath} < ${inputFilePath}`;
  
      exec(compileCommand, (err, stdout, stderr) => {//compile the code and if error then reject else execute
        if (err) {
          reject(err);
        } else {
          exec(executeCommand, (err, stdout, stderr) => {//after successful compilation execute the code  
            if (err) {
              if (err.code === 124) {
                console.log(err.message); 
                reject(new Error('Compilation timed out.'));
              } else {
                console.log(err.message);
                reject(err);
              }
            } else {
              resolve(stdout);
            }
          });
        }
      });
    });
  };

const executePython = (filepath) => {
    const jobId = path.basename(filepath).split(".")[0];
    const pythonProcess = spawn('python', [filepath]);

    let stdoutData = '';
    let stderrData = '';

    pythonProcess.stdout.on('data', (data) => {
        stdoutData += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
        stderrData += data.toString();
    })

    return new Promise((resolve, reject) => {
        pythonProcess.on('error', (err) => {
            reject(err);
        })

        pythonProcess.on('close', (code) => {
            if(code != 0){
                reject(new Error(`Python process exited with code ${code}`));
            }
            else{
                resolve(stdoutData);
            }
        })
    })
}

module.exports = {
    executeCpp, executePython
}