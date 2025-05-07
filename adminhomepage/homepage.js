

document.addEventListener('DOMContentLoaded', () => {
    const classSelect = document.getElementById('classSelect');
    const divisionSelect = document.getElementById('divisionSelect');
    const mamSubjectSelect = document.getElementById('mamSubjectSelect');
    const mamChapterSelect = document.getElementById('mamChapterSelect');
    const descriptionInput = document.getElementById('descriptionInput');
    const pdfInput = document.getElementById('pdfInput');
  
    classSelect.addEventListener('change', updateSubjectsDropdown);
    mamSubjectSelect.addEventListener('change', updateChaptersDropdown);
  
    function updateSubjectsDropdown() {
      const selectedClass = classSelect.value;
  
      if (selectedClass) {
        fetch(`/subjects/${selectedClass}`)
          .then(response => response.json())
          .then(subjects => {
            mamSubjectSelect.innerHTML = '<option value="" disabled selected>Select a Subject</option>';
            subjects.forEach(subject => {
              const option = document.createElement('option');
              option.value = subject;
              option.textContent = subject;
              mamSubjectSelect.appendChild(option);
              mamChapterSelect.innerHTML = '<option value="" disabled selected>Select a Chapter</option>';
            });
          })
          .catch(error => {
            console.error('Error fetching subjects: ', error);
            alert('Error fetching subjects. Please try again.');
          });
      }
    }
  
    function updateChaptersDropdown() {
      const selectedClass = classSelect.value;
      const selectedSubject = mamSubjectSelect.value;
  
      if (selectedClass && selectedSubject) {
        fetch(`/chapters/${selectedClass}/${selectedSubject}`)
          .then(response => response.json())
          .then(chapters => {
            mamChapterSelect.innerHTML = '<option value="" disabled selected>Select a Chapter</option>';
            chapters.forEach(chapter => {
              const option = document.createElement('option');
              option.value = chapter;
              option.textContent = chapter;
              mamChapterSelect.appendChild(option);
            });
          })
          .catch(error => {
            console.error('Error fetching chapters: ', error);
            alert('Error fetching chapters. Please try again.');
          });
      }
    }
  
    window.uploadNotesData = () => {
      const selectedClass = classSelect.value;
      const selectedDivision = divisionSelect.value === 'null' ? null : divisionSelect.value;
      const selectedSubject = mamSubjectSelect.value;
      const selectedChapter = mamChapterSelect.value;
      const description = descriptionInput.value;
      const pdfFile = pdfInput.files[0];
  
      if (selectedClass && description && pdfFile) {
        const formData = new FormData();
        formData.append('class', selectedClass);
        formData.append('division', selectedDivision);
        formData.append('subject', selectedSubject);
        formData.append('chapter', selectedChapter);
        formData.append('description', description);
        formData.append('pdfFile', pdfFile);
  
        fetch('/submitNotesData', {
          method: 'POST',
          body: formData,
        })
          .then(response => response.json())
          .then(data => {
            console.log('Data submitted successfully:', data);
            alert('Submitted successfully');
            location.reload();
          })
          .catch(error => {
            console.error('Error submitting notes data: ', error);
            alert('Error submitting notes data. Please try again.');
          });
      } else {
        alert('Please fill in all required fields.');
      }
    };
  });
  
