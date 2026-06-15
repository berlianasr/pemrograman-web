// ==========================================
// DATASETS
// ==========================================

// Student names suggestions database
const STUDENT_NAMES = [
    "Ahmad Fauzi", "Budi Santoso", "Citra Lestari", "Dian Pratama", "Eka Saputra",
    "Fatimah Zahra", "Gita Permata", "Hendra Wijaya", "Indah Sari", "Joko Susilo",
    "Kartika Putri", "Lukman Hakim", "Maria Angelina", "Naufal Rizqi", "Olivia Wijaya",
    "Putu Gede", "Qori Asyhar", "Rian Hidayat", "Siti Aminah", "Taufik Hidayat",
    "Utami Lestari", "Valerie Christie", "Wawan Setiawan", "Xavier Putra", "Yusuf Mansur",
    "Zahra Aulia", "Arif Rahman", "Berliana Sarlita", "Cindy Claudia", "Doni Setiadi"
];

// Course to Lecturers dynamic mapping
const COURSE_LECTURERS = {
    "Pemrograman Web": [
        "Dr. Berliana Sarlita, M.T.",
        "Budi Rahardjo, M.T.",
        "Ahmad Dahlan, M.Kom"
    ],
    "Basis Data": [
        "Citra Lestari, Ph.D.",
        "Hendra Wijaya, M.Cs.",
        "Irwan Santoso, M.T."
    ],
    "Kecerdasan Buatan": [
        "Prof. Dr. Eng. Hermawan",
        "Dian Pratama, M.Sc.",
        "Rina Astuti, M.Comp.Sc"
    ],
    "Jaringan Komputer": [
        "Eka Saputra, M.T.",
        "Fatimah Zahra, M.Kom",
        "Hadi Wibowo, B.Eng"
    ],
    "Rekayasa Perangkat Lunak": [
        "Lukman Hakim, M.S.I.",
        "Gita Permata, M.T.",
        "Zahra Aulia, M.I.T."
    ]
};

// Indonesian Postal Code hierarchical dataset
const POSTAL_DATA = {
    "DKI Jakarta": {
        "Jakarta Selatan": {
            "Kebayoran Baru": "12110",
            "Cilandak": "12430",
            "Tebet": "12810",
            "Pasar Minggu": "12510"
        },
        "Jakarta Pusat": {
            "Gambir": "10110",
            "Menteng": "10310",
            "Kemayoran": "10610",
            "Sawah Besar": "10710"
        }
    },
    "Jawa Barat": {
        "Bandung": {
            "Coblong": "40135",
            "Lengkong": "40262",
            "Andir": "40181",
            "Cicendo": "40171"
        },
        "Bogor": {
            "Bogor Tengah": "16122",
            "Bogor Timur": "16143",
            "Babakan Madang": "16810",
            "Ciawi": "16720"
        }
    },
    "Jawa Tengah": {
        "Semarang": {
            "Tembalang": "50275",
            "Pedurungan": "50192",
            "Gajahmungkur": "50232",
            "Banyumanik": "50263"
        },
        "Surakarta (Solo)": {
            "Laweyan": "57141",
            "Banjarsari": "57131",
            "Jebres": "57121",
            "Pasar Kliwon": "57118"
        }
    },
    "DI Yogyakarta": {
        "Sleman": {
            "Depok": "55281",
            "Mlati": "55285",
            "Gamping": "55291",
            "Ngaglik": "55581"
        },
        "Yogyakarta": {
            "Umbulharjo": "55161",
            "Kotagede": "55173",
            "Danurejan": "55211",
            "Mantinejeron": "55143"
        }
    },
    "Jawa Timur": {
        "Surabaya": {
            "Sukolilo": "60111",
            "Rungkut": "60293",
            "Gubeng": "60281",
            "Tegalsari": "60262"
        },
        "Malang": {
            "Lowokwaru": "65141",
            "Klojen": "65111",
            "Blimbing": "65126",
            "Sukun": "65147"
        }
    }
};

