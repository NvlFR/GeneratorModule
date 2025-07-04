let fileInputCount = 1;

function sanitizeFileName(name) {
  return name
    .replace(/[^a-zA-Z0-9.-]/g, "_")
    .replace(/\.{2,}/g, ".")
    .replace(/^\.+|\.+$/g, "");
}

function addFileInput() {
  fileInputCount++;
  const fileInputs = document.getElementById("fileInputs");
  const newRow = document.createElement("div");
  newRow.className = "file-input-row";
  newRow.innerHTML = `
          <input type="text" placeholder="Nama file (contoh: reminderController.js)" required pattern="[A-Za-z0-9]+(\.[A-Za-z]+)?" title="Hanya huruf, angka, dan ekstensi file yang valid">
          <button type="button" class="btn-remove" onclick="removeFileInput(this)">Hapus</button>
        `;
  fileInputs.appendChild(newRow);
  updatePreview();
}

function removeFileInput(button) {
  if (fileInputCount > 1) {
    button.parentElement.remove();
    fileInputCount--;
    updatePreview();
  }
}

function getFileTemplate(fileName) {
  const name = fileName.toLowerCase();
  const baseName = fileName.replace(/\.(js|jsx|ts|tsx)$/, "");
  const camelCase = baseName.replace(/[-_](.)/g, (_, char) =>
    char.toUpperCase()
  );

  if (name.includes("controller")) {
    return `// ${fileName}
export class ${
      camelCase.charAt(0).toUpperCase() + camelCase.slice(1)
    }Controller {
    constructor() {
        // Initialize controller
    }

    async handleRequest(req, res) {
        try {
            // Implement request handling logic
fen            return { message: 'Success' };
        } catch (error) {
            throw new Error(error.message);
        }
    }
}
`;
  } else if (name.includes("service")) {
    return `// ${fileName}
export class ${camelCase.charAt(0).toUpperCase() + camelCase.slice(1)}Service {
    constructor() {
        // Initialize service
    }

    async getData() {
        try {
            // Implement data fetching logic
            return [];
        } catch (error) {
            throw new Error(\`Error fetching data: \${error.message}\`);
        }
    }

    async saveData(data) {
        try {
            // Implement data saving logic
            return data;
        } catch (error) {
            throw new Error(\`Error saving data: \${error.message}\`);
        }
    }
}
`;
  } else if (name.includes("context")) {
    return `// ${fileName}
import { createContext, useContext, useReducer } from 'react';

const ${
      camelCase.charAt(0).toUpperCase() + camelCase.slice(1)
    }Context = createContext();

const initialState = {
    data: [],
    loading: false,
    error: null
};

function ${camelCase}Reducer(state, action) {
    switch (action.type) {
        case 'LOADING':
            return { ...state, loading: true, error: null };
        case 'SUCCESS':
            return { ...state, loading: false, data: action.payload };
        case 'ERROR':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
}

export function ${
      camelCase.charAt(0).toUpperCase() + camelCase.slice(1)
    }Provider({ children }) {
    const [state, dispatch] = useReducer(${camelCase}Reducer, initialState);

    const actions = {
        // Implement actions
    };

    return (
        <${
          camelCase.charAt(0).toUpperCase() + camelCase.slice(1)
        }Context.Provider value={{ state, dispatch, ...actions }}>
            {children}
        </${
          camelCase.charAt(0).toUpperCase() + camelCase.slice(1)
        }Context.Provider>
    );
}
    export function use${
      camelCase.charAt(0).toUpperCase() + camelCase.slice(1)
    }() {
    const context = useContext(${
      camelCase.charAt(0).toUpperCase() + camelCase.slice(1)
    }Context);
    if (!context) {
        throw new Error('use${
          camelCase.charAt(0).toUpperCase() + camelCase.slice(1)
        } must be used within a ${
      camelCase.charAt(0).toUpperCase() + camelCase.slice(1)
    }Provider');
    }
    return context;
}
`;
  } else if (
    name.includes("component") ||
    name.endsWith(".jsx") ||
    name.endsWith(".tsx")
  ) {
    return `// ${fileName}
import React from 'react';

export default function ${
      camelCase.charAt(0).toUpperCase() + camelCase.slice(1)
    }() {
    return (
        <div>
            <h2>${camelCase.charAt(0).toUpperCase() + camelCase.slice(1)}</h2>
            {/* Add component JSX */}
        </div>
    );
}
`;
  } else if (name.includes("utils") || name.includes("helper")) {
    return `// ${fileName}
export const ${camelCase} = {
    formatDate(date) {
        return new Date(date).toLocaleDateString();
    },

    isEmpty(value) {
        return value === null || value === undefined || value === '';
    }
};
`;
  } else if (name.includes("config")) {
    return `// ${fileName}
export const config = {
    apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:3000',
    timeout: 5000
};
`;
  } else if (name.includes("types") || name.includes("interface")) {
    return `// ${fileName}
export interface ${camelCase.charAt(0).toUpperCase() + camelCase.slice(1)} {
    id: string;
    name: string;
}

export type ${
      camelCase.charAt(0).toUpperCase() + camelCase.slice(1)
    }Status = 'active' | 'inactive' | 'pending';
`;
  } else {
    return `// ${fileName}
export default function ${camelCase}() {
    // Add implementation
}
`;
  }
}

