const fs = require('fs');
const path = require('path');
const {v4: uuid} = require('uuid');//used it generate unique id's

const dirCodes = path.join(__dirname, 'codes');//give the directory path of codes folder
//if dirCodes doesn't exists then make a directory name codes
if(!fs.existsSync(dirCodes)){
    fs.mkdirSync(dirCodes, {recursive: True});
}

const generateFile = async(format, content) => {
    const jobID = 'temp';//16ed3c71-bf8d-4256-88c6-83e1cd21efa3
    const fileName = `${jobID}.${format}`;//cpp
    const filePath = path.join(dirCodes, fileName);//filepath = "/home/user/......../cpp"
    await fs.writeFileSync(filePath, content);//write the content in the filepath
    return filePath;
};

module.exports = {
    generateFile,
}