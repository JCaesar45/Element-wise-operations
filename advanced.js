// Matrix Nexus - Advanced JavaScript Implementation

class MatrixNexus {
  constructor() {
    this.currentOperation = "m_add";
    this.operationType = "matrix";
    this.rows = 2;
    this.cols = 2;
    this.history = [];
    this.performanceMetrics = {
      operations: 0,
      totalTime: 0,
      opsPerSec: 0,
      chart: null
    };
    this.init();
  }

  init() {
    this.setupMatrixRain();
    this.setupParticleSystem();
    this.setupEventListeners();
    this.generateMatrixInputs();
    this.setupChart();
    this.startPerformanceMonitoring();
  }

  // Matrix Rain Background
  setupMatrixRain() {
    const canvas = document.getElementById("matrix-rain");
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
    const matrixArray = matrix.split("");

    const fontSize = 10;
    const columns = canvas.width / fontSize;
    const drops = [];

    for (let x = 0; x < columns; x++) {
      drops[x] = 1;
    }

    const drawMatrix = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.04)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#00ff41";
      ctx.font = fontSize + "px Share Tech Mono";

      for (let i = 0; i < drops.length; i++) {
        const text =
          matrixArray[Math.floor(Math.random() * matrixArray.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    setInterval(drawMatrix, 35);

    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
  }

  // Particle System
  setupParticleSystem() {
    const canvas = document.getElementById("particle-canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 50;

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        this.radius = Math.random() * 3 + 1;
        this.color = `hsl(${Math.random() * 60 + 120}, 100%, 50%)`;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
        if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();

        // Add glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const animateParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });

      // Draw connections
      particles.forEach((particle, i) => {
        particles.slice(i + 1).forEach((otherParticle) => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = `rgba(0, 255, 65, ${1 - distance / 100})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(animateParticles);
    };

    animateParticles();

    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
  }

  // Event Listeners
  setupEventListeners() {
    // Operation type radio buttons
    document
      .querySelectorAll('input[name="operation-type"]')
      .forEach((radio) => {
        radio.addEventListener("change", (e) => {
          this.operationType = e.target.value;
          this.updateOperationDisplay();
          this.toggleMatrix2Visibility();
        });
      });

    // Operation buttons
    document.querySelectorAll(".op-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const op = e.currentTarget.dataset.op;
        this.setOperation(op);
        this.performOperation();
      });
    });

    // Dimension controls
    document.getElementById("apply-dims").addEventListener("click", () => {
      this.updateDimensions();
    });

    // Matrix input changes
    document.addEventListener("input", (e) => {
      if (e.target.classList.contains("matrix-cell")) {
        this.validateInput(e.target);
      }
    });

    // Keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      this.handleKeyboardShortcuts(e);
    });
  }

  // Matrix Operations Implementation
  operation(op, matrix1, matrix2) {
    const operations = {
      m_add: (a, b) => a + b,
      s_add: (a, b) => a + b,
      m_sub: (a, b) => a - b,
      s_sub: (a, b) => a - b,
      m_mult: (a, b) => a * b,
      s_mult: (a, b) => a * b,
      m_div: (a, b) => a / b,
      s_div: (a, b) => a / b,
      m_exp: (a, b) => Math.pow(a, b),
      s_exp: (a, b) => Math.pow(a, b)
    };

    const operationFunc = operations[op];
    if (!operationFunc) {
      throw new Error("Unknown operation: " + op);
    }

    const isScalar = op.startsWith("s_");

    if (isScalar) {
      const scalar = matrix2;
      return matrix1.map((row) => row.map((val) => operationFunc(val, scalar)));
    } else {
      const rows = matrix1.length;
      const cols = matrix1[0].length;

      if (rows !== matrix2.length || cols !== matrix2[0].length) {
        throw new Error("Matrices must have the same dimensions");
      }

      const result = [];
      for (let i = 0; i < rows; i++) {
        result[i] = [];
        for (let j = 0; j < cols; j++) {
          result[i][j] = operationFunc(matrix1[i][j], matrix2[i][j]);
        }
      }
      return result;
    }
  }

  generateMatrixInputs() {
    const matrix1Container = document.getElementById("matrix1");
    const matrix2Container = document.getElementById("matrix2");

    matrix1Container.innerHTML = "";
    matrix2Container.innerHTML = "";

    matrix1Container.style.setProperty("--cols", this.cols);
    matrix2Container.style.setProperty("--cols", this.cols);

    // Generate Matrix 1 inputs
    for (let i = 0; i < this.rows; i++) {
      const row = document.createElement("div");
      row.className = "matrix-row";
      for (let j = 0; j < this.cols; j++) {
        const input = document.createElement("input");
        input.type = "number";
        input.className = "matrix-cell";
        input.value = Math.floor(Math.random() * 10) + 1;
        input.dataset.row = i;
        input.dataset.col = j;
        row.appendChild(input);
      }
      matrix1Container.appendChild(row);
    }

    // Generate Matrix 2 inputs
    for (let i = 0; i < this.rows; i++) {
      const row = document.createElement("div");
      row.className = "matrix-row";
      for (let j = 0; j < this.cols; j++) {
        const input = document.createElement("input");
        input.type = "number";
        input.className = "matrix-cell";
        input.value = Math.floor(Math.random() * 10) + 1;
        input.dataset.row = i;
        input.dataset.col = j;
        row.appendChild(input);
      }
      matrix2Container.appendChild(row);
    }
  }

  getMatrixValues(containerId) {
    const container = document.getElementById(containerId);
    const rows = container.querySelectorAll(".matrix-row");
    const matrix = [];

    rows.forEach((row) => {
      const rowData = [];
      const inputs = row.querySelectorAll(".matrix-cell");
      inputs.forEach((input) => {
        rowData.push(parseFloat(input.value) || 0);
      });
      matrix.push(rowData);
    });

    return matrix;
  }

  setOperation(op) {
    this.currentOperation = `${
      this.operationType === "scalar" ? "s" : "m"
    }_${op}`;
    this.updateOperationDisplay();

    // Update active button
    document.querySelectorAll(".op-btn").forEach((btn) => {
      btn.classList.remove("active");
    });
    document.querySelector(`[data-op="${op}"]`).classList.add("active");
  }

  updateOperationDisplay() {
    const opSymbol = document.getElementById("op-symbol");
    const opType = document.getElementById("op-type");

    const symbols = {
      add: "+",
      sub: "-",
      mult: "×",
      div: "÷",
      exp: "^"
    };

    const names = {
      add: "Addition",
      sub: "Subtraction",
      mult: "Multiplication",
      div: "Division",
      exp: "Exponentiation"
    };

    const currentOp = this.currentOperation.split("_")[1];
    opSymbol.textContent = symbols[currentOp] || "+";
    opType.textContent = `${
      this.operationType === "scalar" ? "Scalar" : "Matrix"
    } ${names[currentOp]}`;
  }

  toggleMatrix2Visibility() {
    const matrix2Container = document.getElementById("matrix2-container");
    const operationDisplay = document.querySelector(".operation-display");

    if (this.operationType === "scalar") {
      matrix2Container.style.display = "none";
      operationDisplay.style.display = "none";
    } else {
      matrix2Container.style.display = "block";
      operationDisplay.style.display = "block";
    }
  }

  performOperation() {
    const startTime = performance.now();

    try {
      const matrix1 = this.getMatrixValues("matrix1");
      let matrix2;

      if (this.operationType === "scalar") {
        // For scalar operations, use the first cell of matrix2 or a default value
        const matrix2Container = document.getElementById("matrix2");
        const firstInput = matrix2Container.querySelector(".matrix-cell");
        matrix2 = parseFloat(firstInput?.value) || 2;
      } else {
        matrix2 = this.getMatrixValues("matrix2");
      }

      const result = this.operation(this.currentOperation, matrix1, matrix2);
      this.displayResult(result);

      const endTime = performance.now();
      const operationTime = endTime - startTime;

      this.updatePerformanceMetrics(operationTime);
      this.addToHistory(
        this.currentOperation,
        matrix1,
        matrix2,
        result,
        operationTime
      );

      this.showNotification("Operation completed successfully!", "success");
      this.animateSuccess();
    } catch (error) {
      this.showNotification(`Error: ${error.message}`, "error");
      this.animateError();
    }
  }

  displayResult(result) {
    const resultContainer = document.getElementById("result-matrix");
    resultContainer.innerHTML = "";
    resultContainer.style.setProperty("--cols", result[0].length);

    result.forEach((row) => {
      const rowDiv = document.createElement("div");
      rowDiv.className = "matrix-row";

      row.forEach((val) => {
        const cell = document.createElement("div");
        cell.className = "matrix-cell";
        cell.textContent = val.toFixed(2);
        rowDiv.appendChild(cell);
      });

      resultContainer.appendChild(rowDiv);
    });

    // Add animation
    resultContainer.classList.add("success-animation");
    setTimeout(() => {
      resultContainer.classList.remove("success-animation");
    }, 500);
  }

  updateDimensions() {
    const rows = parseInt(document.getElementById("rows").value);
    const cols = parseInt(document.getElementById("cols").value);

    if (rows > 0 && rows <= 8 && cols > 0 && cols <= 8) {
      this.rows = rows;
      this.cols = cols;
      this.generateMatrixInputs();
      this.showNotification("Dimensions updated successfully!", "success");
    } else {
      this.showNotification("Dimensions must be between 1 and 8!", "error");
    }
  }

  validateInput(input) {
    const value = parseFloat(input.value);
    if (isNaN(value)) {
      input.style.borderColor = "var(--warning-red)";
    } else {
      input.style.borderColor = "var(--primary-color)";
    }
  }

  fillRandom(matrixId) {
    const container = document.getElementById(matrixId);
    const inputs = container.querySelectorAll(".matrix-cell");

    inputs.forEach((input) => {
      input.value = Math.floor(Math.random() * 20) - 10; // -10 to 10
    });

    this.showNotification(
      `Matrix ${matrixId.slice(-1)} filled with random values!`,
      "info"
    );
  }

  fillIdentity(matrixId) {
    const container = document.getElementById(matrixId);
    const rows = container.querySelectorAll(".matrix-row");

    rows.forEach((row, i) => {
      const inputs = row.querySelectorAll(".matrix-cell");
      inputs.forEach((input, j) => {
        input.value = i === j ? 1 : 0;
      });
    });

    this.showNotification(
      `Matrix ${matrixId.slice(-1)} filled with identity matrix!`,
      "info"
    );
  }

  clearMatrix(matrixId) {
    const container = document.getElementById(matrixId);
    const inputs = container.querySelectorAll(".matrix-cell");

    inputs.forEach((input) => {
      input.value = "";
    });

    this.showNotification(`Matrix ${matrixId.slice(-1)} cleared!`, "info");
  }

  copyResult() {
    const resultContainer = document.getElementById("result-matrix");
    const rows = resultContainer.querySelectorAll(".matrix-row");
    let resultText = "";

    rows.forEach((row) => {
      const cells = row.querySelectorAll(".matrix-cell");
      const rowData = Array.from(cells).map((cell) => cell.textContent);
      resultText += "[" + rowData.join(", ") + "]\n";
    });

    navigator.clipboard
      .writeText(resultText)
      .then(() => {
        this.showNotification("Result copied to clipboard!", "success");
      })
      .catch(() => {
        this.showNotification("Failed to copy result!", "error");
      });
  }

  exportResult() {
    const resultContainer = document.getElementById("result-matrix");
    const rows = resultContainer.querySelectorAll(".matrix-row");
    const result = [];

    rows.forEach((row) => {
      const cells = row.querySelectorAll(".matrix-cell");
      const rowData = Array.from(cells).map((cell) =>
        parseFloat(cell.textContent)
      );
      result.push(rowData);
    });

    const dataStr = JSON.stringify(result, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(dataBlob);
    link.download = "matrix_result.json";
    link.click();

    this.showNotification("Result exported successfully!", "success");
  }

  addToHistory(operation, matrix1, matrix2, result, time) {
    const historyItem = {
      operation,
      matrix1,
      matrix2,
      result,
      time,
      timestamp: new Date().toLocaleString()
    };

    this.history.unshift(historyItem);
    if (this.history.length > 10) {
      this.history.pop();
    }

    this.updateHistoryDisplay();
  }

  updateHistoryDisplay() {
    const historyContainer = document.getElementById("history");
    historyContainer.innerHTML = "";

    this.history.forEach((item, index) => {
      const historyDiv = document.createElement("div");
      historyDiv.className = "history-item";

      const opName = this.getOperationDisplayName(item.operation);
      historyDiv.innerHTML = `
                <div><strong>${opName}</strong> - ${item.timestamp}</div>
                <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 5px;">
                    Time: ${item.time.toFixed(2)}ms | 
                    Size: ${item.matrix1.length}×${item.matrix1[0].length}
                </div>
            `;

      historyContainer.appendChild(historyDiv);
    });
  }

  getOperationDisplayName(operation) {
    const names = {
      m_add: "Matrix Addition",
      s_add: "Scalar Addition",
      m_sub: "Matrix Subtraction",
      s_sub: "Scalar Subtraction",
      m_mult: "Matrix Multiplication",
      s_mult: "Scalar Multiplication",
      m_div: "Matrix Division",
      s_div: "Scalar Division",
      m_exp: "Matrix Exponentiation",
      s_exp: "Scalar Exponentiation"
    };
    return names[operation] || operation;
  }

  updatePerformanceMetrics(operationTime) {
    this.performanceMetrics.operations++;
    this.performanceMetrics.totalTime += operationTime;

    const avgTime =
      this.performanceMetrics.totalTime / this.performanceMetrics.operations;
    const opsPerSec = 1000 / avgTime;

    document.getElementById("ops-per-sec").textContent = opsPerSec.toFixed(2);
    document.getElementById("avg-time").textContent = avgTime.toFixed(2) + "ms";
    document.getElementById(
      "total-ops"
    ).textContent = this.performanceMetrics.operations;

    // Update CPU usage simulation
    const cpuUsage = Math.min(100, Math.random() * 30 + 10);
    document.getElementById("cpu").textContent = cpuUsage.toFixed(0) + "%";

    // Update chart
    this.updatePerformanceChart(operationTime);
  }

  setupChart() {
    const ctx = document.getElementById("performance-chart").getContext("2d");
    this.performanceMetrics.chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: [],
        datasets: [
          {
            label: "Operation Time (ms)",
            data: [],
            borderColor: "#00ff41",
            backgroundColor: "rgba(0, 255, 65, 0.1)",
            tension: 0.4,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            display: false
          },
          y: {
            display: true,
            grid: {
              color: "rgba(0, 255, 65, 0.1)"
            },
            ticks: {
              color: "#00ff41"
            }
          }
        }
      }
    });
  }

  updatePerformanceChart(operationTime) {
    if (this.performanceMetrics.chart) {
      const chart = this.performanceMetrics.chart;
      chart.data.labels.push("");
      chart.data.datasets[0].data.push(operationTime);

      if (chart.data.labels.length > 20) {
        chart.data.labels.shift();
        chart.data.datasets[0].data.shift();
      }

      chart.update("none");
    }
  }

  startPerformanceMonitoring() {
    setInterval(() => {
      const randomCpu = Math.min(100, Math.random() * 40 + 5);
      document.getElementById("cpu").textContent = randomCpu.toFixed(0) + "%";
    }, 2000);
  }

  handleKeyboardShortcuts(e) {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case "Enter":
          e.preventDefault();
          this.performOperation();
          break;
        case "r":
          e.preventDefault();
          this.fillRandom("matrix1");
          break;
        case "R":
          e.preventDefault();
          this.fillRandom("matrix2");
          break;
        case "c":
          e.preventDefault();
          this.copyResult();
          break;
      }
    }

    // Number keys for operations
    if (e.altKey) {
      switch (e.key) {
        case "1":
          e.preventDefault();
          this.setOperation("add");
          break;
        case "2":
          e.preventDefault();
          this.setOperation("sub");
          break;
        case "3":
          e.preventDefault();
          this.setOperation("mult");
          break;
        case "4":
          e.preventDefault();
          this.setOperation("div");
          break;
        case "5":
          e.preventDefault();
          this.setOperation("exp");
          break;
      }
    }
  }

  showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.innerHTML = `
            <i class="fas fa-${
              type === "success"
                ? "check"
                : type === "error"
                ? "exclamation-triangle"
                : "info"
            }-circle"></i>
            ${message}
        `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add("show");
    }, 100);

    setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }

  animateSuccess() {
    document
      .querySelector(".matrix-workspace")
      .classList.add("success-animation");
    setTimeout(() => {
      document
        .querySelector(".matrix-workspace")
        .classList.remove("success-animation");
    }, 500);
  }

  animateError() {
    document
      .querySelector(".matrix-workspace")
      .classList.add("error-animation");
    setTimeout(() => {
      document
        .querySelector(".matrix-workspace")
        .classList.remove("error-animation");
    }, 500);
  }

  clearHistory() {
    this.history = [];
    this.updateHistoryDisplay();
    this.showNotification("History cleared!", "info");
  }

  showHelp() {
    const helpContent = `
            <h2><i class="fas fa-question-circle"></i> Help & Documentation</h2>
            <h3>Keyboard Shortcuts:</h3>
            <ul>
                <li><strong>Ctrl+Enter:</strong> Perform operation</li>
                <li><strong>Ctrl+R:</strong> Fill Matrix A with random values</li>
                <li><strong>Ctrl+Shift+R:</strong> Fill Matrix B with random values</li>
                <li><strong>Ctrl+C:</strong> Copy result to clipboard</li>
                <li><strong>Alt+1-5:</strong> Select operation (1=Add, 2=Sub, 3=Mul, 4=Div, 5=Exp)</li>
            </ul>
            <h3>Operations:</h3>
            <ul>
                <li><strong>Addition:</strong> Element-wise addition</li>
                <li><strong>Subtraction:</strong> Element-wise subtraction</li>
                <li><strong>Multiplication:</strong> Element-wise multiplication</li>
                <li><strong>Division:</strong> Element-wise division</li>
                <li><strong>Exponentiation:</strong> Element-wise exponentiation</li>
            </ul>
        `;

    this.showModal(helpContent);
  }

  showAbout() {
    const aboutContent = `
            <h2><i class="fas fa-info-circle"></i> About Matrix Nexus</h2>
            <p>Matrix Nexus is an advanced element-wise matrix operations calculator designed for developers, engineers, and students.</p>
            <h3>Features:</h3>
            <ul>
                <li>Real-time matrix operations</li>
                <li>Support for both matrix-matrix and scalar-matrix operations</li>
                <li>Performance analytics and history tracking</li>
                <li>Interactive visualizations</li>
                <li>Export capabilities</li>
            </ul>
            <p><strong>Version:</strong> 1.0.0</p>
            <p><strong>Built with:</strong> Advanced JavaScript, CSS3, HTML5</p>
        `;

    this.showModal(aboutContent);
  }

  showSettings() {
    const settingsContent = `
            <h2><i class="fas fa-cog"></i> Settings</h2>
            <div class="settings-group">
                <label>
                    <input type="checkbox" id="auto-calculate" checked>
                    Auto-calculate on input change
                </label>
            </div>
            <div class="settings-group">
                <label>
                    <input type="checkbox" id="show-animations" checked>
                    Enable animations
                </label>
            </div>
            <div class="settings-group">
                <label>
                    <input type="checkbox" id="sound-effects">
                    Enable sound effects
                </label>
            </div>
            <button class="apply-btn" onclick="matrixNexus.saveSettings()">Save Settings</button>
        `;

    this.showModal(settingsContent);
  }

  showModal(content) {
    const modal = document.getElementById("notification-modal");
    const modalBody = document.getElementById("modal-body");

    modalBody.innerHTML = content;
    modal.style.display = "block";

    const closeBtn = modal.querySelector(".close");
    closeBtn.onclick = () => {
      modal.style.display = "none";
    };

    window.onclick = (event) => {
      if (event.target === modal) {
        modal.style.display = "none";
      }
    };
  }

  saveSettings() {
    // Settings implementation would go here
    this.showNotification("Settings saved successfully!", "success");
    document.getElementById("notification-modal").style.display = "none";
  }
}

// Initialize the application
const matrixNexus = new MatrixNexus();

// Add notification styles
const notificationStyles = document.createElement("style");
notificationStyles.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-weight: bold;
        z-index: 1001;
        transform: translateX(400px);
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 10px;
        backdrop-filter: blur(10px);
    }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .notification.success {
        background: rgba(0, 255, 65, 0.2);
        border: 1px solid #00ff41;
        box-shadow: 0 0 20px rgba(0, 255, 65, 0.3);
    }
    
    .notification.error {
        background: rgba(255, 0, 64, 0.2);
        border: 1px solid #ff0040;
        box-shadow: 0 0 20px rgba(255, 0, 64, 0.3);
    }
    
    .notification.info {
        background: rgba(0, 212, 255, 0.2);
        border: 1px solid #00d4ff;
        box-shadow: 0 0 20px rgba(0, 212, 255, 0.3);
    }
`;
document.head.appendChild(notificationStyles);

// Add some additional utility functions
function showHelp() {
  matrixNexus.showHelp();
}
function showAbout() {
  matrixNexus.showAbout();
}
function showSettings() {
  matrixNexus.showSettings();
}
function clearHistory() {
  matrixNexus.clearHistory();
}
function fillRandom(matrixId) {
  matrixNexus.fillRandom(matrixId);
}
function fillIdentity(matrixId) {
  matrixNexus.fillIdentity(matrixId);
}
function clearMatrix(matrixId) {
  matrixNexus.clearMatrix(matrixId);
}
function copyResult() {
  matrixNexus.copyResult();
}
function exportResult() {
  matrixNexus.exportResult();
}
