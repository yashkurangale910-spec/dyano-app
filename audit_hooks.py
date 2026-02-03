import os
import re

def check_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check for usage of Hooks
    hooks = ['useEffect', 'useState', 'useRef', 'useCallback', 'useMemo', 'useContext']
    
    missing = []
    
    for hook in hooks:
        # distinct hook usage not as property (e.g. React.useEffect is fine, but useEffect() needs import)
        # simplistic regex: look for hook name followed by (
        if re.search(r'\b' + hook + r'\(', content):
            # Check if imported
            # Look for import .* { .* hook .* } from 'react'
            # or import .* { .* hook .* } from "react"
            if not re.search(r'import\s+.*\{[^}]*\b' + hook + r'\b[^}]*\}\s+from\s+[\'"]react[\'"]', content):
                 # Also check namespace import import * as React from 'react' (less common for hooks usage directly)
                 if not re.search(r'import\s+\*\s+as\s+React\s+from', content):
                     missing.append(hook)

    if missing:
        with open('audit_results.txt', 'a') as log:
            log.write(f"File: {filepath} Missing: {', '.join(missing)}\n")

def main():
    start_dir = r"d:\Games\Implementation\frontend\src"
    for root, dirs, files in os.walk(start_dir):
        for file in files:
            if file.endswith('.jsx') or file.endswith('.js'):
                check_file(os.path.join(root, file))

if __name__ == "__main__":
    main()
