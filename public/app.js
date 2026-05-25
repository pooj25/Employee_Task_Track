const state = {
  employees: [],
  tasks: [],
  dashboard: null
};

const elements = {
  employeeCount: document.querySelector("#employeeCount"),
  taskCount: document.querySelector("#taskCount"),
  pendingCount: document.querySelector("#pendingCount"),
  progressCount: document.querySelector("#progressCount"),
  completedCount: document.querySelector("#completedCount"),
  highPriorityCount: document.querySelector("#highPriorityCount"),
  taskTableBody: document.querySelector("#taskTableBody"),
  employeeCards: document.querySelector("#employeeCards"),
  taskHint: document.querySelector("#taskHint"),
  taskForm: document.querySelector("#taskForm"),
  employeeForm: document.querySelector("#employeeForm"),
  taskId: document.querySelector("#taskId"),
  taskTitle: document.querySelector("#taskTitle"),
  taskDescription: document.querySelector("#taskDescription"),
  taskEmployee: document.querySelector("#taskEmployee"),
  taskPriority: document.querySelector("#taskPriority"),
  taskStatus: document.querySelector("#taskStatus"),
  taskDueDate: document.querySelector("#taskDueDate"),
  employeeId: document.querySelector("#employeeId"),
  employeeName: document.querySelector("#employeeName"),
  employeeEmail: document.querySelector("#employeeEmail"),
  employeeRole: document.querySelector("#employeeRole"),
  employeeDepartment: document.querySelector("#employeeDepartment"),
  statusFilter: document.querySelector("#statusFilter"),
  employeeFilter: document.querySelector("#employeeFilter"),
  toast: document.querySelector("#toast")
};

