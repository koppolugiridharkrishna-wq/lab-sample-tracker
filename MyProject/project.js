let samples = JSON.parse(localStorage.getItem('labSamples')) || [];
let editingId = null;

function saveToStorage() {
  localStorage.setItem('labSamples', JSON.stringify(samples));
}

function renderTable() {
  const tbody = document.getElementById('sampleTableBody');
  const emptyState = document.getElementById('emptyState');
  tbody.innerHTML = '';

  if (samples.length === 0) {
    emptyState.style.display = 'block';
    return;
  }
  emptyState.style.display = 'none';

  samples.forEach(sample => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${escapeHtml(sample.name)}</td>
      <td>${escapeHtml(sample.type)}</td>
      <td>${sample.date}</td>
      <td><span class="badge ${sample.status}">${sample.status}</span></td>
      <td class="actions">
        <button class="edit-btn" onclick="editSample(${sample.id})">Edit</button>
        <button onclick="deleteSample(${sample.id})">Delete</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function addSample() {
  const name = document.getElementById('sampleName').value.trim();
  const type = document.getElementById('sampleType').value.trim();
  const date = document.getElementById('collectedDate').value;
  const status = document.getElementById('statusSelect').value;
  const errorMsg = document.getElementById('errorMsg');

  if (!name || !type || !date) {
    errorMsg.style.display = 'block';
    return;
  }
  errorMsg.style.display = 'none';

  if (editingId !== null) {
    const sample = samples.find(s => s.id === editingId);
    sample.name = name; sample.type = type; sample.date = date; sample.status = status;
    editingId = null;
    document.querySelector('.form-row button').textContent = 'Add Sample';
  } else {
    samples.push({ id: Date.now(), name, type, date, status });
  }

  saveToStorage();
  renderTable();
  clearForm();
}

function editSample(id) {
  const sample = samples.find(s => s.id === id);
  document.getElementById('sampleName').value = sample.name;
  document.getElementById('sampleType').value = sample.type;
  document.getElementById('collectedDate').value = sample.date;
  document.getElementById('statusSelect').value = sample.status;
  editingId = id;
  document.querySelector('.form-row button').textContent = 'Update Sample';
}

function deleteSample(id) {
  samples = samples.filter(s => s.id !== id);
  saveToStorage();
  renderTable();
}

function clearForm() {
  document.getElementById('sampleName').value = '';
  document.getElementById('sampleType').value = '';
  document.getElementById('collectedDate').value = '';
  document.getElementById('statusSelect').value = 'pending';
}

renderTable();