function updatePreview() {
  const moduleName = document.getElementById("moduleName").value;
  const submoduleName = document.getElementById("submoduleName").value;
  const fileInputs = document.querySelectorAll("#fileInputs input");

  if (!moduleName || !submoduleName) {
    document.getElementById("preview").style.display = "none";
    return;
  }

  let preview = `<span class="folder">${sanitizeFileName(
    moduleName
  )}/</span>\n`;
  preview += `├── <span class="folder">${sanitizeFileName(
    submoduleName
  )}/</span>\n`;

  const files = Array.from(fileInputs)
    .map((input) => sanitizeFileName(input.value))
    .filter((v) => v);

  files.forEach((file, index) => {
    const fileName = file.includes(".") ? file : file + ".js";
    const isLast = index === files.length - 1;
    const prefix = isLast ? "└──" : "├──";
    preview += `│   ${prefix} <span class="file">${fileName}</span>\n`;
  });

  document.getElementById("previewTree").innerHTML = preview;
  document.getElementById("preview").style.display = "block";
}

function validateInputs(moduleName, submoduleName, files) {
  if (!moduleName || !/^[A-Za-z0-9]+$/.test(moduleName)) {
    throw new Error("Nama modul hanya boleh berisi huruf dan angka");
  }
  if (!submoduleName || !/^[A-Za-z0-9]+$/.test(submoduleName)) {
    throw new Error("Nama submodul hanya boleh berisi huruf dan angka");
  }
  if (files.length === 0) {
    throw new Error("Minimal harus ada 1 file");
  }
  if (new Set(files).size !== files.length) {
    throw new Error("Nama file tidak boleh duplikat");
  }
  for (const file of files) {
    if (!/^[A-Za-z0-9]+(\.[A-Za-z]+)?$/.test(file)) {
      throw new Error(`Nama file "${file}" tidak valid`);
    }
  }
}

// Update preview on input changes
document.getElementById("moduleName").addEventListener("input", updatePreview);
document
  .getElementById("submoduleName")
  .addEventListener("input", updatePreview);
document.addEventListener("input", function (e) {
  if (e.target.matches("#fileInputs input")) {
    updatePreview();
  }
});

// Handle form submission
const moduleForm = document.getElementById("moduleForm");
moduleForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const generateBtn = document.getElementById("generateBtn");
  const successMessage = document.getElementById("successMessage");
  const errorMessage = document.getElementById("errorMessage");

  // Reset messages
  successMessage.style.display = "none";
  errorMessage.style.display = "none";

  // Show loading state
  generateBtn.disabled = true;
  generateBtn.innerHTML = '<span class="loading"></span>Generating...';

  try {
    // Check if JSZip is loaded
    if (typeof JSZip === "undefined") {
      throw new Error("JSZip library failed to load");
    }

    const moduleName = document.getElementById("moduleName").value.trim();
    const submoduleName = document.getElementById("submoduleName").value.trim();
    const fileInputs = document.querySelectorAll("#fileInputs input");

    const files = Array.from(fileInputs)
      .map((input) => sanitizeFileName(input.value.trim()))
      .filter((v) => v);

    // Validate inputs
    validateInputs(moduleName, submoduleName, files);

    // Create ZIP
    const zip = new JSZip();
    const moduleFolder = zip.folder(sanitizeFileName(moduleName));
    const submoduleFolder = moduleFolder.folder(
      sanitizeFileName(submoduleName)
    );

    // Add files to ZIP
    files.forEach((file) => {
      const fileName = file.includes(".") ? file : file + ".js";
      const fileContent = getFileTemplate(fileName);
      submoduleFolder.file(fileName, fileContent);
    });

    // Generate ZIP
    const content = await zip.generateAsync({
      type: "blob",
      compression: "DEFLATE",
      compressionOptions: {
        level: 6,
      },
    });

    // Create and trigger download
    const url = window.URL.createObjectURL(content);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${sanitizeFileName(moduleName)}-${sanitizeFileName(
      submoduleName
    )}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    // Show success message
    successMessage.innerHTML = `✅ Berhasil! File <strong>${sanitizeFileName(
      moduleName
    )}-${sanitizeFileName(submoduleName)}.zip</strong> telah didownload`;
    successMessage.style.display = "block";
  } catch (error) {
    console.error("Error generating ZIP:", error);
    errorMessage.innerHTML = `❌ Error: ${error.message}`;
    errorMessage.style.display = "block";
  } finally {
    // Reset button state
    generateBtn.disabled = false;
    generateBtn.innerHTML = "🔨 Generate & Download ZIP";
  }
});

// Initialize preview
updatePreview();
