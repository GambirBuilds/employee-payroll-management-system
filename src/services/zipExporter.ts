import JSZip from 'jszip';
import { JAVA_PROJECT_FILES } from '../data/javaSourceFiles';

export async function generateProjectZip(): Promise<Blob> {
  const zip = new JSZip();

  // Root files
  zip.file('.gitignore', `# Maven
target/
*.class

# Log files
*.log

# Database files
*.db
*.db-journal
*.sqlite

# IDE files
.idea/
*.iml
.vscode/
.settings/
.project
.classpath

# Environment and sensitive keys
.env
src/main/resources/db.properties
`);

  // Add all files from repository
  for (const file of JAVA_PROJECT_FILES) {
    zip.file(file.path, file.content);
  }

  return await zip.generateAsync({ type: 'blob' });
}

export function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