async function api(path, options = {}) {
  const response = await fetch(path, {
    headers: { "Content-Type": "application/json" },
    ...options
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Something went wrong.");
  }
  return data;
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add("show");
  window.setTimeout(() => elements.toast.classList.remove("show"), 2600);
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderDashboard() {
  const totals = state.dashboard.totals;
  elements.employeeCount.textContent = totals.employees;
  elements.taskCount.textContent = totals.tasks;
  elements.pendingCount.textContent = totals.pending;
  elements.progressCount.textContent = totals.inProgress;
  elements.completedCount.textContent = totals.completed;
  elements.highPriorityCount.textContent = totals.highPriority;
}

function renderEmployeeOptions() {
  const options = state.employees
    .map(employee => `<option value="${employee.id}">${escapeHtml(employee.name)}</option>`)
    .join("");
  elements.taskEmployee.innerHTML = options || '<option value="">Add an employee first</option>';
  elements.employeeFilter.innerHTML = '<option value="">All employees</option>' + options;
}

function renderTasks() {
  const status = elements.statusFilter.value;
  const employeeId = elements.employeeFilter.value;
  const filtered = state.tasks.filter(task => {
    return (!status || task.status === status) && (!employeeId || task.employeeId === employeeId);
  });

  elements.taskHint.textContent = `${filtered.length} task${filtered.length === 1 ? "" : "s"} shown`;

  if (filtered.length === 0) {
    elements.taskTableBody.innerHTML = `
      <tr>
        <td colspan="6">No tasks found for the selected filters.</td>
      </tr>
    `;
    return;
  }

  elements.taskTableBody.innerHTML = filtered.map(task => {
    const employeeName = task.employee ? task.employee.name : "Unassigned";
    return `
      <tr>
        <td>
          <span class="task-title">${escapeHtml(task.title)}</span>
          <span class="task-description">${escapeHtml(task.description || "No description")}</span>
        </td>
        <td>${escapeHtml(employeeName)}</td>
        <td><span class="badge priority-${task.priority}">${task.priority}</span></td>
        <td><span class="badge status-${task.status.replaceAll(" ", "-")}">${task.status}</span></td>
        <td>${escapeHtml(task.dueDate)}</td>
        <td>
          <div class="row-actions">
            <button class="text-button" type="button" data-edit-task="${task.id}">Edit</button>
            <button class="secondary" type="button" data-next-status="${task.id}">Next</button>
            <button class="danger" type="button" data-delete-task="${task.id}">Delete</button>
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

function renderEmployees() {
  if (state.employees.length === 0) {
    elements.employeeCards.innerHTML = "<p>No employees added yet.</p>";
    return;
  }

  elements.employeeCards.innerHTML = state.employees.map(employee => {
    const summary = state.dashboard.employeeSummary.find(item => item.id === employee.id);
    const total = summary ? summary.total : 0;
    const completed = summary ? summary.completed : 0;
    return `
      <article class="employee-card">
        <h3>${escapeHtml(employee.name)}</h3>
        <p>${escapeHtml(employee.role)} · ${escapeHtml(employee.department)}</p>
        <div class="meta">${escapeHtml(employee.email)}</div>
        <div class="meta">${completed} of ${total} tasks completed</div>
        <div class="employee-actions">
          <button class="text-button" type="button" data-edit-employee="${employee.id}">Edit</button>
          <button class="danger" type="button" data-delete-employee="${employee.id}">Delete</button>
        </div>
      </article>
    `;
  }).join("");
}

function clearTaskForm() {
  elements.taskForm.reset();
  elements.taskId.value = "";
  elements.taskPriority.value = "Medium";
  elements.taskStatus.value = "Pending";
  elements.taskDueDate.value = new Date().toISOString().slice(0, 10);
}

function clearEmployeeForm() {
  elements.employeeForm.reset();
  elements.employeeId.value = "";
}

function editTask(id) {
  const task = state.tasks.find(item => item.id === id);
  if (!task) return;
  elements.taskId.value = task.id;
  elements.taskTitle.value = task.title;
  elements.taskDescription.value = task.description || "";
  elements.taskEmployee.value = task.employeeId;
  elements.taskPriority.value = task.priority;
  elements.taskStatus.value = task.status;
  elements.taskDueDate.value = task.dueDate;
  activateTab("taskFormPanel");
  elements.taskTitle.focus();
}

function editEmployee(id) {
  const employee = state.employees.find(item => item.id === id);
  if (!employee) return;
  elements.employeeId.value = employee.id;
  elements.employeeName.value = employee.name;
  elements.employeeEmail.value = employee.email;
  elements.employeeRole.value = employee.role;
  elements.employeeDepartment.value = employee.department;
  activateTab("employeeFormPanel");
  elements.employeeName.focus();
}

function nextStatus(status) {
  if (status === "Pending") return "In Progress";
  if (status === "In Progress") return "Completed";
  return "Pending";
}

function activateTab(panelName) {
  document.querySelectorAll(".tab").forEach(tab => {
    tab.classList.toggle("active", tab.dataset.tab === panelName);
  });
  document.querySelectorAll(".form-panel").forEach(panel => {
    panel.classList.toggle("active", panel.dataset.panel === panelName);
  });
}

async function refresh() {
  const [employees, tasks, dashboard] = await Promise.all([
    api("/api/employees"),
    api("/api/tasks"),
    api("/api/dashboard")
  ]);
  state.employees = employees;
  state.tasks = tasks;
  state.dashboard = dashboard;
  renderDashboard();
  renderEmployeeOptions();
  renderTasks();
  renderEmployees();
}

elements.taskForm.addEventListener("submit", async event => {
  event.preventDefault();
  const payload = {
    title: elements.taskTitle.value,
    description: elements.taskDescription.value,
    employeeId: elements.taskEmployee.value,
    priority: elements.taskPriority.value,
    status: elements.taskStatus.value,
    dueDate: elements.taskDueDate.value
  };
  const id = elements.taskId.value;
  try {
    await api(id ? `/api/tasks/${id}` : "/api/tasks", {
      method: id ? "PUT" : "POST",
      body: JSON.stringify(payload)
    });
    clearTaskForm();
    await refresh();
    showToast("Task saved successfully.");
  } catch (error) {
    showToast(error.message);
  }
});

elements.employeeForm.addEventListener("submit", async event => {
  event.preventDefault();
  const payload = {
    name: elements.employeeName.value,
    email: elements.employeeEmail.value,
    role: elements.employeeRole.value,
    department: elements.employeeDepartment.value
  };
  const id = elements.employeeId.value;
  try {
    await api(id ? `/api/employees/${id}` : "/api/employees", {
      method: id ? "PUT" : "POST",
      body: JSON.stringify(payload)
    });
    clearEmployeeForm();
    await refresh();
    showToast("Employee saved successfully.");
  } catch (error) {
    showToast(error.message);
  }
});

document.body.addEventListener("click", async event => {
  const target = event.target;
  const taskId = target.dataset.editTask || target.dataset.deleteTask || target.dataset.nextStatus;
  const employeeId = target.dataset.editEmployee || target.dataset.deleteEmployee;

  if (target.matches(".tab")) {
    activateTab(target.dataset.tab);
  }

  if (target.dataset.editTask) {
    editTask(taskId);
  }

  if (target.dataset.editEmployee) {
    editEmployee(employeeId);
  }

  if (target.dataset.deleteTask && confirm("Delete this task?")) {
    await api(`/api/tasks/${taskId}`, { method: "DELETE" });
    await refresh();
    showToast("Task deleted.");
  }

  if (target.dataset.deleteEmployee && confirm("Delete this employee? Employees with tasks cannot be deleted.")) {
    try {
      await api(`/api/employees/${employeeId}`, { method: "DELETE" });
      await refresh();
      showToast("Employee deleted.");
    } catch (error) {
      showToast(error.message);
    }
  }

  if (target.dataset.nextStatus) {
    const task = state.tasks.find(item => item.id === taskId);
    await api(`/api/tasks/${taskId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status: nextStatus(task.status) })
    });
    await refresh();
    showToast("Task status updated.");
  }
});

elements.statusFilter.addEventListener("change", renderTasks);
elements.employeeFilter.addEventListener("change", renderTasks);
document.querySelector("#refreshBtn").addEventListener("click", refresh);
document.querySelector("#cancelTaskEdit").addEventListener("click", clearTaskForm);
document.querySelector("#cancelEmployeeEdit").addEventListener("click", clearEmployeeForm);

clearTaskForm();
refresh().catch(error => showToast(error.message));
