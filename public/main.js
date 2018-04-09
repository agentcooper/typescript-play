// whoa, no typescript and no compilation!

const compilerOptions = {
  noImplicitAny: true,
  strictNullChecks: true,
  strictFunctionTypes: true,
  strictPropertyInitialization: true,
  noImplicitThis: true,
  noImplicitReturns: true,

  alwaysStrict: true,
  allowUnreachableCode: false,
  allowUnusedLabels: false,

  downlevelIteration: false,
  noEmitHelpers: false,
  noLib: false,
  noStrictGenericChecks: false,
  esModuleInterop: false,

  noUnusedLocals: false,
  noUnusedParameters: false,
  preserveConstEnums: false,
  removeComments: false,
  skipLibCheck: false,
};

const sharedEditorOptions = {
  minimap: { enabled: false },
  automaticLayout: true,
  scrollBeyondLastLine: false,
};

const State = {
  inputModel: null,
  outputModel: null,
};

const UI = {
  tooltips: {},

  shouldUpdateHash: false,

  fetchTooltips: async function() {
    try {
      const res = await fetch(`${window.CONFIG.baseUrl}schema/tsconfig.json`);
      const json = await res.json();

      for (const [propertyName, property] of Object.entries(
        json.definitions.compilerOptionsDefinition.properties.compilerOptions
          .properties,
      )) {
        this.tooltips[propertyName] = property.description;
      }
    } catch (e) {
      console.error(e);
      // not critical
    }
  },

  renderAvailableVersions() {
    const node = document.querySelector("#version-popup");
    const html = `
    <ul>
    ${Object.keys(window.CONFIG.availableTSVersions)
      .sort()
      .reverse()
      .map(version => {
        return `<li class="button" onclick="javascript:UI.selectVersion('${version}');">${version}</li>`;
      })
      .join("\n")}
    </ul>
    `;

    node.innerHTML = html;
  },

  renderVersion() {
    if (!ts.version) {
      return;
    }

    const node = document.querySelector("#version");
    const childNode = node.querySelector("#version-current");

    childNode.textContent = `${ts.version}`;

    node.style.opacity = 1;
    node.classList.toggle("popup-on-hover", true);

    this.hideSpinner();
  },

  hideSpinner() {
    document
      .querySelector(".spinner")
      .classList.toggle("spinner--hidden", true);
  },

  renderSettings() {
    const node = document.querySelector("#settings-popup");

    const html = `
    <ul>
    ${Object.entries(compilerOptions)
      .map(([key, value]) => {
        return `<li style="margin: 0; padding: 0;" title="${UI.tooltips[key] ||
          ""}"><label class="button" style="user-select: none; display: block;"><input class="pointer" onchange="javascript:UI.updateCompileOptions(event.target.name, event.target.checked);" name="${key}" type="checkbox" ${
          value ? "checked" : ""
        }></input>${key}</label></li>`;
      })
      .join("\n")}
    </ul>
    <p style="margin-left: 0.5em; margin-top: 1em;">
      <a href="https://www.typescriptlang.org/docs/handbook/compiler-options.html" target="_blank">
        Compiler options reference
      </a>
    </p>
    `;

    node.innerHTML = html;
  },

  console() {
    console.log(`Using TypeScript ${window.ts.version}`);

    console.log("Available globals:");
    console.log("\twindow.ts", window.ts);
    console.log("\twindow.client", window.client);
  },

  selectVersion(version) {
    if (version === window.CONFIG.getLatestVersion()) {
      location.href = `${window.CONFIG.baseUrl}${location.hash}`;
      return false;
    }

    location.href = `${window.CONFIG.baseUrl}?ts=${version}${location.hash}`;
    return false;
  },

  selectExample: async function(exampleName) {
    try {
      const res = await fetch(
        `${window.CONFIG.baseUrl}examples/${exampleName}.ts`,
      );
      const code = await res.text();
      UI.shouldUpdateHash = false;
      State.inputModel.setValue(code);
      location.hash = `example/${exampleName}`;
      UI.shouldUpdateHash = true;
    } catch (e) {
      console.log(e);
    }
  },

  setCodeFromHash: async function() {
    if (location.hash.startsWith("#example")) {
      const exampleName = location.hash.replace("#example/", "").trim();
      UI.selectExample(exampleName);
    }
  },

  updateCompileOptions(name, value) {
    console.log(`${name} = ${value}`);

    Object.assign(compilerOptions, {
      [name]: value,
    });

    console.log("Updaring compiler options to", compilerOptions);
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions(
      compilerOptions,
    );

    UI.renderSettings();
  },

  getInitialCode() {
    if (location.hash.startsWith("#code")) {
      const code = location.hash.replace("#code/", "").trim();
      return LZString.decompressFromEncodedURIComponent(code);
    }

    return `
const message: string = 'hello world';
console.log(message);
  `.trim();
  },
};

async function main() {
  window.MonacoEnvironment = {
    getWorkerUrl: function(workerId, label) {
      return `worker.js?version=${window.CONFIG.getMonacoVersion()}`;
    },
  };

  monaco.languages.typescript.typescriptDefaults.setCompilerOptions(
    compilerOptions,
  );

  State.inputModel = monaco.editor.createModel(
    UI.getInitialCode(),
    "typescript",
    monaco.Uri.parse("input.ts"),
  );

  State.outputModel = monaco.editor.createModel(
    "",
    "javascript",
    monaco.Uri.parse("output.js"),
  );

  const inputEditor = monaco.editor.create(
    document.getElementById("input"),
    Object.assign({ model: State.inputModel }, sharedEditorOptions),
  );

  const outputEditor = monaco.editor.create(
    document.getElementById("output"),
    Object.assign({ model: State.outputModel }, sharedEditorOptions),
  );

  function updateHash() {
    location.hash = `code/${LZString.compressToEncodedURIComponent(
      State.inputModel.getValue(),
    )}`;
  }

  function updateOutput() {
    monaco.languages.typescript.getTypeScriptWorker().then(worker => {
      worker(State.inputModel.uri).then((client, a) => {
        if (typeof window.client === "undefined") {
          UI.renderVersion();

          // expose global
          window.client = client;
          UI.console();
        }

        client.getEmitOutput(State.inputModel.uri.toString()).then(result => {
          State.outputModel.setValue(result.outputFiles[0].text);
        });
      });
    });

    if (UI.shouldUpdateHash) {
      updateHash();
    }
  }

  UI.setCodeFromHash();

  UI.renderSettings();
  UI.fetchTooltips().then(() => {
    UI.renderSettings();
  });

  updateOutput();
  State.inputModel.onDidChangeContent(() => {
    updateOutput();
  });
  UI.shouldUpdateHash = true;

  UI.renderAvailableVersions();
}