// ==========================================
// INITIALIZATION & TAB SWITCHING
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    initTabs();
    initTheme();
    initRegistrationForm();
    initPostalCodeSearch();
    initJSPractice();
    initVisualizerDemo();
});

function initTabs() {
    const tabButtons = document.querySelectorAll(".tab-btn");
    const tabContents = document.querySelectorAll(".tab-content");

    tabButtons.forEach(button => {
        button.addEventListener("click", () => {
            const targetTab = button.dataset.tab;

            // Remove active class from buttons and contents
            tabButtons.forEach(btn => btn.classList.remove("active"));
            tabContents.forEach(content => content.classList.remove("active"));

            // Add active class to selected button and content
            button.classList.add("active");
            document.getElementById(targetTab).classList.add("active");
        });
    });
}

function initTheme() {
    // Set light theme by default
    document.documentElement.setAttribute("data-theme", "light");
}

// ==========================================
// REGISTRATION FORM LOGIC (WITH AUTOCOMPLETE)
// ==========================================
function initRegistrationForm() {
    const mhsNameInput = document.getElementById("mhs-name");
    const autocompleteBox = document.getElementById("mhs-autocomplete");
    const courseSelect = document.getElementById("mhs-course");
    const lecturerSelect = document.getElementById("mhs-lecturer");
    const regForm = document.getElementById("registration-form");
    const regTableBody = document.getElementById("reg-table-body");
    const emptyStateRow = document.getElementById("empty-state-row");

    let activeSuggestionIndex = -1;
    let registeredStudents = [];

    // 1. Name Autocomplete Recommendation
    mhsNameInput.addEventListener("input", (e) => {
        const query = e.target.value.trim().toLowerCase();
        activeSuggestionIndex = -1;
        
        if (!query) {
            hideAutocomplete();
            return;
        }

        // Filter recommendations
        const matches = STUDENT_NAMES.filter(name => 
            name.toLowerCase().includes(query)
        );

        if (matches.length > 0) {
            renderSuggestions(matches, query);
        } else {
            hideAutocomplete();
        }
    });

    mhsNameInput.addEventListener("keydown", (e) => {
        const items = autocompleteBox.querySelectorAll(".autocomplete-item");
        if (!items.length) return;

        if (e.key === "ArrowDown") {
            e.preventDefault();
            activeSuggestionIndex = (activeSuggestionIndex + 1) % items.length;
            highlightSuggestion(items);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            activeSuggestionIndex = (activeSuggestionIndex - 1 + items.length) % items.length;
            highlightSuggestion(items);
        } else if (e.key === "Enter") {
            if (activeSuggestionIndex > -1) {
                e.preventDefault();
                selectSuggestion(items[activeSuggestionIndex].innerText);
            }
        } else if (e.key === "Escape") {
            hideAutocomplete();
        }
    });

    function renderSuggestions(matches, query) {
        autocompleteBox.innerHTML = "";
        matches.forEach((name, idx) => {
            const div = document.createElement("div");
            div.className = "autocomplete-item";
            
            // Highlight the matching characters
            const startIdx = name.toLowerCase().indexOf(query);
            const endIdx = startIdx + query.length;
            const highlightedText = 
                name.substring(0, startIdx) + 
                "<strong>" + name.substring(startIdx, endIdx) + "</strong>" + 
                name.substring(endIdx);
            
            div.innerHTML = highlightedText;
            div.addEventListener("click", () => {
                selectSuggestion(name);
            });
            autocompleteBox.appendChild(div);
        });
        autocompleteBox.style.display = "block";
    }

    function highlightSuggestion(items) {
        items.forEach((item, idx) => {
            if (idx === activeSuggestionIndex) {
                item.classList.add("selected");
                item.scrollIntoView({ block: "nearest" });
            } else {
                item.classList.remove("selected");
            }
        });
    }

    function selectSuggestion(name) {
        mhsNameInput.value = name;
        hideAutocomplete();
        validateField(mhsNameInput, document.getElementById("name-error"));
    }

    function hideAutocomplete() {
        autocompleteBox.style.display = "none";
        autocompleteBox.innerHTML = "";
    }

    // Hide autocomplete list when clicking outside
    document.addEventListener("click", (e) => {
        if (e.target !== mhsNameInput && e.target !== autocompleteBox) {
            hideAutocomplete();
        }
    });

    // 2. Chained Course -> Lecturers dynamic loading
    // Initial loading of course options
    courseSelect.innerHTML = '<option value="" disabled selected>-- Pilih Mata Kuliah --</option>';
    Object.keys(COURSE_LECTURERS).forEach(course => {
        const option = document.createElement("option");
        option.value = course;
        option.textContent = course;
        courseSelect.appendChild(option);
    });

    courseSelect.addEventListener("change", () => {
        const selectedCourse = courseSelect.value;
        lecturerSelect.innerHTML = '<option value="" disabled selected>-- Pilih Dosen Pengampu --</option>';
        
        if (selectedCourse && COURSE_LECTURERS[selectedCourse]) {
            COURSE_LECTURERS[selectedCourse].forEach(lecturer => {
                const option = document.createElement("option");
                option.value = lecturer;
                option.textContent = lecturer;
                lecturerSelect.appendChild(option);
            });
            lecturerSelect.disabled = false;
        } else {
            lecturerSelect.disabled = true;
        }
        
        validateField(courseSelect, document.getElementById("course-error"));
    });

    lecturerSelect.addEventListener("change", () => {
        validateField(lecturerSelect, document.getElementById("lecturer-error"));
    });

    // 3. Form Validations
    const nimInput = document.getElementById("mhs-nim");
    nimInput.addEventListener("input", () => {
        // Strip non-digits
        nimInput.value = nimInput.value.replace(/\D/g, "");
        validateNIM();
    });

    function validateNIM() {
        const errorDiv = document.getElementById("nim-error");
        if (nimInput.value.length === 0) {
            showError(nimInput, errorDiv, "NIM wajib diisi");
            return false;
        } else if (nimInput.value.length < 9 || nimInput.value.length > 12) {
            showError(nimInput, errorDiv, "NIM harus berukuran 9-12 digit angka");
            return false;
        } else {
            clearError(nimInput, errorDiv);
            return true;
        }
    }

    function validateField(input, errorDiv, customMsg) {
        if (!input.value) {
            showError(input, errorDiv, customMsg || "Kolom ini wajib diisi");
            return false;
        } else {
            clearError(input, errorDiv);
            return true;
        }
    }

    function showError(input, errorDiv, msg) {
        input.classList.add("error");
        errorDiv.textContent = msg;
        errorDiv.style.display = "flex";
    }

    function clearError(input, errorDiv) {
        input.classList.remove("error");
        errorDiv.style.display = "none";
    }

    // 4. Form Submission
    regForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const isNameValid = validateField(mhsNameInput, document.getElementById("name-error"), "Nama Mahasiswa wajib diisi");
        const isNimValid = validateNIM();
        const isCourseValid = validateField(courseSelect, document.getElementById("course-error"), "Silakan pilih mata kuliah");
        const isLecturerValid = validateField(lecturerSelect, document.getElementById("lecturer-error"), "Silakan pilih dosen");

        if (isNameValid && isNimValid && isCourseValid && isLecturerValid) {
            const newStudent = {
                name: mhsNameInput.value.trim(),
                nim: nimInput.value.trim(),
                course: courseSelect.value,
                lecturer: lecturerSelect.value
            };

            registeredStudents.push(newStudent);
            renderRegisteredTable();
            
            // Reset form
            regForm.reset();
            lecturerSelect.innerHTML = '<option value="" disabled selected>-- Pilih Dosen Pengampu --</option>';
            lecturerSelect.disabled = true;
            
            // Show Success Notification
            alert(`Registrasi Berhasil! Mahasiswa ${newStudent.name} telah terdaftar.`);
        }
    });

    function renderRegisteredTable() {
        if (registeredStudents.length === 0) {
            emptyStateRow.style.display = "table-row";
            return;
        }

        emptyStateRow.style.display = "none";
        
        // Clear all except empty state row
        const rows = regTableBody.querySelectorAll("tr:not(#empty-state-row)");
        rows.forEach(r => r.remove());

        registeredStudents.forEach((student, index) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${index + 1}</td>
                <td><strong>${student.name}</strong></td>
                <td><code>${student.nim}</code></td>
                <td>${student.course}</td>
                <td>${student.lecturer}</td>
            `;
            regTableBody.appendChild(tr);
        });
    }
}

// ==========================================
// INDONESIAN POSTAL CODE LOOKUP (DYNAMIC DROPDOWNS)
// ==========================================
function initPostalCodeSearch() {
    const provinceSelect = document.getElementById("postal-province");
    const regencySelect = document.getElementById("postal-regency");
    const districtSelect = document.getElementById("postal-district");
    const searchForm = document.getElementById("postal-search-form");
    
    const resultBox = document.getElementById("postal-result-box");
    const emptyResult = document.getElementById("postal-empty-result");
    const postalCard = document.getElementById("postal-card");
    const zipCodeDisplay = document.getElementById("zip-code-display");
    
    const resProv = document.getElementById("res-province");
    const resReg = document.getElementById("res-regency");
    const resDist = document.getElementById("res-district");

    // 1. Load provinces
    provinceSelect.innerHTML = '<option value="" disabled selected>-- Pilih Provinsi --</option>';
    Object.keys(POSTAL_DATA).forEach(province => {
        const opt = document.createElement("option");
        opt.value = province;
        opt.textContent = province;
        provinceSelect.appendChild(opt);
    });

    // 2. Chained triggers
    provinceSelect.addEventListener("change", () => {
        const province = provinceSelect.value;
        regencySelect.innerHTML = '<option value="" disabled selected>-- Pilih Kabupaten/Kota --</option>';
        districtSelect.innerHTML = '<option value="" disabled selected>-- Pilih Kecamatan --</option>';
        districtSelect.disabled = true;

        if (province && POSTAL_DATA[province]) {
            Object.keys(POSTAL_DATA[province]).forEach(regency => {
                const opt = document.createElement("option");
                opt.value = regency;
                opt.textContent = regency;
                regencySelect.appendChild(opt);
            });
            regencySelect.disabled = false;
        } else {
            regencySelect.disabled = true;
        }

        // Trigger dynamic debug visualization if active
        if (typeof updateVisualDebug === "function") {
            updateVisualDebug("province", province);
        }
    });

    regencySelect.addEventListener("change", () => {
        const province = provinceSelect.value;
        const regency = regencySelect.value;
        districtSelect.innerHTML = '<option value="" disabled selected>-- Pilih Kecamatan --</option>';

        if (province && regency && POSTAL_DATA[province][regency]) {
            Object.keys(POSTAL_DATA[province][regency]).forEach(district => {
                const opt = document.createElement("option");
                opt.value = district;
                opt.textContent = district;
                districtSelect.appendChild(opt);
            });
            districtSelect.disabled = false;
        } else {
            districtSelect.disabled = true;
        }

        // Trigger dynamic debug visualization if active
        if (typeof updateVisualDebug === "function") {
            updateVisualDebug("regency", regency);
        }
    });

    districtSelect.addEventListener("change", () => {
        // Trigger dynamic debug visualization if active
        if (typeof updateVisualDebug === "function") {
            updateVisualDebug("district", districtSelect.value);
        }
    });

    // 3. Submit Search
    searchForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const prov = provinceSelect.value;
        const reg = regencySelect.value;
        const dist = districtSelect.value;

        if (!prov || !reg || !dist) {
            alert("Silakan lengkapi pilihan wilayah pencarian.");
            return;
        }

        const postalCode = POSTAL_DATA[prov][reg][dist];

        if (postalCode) {
            // Render Result Card
            zipCodeDisplay.textContent = postalCode;
            resProv.textContent = prov;
            resReg.textContent = reg;
            resDist.textContent = dist;

            // Animate card entrance
            emptyResult.style.display = "none";
            postalCard.classList.add("active");
            resultBox.classList.add("active");
        }
    });
}

// ==========================================
// JAVASCRIPT PRACTICAL EXERCISES
// ==========================================
function initJSPractice() {
    // A. String Manipulator Exercise
    const stringInput = document.getElementById("js-string-input");
    const stringSubmit = document.getElementById("js-string-submit");
    const stringResult = document.getElementById("js-string-result");

    stringSubmit.addEventListener("click", () => {
        const text = stringInput.value;
        if (!text) {
            stringResult.innerHTML = "<em>Masukkan teks terlebih dahulu!</em>";
            return;
        }

        const length = text.length;
        const reversed = text.split("").reverse().join("");
        
        // Clean string for palindrome check (alphanumeric only, lowercase)
        const cleanStr = text.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
        const cleanRevStr = cleanStr.split("").reverse().join("");
        const isPalindrome = cleanStr.length > 0 && cleanStr === cleanRevStr;

        stringResult.innerHTML = `
            <div><strong>Teks Asli:</strong> "${text}"</div>
            <div><strong>Panjang Teks:</strong> ${length} karakter</div>
            <div><strong>Teks Terbalik:</strong> "${reversed}"</div>
            <div><strong>Palindrom?</strong> ${isPalindrome ? '<span style="color:var(--success-color); font-weight:700;">YA</span>' : '<span style="color:var(--error-color); font-weight:700;">TIDAK</span>'}</div>
        `;
    });

    // B. Fibonacci Sequence Exercise
    const fiboInput = document.getElementById("js-fibo-input");
    const fiboSubmit = document.getElementById("js-fibo-submit");
    const fiboResult = document.getElementById("js-fibo-result");

    fiboSubmit.addEventListener("click", () => {
        const count = parseInt(fiboInput.value);
        if (isNaN(count) || count <= 0 || count > 50) {
            fiboResult.innerHTML = "<em>Silakan masukkan angka berukuran 1 hingga 50!</em>";
            return;
        }

        let sequence = [];
        if (count >= 1) sequence.push(0);
        if (count >= 2) sequence.push(1);
        
        for (let i = 2; i < count; i++) {
            sequence.push(sequence[i - 1] + sequence[i - 2]);
        }

        fiboResult.innerHTML = `
            <div style="font-weight: 700; margin-bottom: 0.5rem;">Deret Fibonacci (${count} elemen):</div>
            <div style="line-height: 1.8; word-break: break-all;">${sequence.join(", ")}</div>
        `;
    });

    // C. Interactive Array Visualizer
    const arrayInput = document.getElementById("js-array-input");
    const btnPush = document.getElementById("btn-push");
    const btnPop = document.getElementById("btn-pop");
    const btnShift = document.getElementById("btn-shift");
    const btnUnshift = document.getElementById("btn-unshift");
    const visualContainer = document.getElementById("array-visual-container");

    let visualArray = ["HTML", "CSS", "JS"];
    renderArrayVisual();

    btnPush.addEventListener("click", () => {
        const val = arrayInput.value.trim();
        if (!val) {
            alert("Masukkan nilai array terlebih dahulu.");
            return;
        }
        visualArray.push(val);
        arrayInput.value = "";
        renderArrayVisual();
    });

    btnPop.addEventListener("click", () => {
        if (visualArray.length === 0) return;
        const popped = visualArray.pop();
        alert(`Pop element: "${popped}"`);
        renderArrayVisual();
    });

    btnShift.addEventListener("click", () => {
        if (visualArray.length === 0) return;
        const shifted = visualArray.shift();
        alert(`Shift element: "${shifted}"`);
        renderArrayVisual();
    });

    btnUnshift.addEventListener("click", () => {
        const val = arrayInput.value.trim();
        if (!val) {
            alert("Masukkan nilai array terlebih dahulu.");
            return;
        }
        visualArray.unshift(val);
        arrayInput.value = "";
        renderArrayVisual();
    });

    function renderArrayVisual() {
        visualContainer.innerHTML = "";
        if (visualArray.length === 0) {
            visualContainer.innerHTML = '<span style="color:var(--text-muted); font-style:italic;">Array Kosong []</span>';
            return;
        }

        visualArray.forEach((item, idx) => {
            const node = document.createElement("div");
            node.className = "array-node";
            node.innerHTML = `
                ${item}
                <div class="array-index">[ ${idx} ]</div>
            `;
            visualContainer.appendChild(node);
        });
    }
}

// ==========================================
// DYNAMIC DROPDOWN DEBUGLOG / EXPLANATORY FLOW
// ==========================================
let activeProvKey = "";
let activeRegKey = "";
let activeDistKey = "";

function initVisualizerDemo() {
    renderJSONViewer();
}

function updateVisualDebug(type, value) {
    const stepProv = document.getElementById("flow-step-prov");
    const stepReg = document.getElementById("flow-step-reg");
    const stepDist = document.getElementById("flow-step-dist");

    if (type === "province") {
        activeProvKey = value;
        activeRegKey = "";
        activeDistKey = "";
        
        stepProv.classList.add("active");
        document.getElementById("val-step-prov").textContent = value || "Belum dipilih";
        
        stepReg.classList.remove("active");
        document.getElementById("val-step-reg").textContent = "Menunggu...";
        
        stepDist.classList.remove("active");
        document.getElementById("val-step-dist").textContent = "Menunggu...";
    } else if (type === "regency") {
        activeRegKey = value;
        activeDistKey = "";

        stepReg.classList.add("active");
        document.getElementById("val-step-reg").textContent = value || "Belum dipilih";
        
        stepDist.classList.remove("active");
        document.getElementById("val-step-dist").textContent = "Menunggu...";
    } else if (type === "district") {
        activeDistKey = value;

        stepDist.classList.add("active");
        document.getElementById("val-step-dist").textContent = value || "Belum dipilih";
    }

    renderJSONViewer();
}

function renderJSONViewer() {
    const jsonViewer = document.getElementById("dynamic-json-viewer");
    if (!jsonViewer) return;

    let html = '{\n';
    
    Object.keys(POSTAL_DATA).forEach((prov, pIdx, pArr) => {
        const isProvActive = prov === activeProvKey;
        const lineClass = isProvActive ? 'json-highlight' : '';
        const pComma = pIdx < pArr.length - 1 ? ',' : '';
        
        html += `<span class="${lineClass}">  <span class="json-key">"${prov}"</span>: {</span>\n`;
        
        if (isProvActive) {
            const regencies = POSTAL_DATA[prov];
            Object.keys(regencies).forEach((reg, rIdx, rArr) => {
                const isRegActive = reg === activeRegKey;
                const innerLineClass = isRegActive ? 'json-highlight' : '';
                const rComma = rIdx < rArr.length - 1 ? ',' : '';
                
                html += `<span class="${innerLineClass}">    <span class="json-key">"${reg}"</span>: {</span>\n`;
                
                if (isRegActive) {
                    const districts = regencies[reg];
                    Object.keys(districts).forEach((dist, dIdx, dArr) => {
                        const isDistActive = dist === activeDistKey;
                        const distLineClass = isDistActive ? 'json-highlight' : '';
                        const dComma = dIdx < dArr.length - 1 ? ',' : '';
                        const zipCode = districts[dist];
                        
                        html += `<span class="${distLineClass}">      <span class="json-key">"${dist}"</span>: <span class="json-string">"${zipCode}"</span>${dComma}</span>\n`;
                    });
                } else {
                    html += `      <span class="json-string">/* ... districts ... */</span>\n`;
                }
                
                html += `<span class="${innerLineClass}">    }${rComma}</span>\n`;
            });
        } else {
            html += `    <span class="json-string">/* ... kabupaten/kota ... */</span>\n`;
        }
        
        html += `<span class="${lineClass}">  }${pComma}</span>\n`;
    });

    html += '}';
    jsonViewer.innerHTML = html;
}
