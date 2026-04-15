const fs = require('fs');
const path = require('path');

function walk(d) {
    let files = [];
    fs.readdirSync(d).forEach(f => {
        const fd = path.join(d, f);
        if (fs.statSync(fd).isDirectory()) files = files.concat(walk(fd));
        else if (fd.endsWith('.tsx')) files.push(fd);
    });
    return files;
};

const dirs = ['./app/payroll-run', './lib/context'];
dirs.forEach(root => {
    if(!fs.existsSync(root)) return;
    const files = walk(root);
    files.forEach(f => {
        let c = fs.readFileSync(f, 'utf8');
        let nc = c.replace(/\.toLocaleString\(\)/g, '.toLocaleString("en-US")');
        if (c !== nc) {
            fs.writeFileSync(f, nc);
            console.log('Updated ' + f);
        }
    });
});
