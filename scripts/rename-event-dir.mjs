import fs from 'node:fs';
import path from 'node:path';

const oldPath = 'c:\\Users\\USER\\Documents\\MyProjects\\NextApp\\nurture-nova-learning\\app\\(website)\\events\\[id]';
const newPath = 'c:\\Users\\USER\\Documents\\MyProjects\\NextApp\\nurture-nova-learning\\app\\(website)\\events\\[slug]';

try {
    if (fs.existsSync(oldPath)) {
        fs.renameSync(oldPath, newPath);
        console.log(`Renamed ${oldPath} to ${newPath}`);
    } else {
        console.log(`Path not found: ${oldPath}`);
    }
} catch (err) {
    console.error('Error renaming directory:', err);
}
