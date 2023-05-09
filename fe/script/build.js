const fs = require('fs');
const path = require('path');

const buildFileDir = path.resolve(__dirname,'../build');
const renameFileNodejsDir = path.resolve(__dirname,'../../nodejs/fe');
const renameFileJavaDir = path.resolve(__dirname,'../../java/application/src/main/resources/fe');

function main(){
   if(!process.argv[2]){
    console.log('please input args');
    return
   }
   if(process.argv[2] === 'nodejs'){
      if(!fs.existsSync(renameFileNodejsDir)){
        fs.mkdirSync(renameFileNodejsDir);
      } else{
        fs.rmdirSync(renameFileNodejsDir,{recursive: true, force: true});
        fs.mkdirSync(renameFileNodejsDir);
      }
      if(fs.existsSync(buildFileDir)){
        fs.renameSync(buildFileDir,renameFileNodejsDir+'/build')
      }
   }
   if(process.argv[2] === 'java'){
    if(!fs.existsSync(renameFileJavaDir)){
      fs.mkdirSync(renameFileJavaDir);
    } else{
      fs.rmdirSync(renameFileJavaDir,{recursive: true, force: true});
      fs.mkdirSync(renameFileJavaDir);
    }
    if(fs.existsSync(buildFileDir)){
      fs.renameSync(buildFileDir,renameFileJavaDir+'/build')
    }
 }
}

main();