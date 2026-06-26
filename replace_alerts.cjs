const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function findJsxTsxFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            findJsxTsxFiles(filePath, fileList);
        } else if (filePath.match(/\.(jsx|tsx|js|ts)$/)) {
            fileList.push(filePath);
        }
    }

    return fileList;
}

const files = findJsxTsxFiles(srcDir);
let changedFilesCount = 0;

for (const filePath of files) {
    let content = fs.readFileSync(filePath, 'utf-8');

    // Simple check if file has alert
    if (content.includes('alert(')) {
        // Replace alert('...') with toast.error('...') if it contains error keywords, else toast.success
        // We use a regex to match alert(something)
        
        // Wait, standard regex replace might be tricky with nested quotes.
        // Let's do a simple replace first:
        // alert( -> toast(
        // We also want to classify them, but a generic toast() is also fine if we can't.
        // Actually, let's use a function replacer:
        
        let modifiedContent = content.replace(/alert\((.*?)\)/g, (match, p1) => {
            const lowerContent = p1.toLowerCase();
            if (lowerContent.includes('erreur') || lowerContent.includes('error') || lowerContent.includes('échoué') || lowerContent.includes('introuvable') || lowerContent.includes('refusé') || lowerContent.includes('veuillez') || lowerContent.includes('requis') || lowerContent.includes('impossible')) {
                return `toast.error(${p1})`;
            } else if (lowerContent.includes('succès') || lowerContent.includes('success') || lowerContent.includes('envoyée') || lowerContent.includes('créé') || lowerContent.includes('supprimé') || lowerContent.includes('approuvé') || lowerContent.includes('publié')) {
                return `toast.success(${p1})`;
            } else {
                return `toast(${p1})`; // generic default
            }
        });

        // If content was modified, we need to add the import if it's not there
        if (modifiedContent !== content) {
            if (!modifiedContent.includes('import toast')) {
                // Find last import
                const importRegex = /^import\s+.*?;?\s*$/gm;
                let lastImportIndex = 0;
                let match;
                while ((match = importRegex.exec(modifiedContent)) !== null) {
                    lastImportIndex = importRegex.lastIndex;
                }
                
                const importStatement = "\nimport toast from 'react-hot-toast';\n";
                if (lastImportIndex > 0) {
                    modifiedContent = modifiedContent.slice(0, lastImportIndex) + importStatement + modifiedContent.slice(lastImportIndex);
                } else {
                    modifiedContent = importStatement + modifiedContent;
                }
            }
            
            fs.writeFileSync(filePath, modifiedContent, 'utf-8');
            console.log('Modified:', filePath);
            changedFilesCount++;
        }
    }
}

console.log(`\nFinished! Modified ${changedFilesCount} files.`);
