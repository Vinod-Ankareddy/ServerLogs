const fs = require('fs');

function writetoFile(filename,...message) {
  const file = './' + filename;
  fs.appendFile(file,  '\n' + message , function (err) {
    if(err) return console.log("error occured while writing into a file by node server "+err);
  });
}

function readFile(filename, res) {
  fs.readFile('./' + filename, 'utf8', function read(err, data) {
    if (err) {
      throw err;
    }
    const content = data.toString();  
    res.writeHead(200, {'Content-Type': 'application/json'});
    let removeLastComma = /\,(?=\s*?[\}\]])/g;
    let myData = ('['+ content + ']').replace(removeLastComma, '');
    res.write(myData)
    res.end();
  });
}

function clearAllLogs(filename, res) {
  fs.writeFile(filename, " ", (err) => {
    if(err) console.log(err.message)
    return res.end({success : "logs cleared Successfully", status : 200});
  })
}

module.exports = { writetoFile, readFile, clearAllLogs }