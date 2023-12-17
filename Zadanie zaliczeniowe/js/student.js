const studentList = [];

const isValidName = name => /^[A-Za-zĄąĆćĘęŁłŃńÓóŚśŹźŻż\s]+$/.test(name);
const isValidId = id => /^\d{5}$/.test(id);
const isValidTest = test => /^[1-5]$/.test(test);

const addStudent = () => {
    const name = document.getElementById('name').value;
    const id = document.getElementById('id').value;
    const test1 = parseFloat(document.getElementById('test1').value);
    const test2 = parseFloat(document.getElementById('test2').value);
    const test3 = parseFloat(document.getElementById('test3').value);

    if (!isValidName(name)) {
        alert('Invalid name. Please enter only alphabet letters.');
        return;
    }

    if (!isValidId(id)) {
        alert('Invalid ID. Please enter 5 digits.');
        return;
    }

    if (!isValidTest(test1) || !isValidTest(test2) || !isValidTest(test3)) {
        alert('Invalid test score. Please enter an integer between 1 and 5.');
        return;
    }

    const student = {
        name,
        id,
        test1,
        test2,
        test3,
    };

    studentList.push(student);
    calculateAndFormatResults();
};

const calculateAndFormatResults = () => {
    const averages = studentList.map(student => (student.test1 + student.test2 + student.test3) / 3);
    const grades = averages.map(assignGrade);
    displayStudentList();
};

const assignGrade = average => {
    if (average >= 4.5) {
        return 'A';
    } else if (average >= 4.0) {
        return 'B';
    } else if (average >= 3.5) {
        return 'C';
    } else if (average >= 3.0) {
        return 'D';
    } else if (average >= 2.0) {
        return 'E';
    } else {
        return 'F';
    }
};

const displayStudentList = () => {
    let studentListHTML = "<ul>";

     for (const student of studentList) {

        const average = (student.test1 + student.test2 + student.test3) / 3;
        const grade = assignGrade(average);

        let message = 'Imie i Nazwisko: ' + student.name + '<br>';
        message += 'Numer albumu: ' + student.id + '<br>';
        message += 'Średnia ocen: ' + average.toFixed(2) + ", Ocena końcowa: " + grade;

        studentListHTML += "<li>" + message + "</li>";
    }

    studentListHTML += "</ul>";
    output.innerHTML = studentListHTML; 
};

const exportToCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
        "Imie i Nazwisko,Numer albumu,Test 1,Test 2,Test 3\n";

    const dataRows = studentList.map(student => {
        return `${student.name},${student.id},${student.test1},${student.test2},${student.test3}`;
    });

    const csvRows = [csvContent, ...dataRows].join("\n");
    const encodedUri = encodeURI(csvRows);

    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "studentList.csv");
    document.body.appendChild(link);
    link.click();
};

const importFromCSV = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.csv';

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (e) {
            const csvData = e.target.result;
            const rows = csvData.split('\n');

            for (let i = 1; i < rows.length; i++) {
                const [name, id, test1, test2, test3] = rows[i].split(',');
                if (name && id && test1 && test2 && test3) {
                    const student = {
                        name,
                        id,
                        test1: parseFloat(test1),
                        test2: parseFloat(test2),
                        test3: parseFloat(test3),
                    };
                    studentList.push(student);
                }
            }

            calculateAndFormatResults();
        };

        reader.readAsText(file);
    });

    fileInput.click();
};
