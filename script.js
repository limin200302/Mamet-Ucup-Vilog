// script.js
const diamondList = document.getElementById('diamondList');

const data = [
  ["55 Diamond", "Rp 14.000"],
  ["110 Diamond", "Rp 27.000"],
  ["165 Diamond", "Rp 40.000"],
  ["275 Diamond", "Rp 65.000"],
  ["565 Diamond", "Rp 125.000"],
  ["1.155 Diamond", "Rp 240.000"],
  ["1.765 Diamond", "Rp 360.000"],
  ["2.975 Diamond", "Rp 580.000"],
  ["6.000 Diamond", "Rp 1.170.000"],
  ["Weekly Diamond Pass", "Rp 25.000"],
  ["Epic Bundle", "Rp 65.000"],
  ["Elite Bundle", "Rp 14.000"]
];

const jumlah = new Array(data.length).fill(0);

function buatList() {
  diamondList.innerHTML = '';
  data.forEach(([nama, harga], i) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${nama}</span><span>${harga}</span>
      <div class="qty">
        <button onclick="ubahJumlah(${i}, -1)">-</button>
        <span id="qty-${i}">0</span>
        <button onclick="ubahJumlah(${i}, 1)">+</button>
      </div>
    `;
    diamondList.appendChild(li);
  });
}

function ubahJumlah(index, delta) {
  let baru = jumlah[index] + delta;
  if (baru < 0) baru = 0;
  if (baru > 10) baru = 10;
  jumlah[index] = baru;
  document.getElementById(`qty-${index}`).textContent = baru;
}

function buatPesanan() {
  let pesanList = [];
  jumlah.forEach((jml, i) => {
    if (jml > 0) {
      pesanList.push(`${data[i][0]} +${jml}`);
    }
  });
  if (pesanList.length === 0) {
    alert('Silakan pilih minimal 1 paket diamond.');
    return;
  }
  const paketDipilih = pesanList.join(' | ');
  const waMessage = encodeURIComponent(`Halo, saya mau pesan paket:\n${paketDipilih}\n\nMohon info lanjutnya ya.`);
  const waUrl = `https://wa.me/6285713056206?text=${waMessage}`;

  simpanRiwayat(paketDipilih);
  window.open(waUrl, '_blank');
}

const historyKey = 'mametucup_order_history';

function simpanRiwayat(pesan) {
  let history = JSON.parse(localStorage.getItem(historyKey)) || [];
  const waktu = new Date().toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' });
  history.unshift(`${waktu}: ${pesan}`);
  if (history.length > 20) history.pop();
  localStorage.setItem(historyKey, JSON.stringify(history));
  tampilkanRiwayat();
}

function tampilkanRiwayat() {
  const historyList = document.getElementById('historyList');
  let history = JSON.parse(localStorage.getItem(historyKey)) || [];
  if (history.length === 0) {
    historyList.textContent = 'Belum ada riwayat order.';
    return;
  }
  historyList.innerHTML = '';
  history.forEach(item => {
    const div = document.createElement('div');
    div.textContent = item;
    historyList.appendChild(div);
  });
}

function hapusRiwayat() {
  if (confirm('Yakin ingin menghapus seluruh riwayat order?')) {
    localStorage.removeItem(historyKey);
    tampilkanRiwayat();
  }
}

async function fetchIP() {
  try {
    const res = await fetch('https://api.ipify.org?format=json');
    const dataIP = await res.json();
    document.getElementById('ipList').textContent = `IP Pengunjung: ${dataIP.ip}`;
  } catch {
    document.getElementById('ipList').textContent = 'Tidak dapat memuat IP.';
  }
}

window.onload = () => {
  buatList();
  fetchIP();
  tampilkanRiwayat();
};