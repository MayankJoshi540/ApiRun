const { stripTypeScript } = require('./src/utils/challengeRunner.ts');

const userCode = `import express, { Request, Response } from 'express';

const app = express();
app.use(express.json());

app.post('/api/v1/echo', (req: Request, res: Response) => {
  const message = "hello";

  if (!message || typeof message !== 'string' || message.trim() === '') {
    return res.status(400).json({
      error: 'missing_message',
      message: "my name is mayank"
    });
  }

  return res.status(200).json({
    echo: message,
    length: message.length
  });
});

export default app;`;

// Let's test stripping:
function testStrip(code) {
  let cleaned = code;
  cleaned = cleaned.replace(/import\s+(?:(?:(?:\*\s+as\s+\w+|[\w\s{},*]+)\s+from\s+)?['"][^'"]+['"]|['"][^'"]+['"])\s*;?/g, '');
  cleaned = cleaned.replace(/export\s+default\s+[^;]+;?/g, '');
  cleaned = cleaned.replace(/export\s+(const|let|var|function|async\s+function|class)\s+/g, '$1 ');
  cleaned = cleaned.replace(/interface\s+\w+(?:<[^>]*>)?(?:\s+extends\s+[^{]+)?\s*\{[\s\S]*?\n\}/g, '');
  cleaned = cleaned.replace(/interface\s+\w+(?:<[^>]*>)?(?:\s+extends\s+[^{]+)?\s*\{[^\}]*\}/g, '');
  cleaned = cleaned.replace(/type\s+\w+(?:<[^>]*>)?\s*=\s*[^;]+;/g, '');
  cleaned = cleaned.replace(/<[A-Za-z0-9_,\s|&<>\[\]]+>(?=\s*[\(\.])/g, '');
  cleaned = cleaned.replace(/\s+as\s+[A-Za-z0-9_<>[\]|&?]+/g, '');
  cleaned = cleaned.replace(/\):\s*[A-Za-z0-9_<>[\]|&?]+\s*(?=[={])/g, ') ');
  cleaned = cleaned.replace(/(\b\w+)\s*:\s*[A-Za-z0-9_<>[\]|&?]+(?=\s*[,)])/g, '$1');
  cleaned = cleaned.replace(/(const|let|var)\s+(\w+)\s*:\s*[A-Za-z0-9_<>[\]|&?]+(?=\s*=)/g, '$1 $2');
  return cleaned;
}

const cleaned = testStrip(userCode);
console.log('CLEANED:\n', cleaned);

try {
  new Function('express', 'crypto', 'console', cleaned);
  console.log('Function compilation: OK');
} catch (e) {
  console.log('Compilation error:', e);
}
