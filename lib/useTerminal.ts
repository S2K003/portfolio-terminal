import { useState, useCallback, useMemo } from 'react';

export type FileNode = {
  name: string;
  type: 'file';
  data: any;
};

export type DirNode = {
  name: string;
  type: 'dir';
  children: Record<string, FileNode | DirNode>;
};

export type TerminalCommand = {
  input: string;
  output: React.ReactNode | string;
  isError?: boolean;
};

// Converts string into a safe slug for filenames
const slugify = (text: string) => {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
};

export function useTerminal(portfolioData: any, setMatrixItem: (item: any) => void) {
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [history, setHistory] = useState<TerminalCommand[]>([{
    input: '',
    output: `
  ____  _   _    _    ____      _  _____ _   _ 
 / ___|| | | |  / \\  |  _ \\    / \\|_   _| | | |
 \\___ \\| |_| | / _ \\ | |_) |  / _ \\ | | | |_| |
  ___) |  _  |/ ___ \\|  _ <  / ___ \\| | |  _  |
 |____/|_| |_/_/   \\_\\_| \\_\\/_/   \\_\\_| |_| |_|
                                               
Welcome to the Secure Terminal. Type "help" for a list of available commands.
`
  }]);

  // Build the virtual file system
  const fileSystem = useMemo<DirNode>(() => {
    const root: DirNode = { name: '~', type: 'dir', children: {} };

    const addSection = (folderName: string, items: any[]) => {
      if (!items || items.length === 0) return;
      const dir: DirNode = { name: folderName, type: 'dir', children: {} };
      items.forEach(item => {
        const fileName = slugify(item.title || item.degree || item.company) + '.txt';
        dir.children[fileName] = { name: fileName, type: 'file', data: item };
      });
      root.children[folderName] = dir;
    };

    addSection('experience', portfolioData.experience);
    addSection('projects', portfolioData.projects);
    addSection('education', portfolioData.education);
    addSection('publications', portfolioData.publications);
    addSection('certifications', portfolioData.certifications);
    addSection('activities', portfolioData.activities);

    // Root info file
    root.children['about_me.txt'] = {
      name: 'about_me.txt',
      type: 'file',
      data: {
        title: 'Sharath S T',
        company: 'Software Engineer',
        body: 'Specializing in high-performance Go backend systems, custom vector databases, and enterprise-scale microservices.'
      }
    };

    return root;
  }, [portfolioData]);

  // Navigate FS helper
  const getDir = (path: string[]): DirNode | null => {
    let curr: any = fileSystem;
    for (const p of path) {
      if (curr.children && curr.children[p] && curr.children[p].type === 'dir') {
        curr = curr.children[p];
      } else {
        return null;
      }
    }
    return curr as DirNode;
  };

  const getFile = (path: string[], fileName: string): FileNode | null => {
    const dir = getDir(path);
    if (dir && dir.children[fileName] && dir.children[fileName].type === 'file') {
      return dir.children[fileName] as FileNode;
    }
    return null;
  };

  const executeCommand = useCallback((cmdString: string) => {
    const args = cmdString.trim().split(' ').filter(Boolean);
    if (args.length === 0) return;

    const command = args[0].toLowerCase();
    let output: any = '';
    let isError = false;

    switch (command) {
      case 'help':
        output = 'Available commands:\nls      - List directory contents\ncd      - Change directory\ncat     - View file contents\nclear   - Clear terminal output\nwhoami  - Print current user\ndate    - Print system date and time\nhelp    - Show this message';
        break;

      case 'echo':
        output = args.slice(1).join(' ');
        break;
        
      case 'whoami':
        output = 'guest_user_992\nPermission level: RESTRICTED';
        break;

      case 'date':
        output = new Date().toString();
        break;

      case 'pwd':
        output = '~' + (currentPath.length > 0 ? '/' + currentPath.join('/') : '');
        break;

      case 'clear':
        setHistory([]);
        return;

      case 'ls':
        const dir = getDir(currentPath);
        if (!dir) {
          output = 'Error: Cannot read directory.';
          isError = true;
        } else {
          const contents = Object.values(dir.children);
          if (contents.length === 0) {
            output = 'Directory is empty.';
          } else {
            output = contents.map(c => ({
              name: c.name,
              type: c.type
            }));
          }
        }
        break;

      case 'cd':
        const target = args[1];
        if (!target || target === '~') {
          setCurrentPath([]);
        } else if (target === '..') {
          setCurrentPath(prev => prev.slice(0, -1));
        } else {
          // Absolute from ~
          let targetPath = target.split('/').filter(Boolean);
          if (target.startsWith('~/')) {
              targetPath = target.substring(2).split('/').filter(Boolean);
              const targetDir = getDir(targetPath);
              if (targetDir) {
                setCurrentPath(targetPath);
              } else {
                output = `cd: no such file or directory: ${target}`;
                isError = true;
              }
          } else {
            // Relative
            const testPath = [...currentPath, ...targetPath];
            const targetDir = getDir(testPath);
            if (targetDir) {
              setCurrentPath(testPath);
            } else {
              output = `cd: no such file or directory: ${target}`;
              isError = true;
            }
          }
        }
        break;

      case 'cat':
        const file = args[1];
        if (!file) {
          output = 'cat: missing file operand';
          isError = true;
        } else {
           // Parse relative or absolute
           let lookupPath = [...currentPath];
           let fileName = file;
           
           if (file.includes('/')) {
              const parts = file.split('/');
              fileName = parts.pop()!;
              if (file.startsWith('~/')) {
                  lookupPath = parts.slice(1);
              } else {
                  lookupPath = [...currentPath, ...parts];
              }
           }

           const targetFile = getFile(lookupPath, fileName);
           if (targetFile) {
             output = `Decrypting ${fileName}...`;
             setMatrixItem(targetFile.data);
           } else {
             const maybeDir = getDir([...lookupPath, fileName]);
             if (maybeDir) {
                output = `cat: ${file}: Is a directory`;
             } else {
                output = `cat: ${file}: No such file or directory`;
             }
             isError = true;
           }
        }
        break;
      
      case 'sudo':
        output = 'Nice try. This incident will be reported.';
        isError = true;
        break;

      default:
        output = `Command not found: ${command}. Type 'help' for a list of commands.`;
        isError = true;
    }

    setHistory(prev => [...prev, { input: cmdString, output, isError }]);
  }, [currentPath, fileSystem, setMatrixItem]);

  return {
    history,
    currentPath: ['~', ...currentPath].join('/'),
    executeCommand
  };
}
