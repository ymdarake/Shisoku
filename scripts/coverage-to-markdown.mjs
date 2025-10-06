import fs from 'node:fs';
import path from 'node:path';

const workspace = process.env.GITHUB_WORKSPACE || process.cwd();
const lcovPath = path.join(workspace, 'coverage', 'lcov.info');
const outputPath = path.join(workspace, 'code-coverage-results.md');


function parseLcov(lcovContent) {
    const files = [];
    let current = null;

    for (const rawLine of lcovContent.split(/\r?\n/)) {
        const line = rawLine.trim();
        if (!line) continue;
        if (line.startsWith('SF:')) {
            current = { file: line.slice(3), linesFound: 0, linesHit: 0 };
        } else if (line.startsWith('LF:') && current) {
            current.linesFound = Number(line.slice(3)) || 0;
        } else if (line.startsWith('LH:') && current) {
            current.linesHit = Number(line.slice(3)) || 0;
        } else if (line === 'end_of_record' && current) {
            files.push(current);
            current = null;
        }
    }
    return files;
}

function toPercent(hit, found) {
    if (!found) return 100;
    return Math.round((hit / found) * 10000) / 100; // 2 decimals
}

function generateMarkdown(files) {
    let totalFound = 0;
    let totalHit = 0;

    const rows = files
        .sort((a, b) => a.file.localeCompare(b.file))
        .map(({ file, linesFound, linesHit }) => {
            totalFound += linesFound;
            totalHit += linesHit;
            const pct = toPercent(linesHit, linesFound).toFixed(2) + '%';
            const rel = file.replace(process.cwd() + path.sep, '');
            return `| ${rel} | ${linesHit}/${linesFound} | ${pct} |`;
        });

    const totalPct = toPercent(totalHit, totalFound).toFixed(2) + '%';

    const md = [
        '<!-- coverage-report -->',
        `## Coverage Summary`,
        '',
        `- Total: ${totalHit}/${totalFound} (${totalPct})`,
        '',
        '| File | Lines (Hit/Found) | % |',
        '|---|---:|---:|',
        ...rows,
        '',
    ].join('\n');
    return md;
}

function main() {
    if (!fs.existsSync(lcovPath)) {
        console.error(`lcov not found at ${lcovPath}`);
        process.exit(1);
    }
    const content = fs.readFileSync(lcovPath, 'utf8');
    const files = parseLcov(content);
    const md = generateMarkdown(files);
    fs.writeFileSync(outputPath, md, 'utf8');
    console.log(`Wrote ${outputPath}`);
}

main();


