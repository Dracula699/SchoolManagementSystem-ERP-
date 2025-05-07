// document.addEventListener("DOMContentLoaded", function () {
    
//     const mainContent = document.querySelector('.maincontent');
//     const userData = JSON.parse(mainContent.getAttribute('data-userdata'));
//     const profileImage = document.getElementById("profileImage");
    
//     profileImage.src = `data:image/jpeg;base64,${userData.image}`;
//     document.getElementById("userName").textContent = userData.student_name || '';
//     document.getElementById("userClass").textContent = userData.class || '';
//     document.getElementById("userDivision").textContent = userData.division || '';
// });


// document.addEventListener('DOMContentLoaded', () => {
//     // Fetch subjects from the server and populate the dropdown
//     fetch('/subjects')
//       .then(response => response.json())
//       .then(subjects => {
//         const subjectSelect = document.getElementById('subjectSelect');
//         subjects.forEach(subject => {
//           const option = document.createElement('option');
//           option.value = subject;
//           option.textContent = subject;
//           subjectSelect.appendChild(option);
//         });
//       });
  
//     // Function to populate chapters based on the selected subject
//     window.populateChapters = () => {
//       const subjectSelect = document.getElementById('subjectSelect');
//       const chapterSelect = document.getElementById('chapterSelect');
//       const selectedSubject = subjectSelect.value;
  
//       // Clear existing options
//       chapterSelect.innerHTML = '<option value="" disabled selected>Select a Chapter</option>';
  
//       // Fetch chapters for the selected subject from the server
//       if (selectedSubject) {
//         fetch(`/chapters/${selectedSubject}`)
//           .then(response => response.json())
//           .then(chapters => {
//             chapters.forEach(chapter => {
//               const option = document.createElement('option');
//               option.value = chapter;
//               option.textContent = chapter;
//               chapterSelect.appendChild(option);
//             });
  
//             // Enable the chapter dropdown
//             chapterSelect.removeAttribute('disabled');
//           });
//       } else {
//         // Disable the chapter dropdown if no subject is selected
//         chapterSelect.setAttribute('disabled', 'disabled');
//       }
//     };
  
//     // Function to upload data
//     window.uploadData = () => {
//       const subjectSelect = document.getElementById('subjectSelect');
//       const chapterSelect = document.getElementById('chapterSelect');
//       const descriptionInput = document.getElementById('description');
//       const fileUploadInput = document.getElementById('fileUpload');
  
//       const subject = subjectSelect.value;
//       const chapter = chapterSelect.value;
//       const description = descriptionInput.value;
      
//       if (!subject || !chapter || !description || !fileUploadInput.files[0]) {
//         alert('Please fill in all fields and select a PDF file.');
//         return;
//       }
  
//       // Check if the selected file is a PDF
//       const fileName = fileUploadInput.files[0].name;
//       const fileExtension = fileName.split('.').pop().toLowerCase();
//       if (fileExtension !== 'pdf') {
//         alert('Please select a PDF file.');
//         return;
//       }
  
//       const formData = new FormData();
//       formData.append('subject', subject);
//       formData.append('chapter', chapter);
//       formData.append('description', description);
//       formData.append('file', fileUploadInput.files[0]);
  
//       // Send the data to the server for upload
//       fetch('/upload', {
//         method: 'POST',
//         body: formData,
//       })
//       .then(response => response.json())
//       .then(data => {
//         alert(data.message);
//         // Optionally, clear the form after successful upload
//         subjectSelect.value = '';
//         chapterSelect.value = '';
//         descriptionInput.value = '';
//         fileUploadInput.value = '';
//         chapterSelect.setAttribute('disabled', 'disabled');
//       })
//       .catch(error => {
//         console.error('Error uploading data: ', error);
//         alert('Error uploading data. Please try again.');
//       });
//     };
//   });


// public/scripts.js

document.addEventListener('DOMContentLoaded', () => {
    // Fetch subjects from the server and populate the dropdown
    fetch('/subjects')
      .then(response => response.json())
      .then(subjects => {
        const subjectSelect = document.getElementById('subjectSelect');
        subjects.forEach(subject => {
          const option = document.createElement('option');
          option.value = subject;
          option.textContent = subject;
          subjectSelect.appendChild(option);
        });
      });
  
    // Function to populate chapters based on the selected subject
    window.populateChapters = () => {
      const subjectSelect = document.getElementById('subjectSelect');
      const chapterSelect = document.getElementById('chapterSelect');
      const selectedSubject = subjectSelect.value;
  
      // Clear existing options
      chapterSelect.innerHTML = '<option value="" disabled selected>Select a Chapter</option>';
  
      // Fetch chapters for the selected subject from the server
      if (selectedSubject) {
        fetch(`/chapters/${selectedSubject}`)
          .then(response => response.json())
          .then(chapters => {
            chapters.forEach(chapter => {
              const option = document.createElement('option');
              option.value = chapter;
              option.textContent = chapter;
              chapterSelect.appendChild(option);
            });
          });
      }
    };

    // Function to handle chapter selection
    window.checkNotesData = () => {
      const subjectSelect = document.getElementById('subjectSelect');
      const chapterSelect = document.getElementById('chapterSelect');
      const selectedSubject = subjectSelect.value;
      const selectedChapter = chapterSelect.value;
  
      // Check if both subject and chapter are selected
      if (selectedSubject && selectedChapter) {
        // Perform a fetch to get the specific PDF file based on the subject and chapter
        fetch(`/getNotesData`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ subject: selectedSubject, chapter: selectedChapter }),
        })
          .then(response => response.json())
          .then(data => {
            const resultDiv = document.getElementById('resultDiv');//<th>Sr.No</th><td>${item.id}</td>
            resultDiv.innerHTML = `<table border="1">
                                      <tr>
                                      
                                        <th>Subject</th>
                                        <th>Chapter</th>
                                        <th>Description</th>
                                        <th>File Data</th>
                                        <th>Download</th>
                                      </tr>
                                      ${data.map(item => `<tr>
                                                         
                                                          <td>${item.subject}</td>
                                                          <td>${item.chapter}</td>
                                                          <td>${item.description}</td>
                                                          <td><a href="#" onclick="openPdfInNewTab(${item.id})">Open PDF</a></td>
                                                          <td><a href="#" onclick="downloadPdf(${item.id})">Download PDF</a></td>
                                                        </tr>`).join('')}
                                  </table>
                                  <div id="pdfIframeContainer"></div>`;
          })
          .catch(error => {
            console.error('Error fetching notes data: ', error);
            alert('Error fetching notes data. Please try again.');
          });
      } else {
        alert('Please select both subject and chapter.');
      }
    };

    // Function to open the PDF file in an iframe
    window.openPdfInNewTab = (id) => {
        // Perform a fetch to get the specific PDF file based on the ID
        fetch(`/getFile/${id}`)
          .then(response => response.blob())
          .then(blobData => {
            // Create a Blob URL
            const blobUrl = URL.createObjectURL(blobData);
      
            // Open a new tab with the Blob URL
            window.open(blobUrl, '_blank');
          })
          .catch(error => {
            console.error('Error opening PDF file: ', error);
            alert('Error opening PDF file. Please try again.');
          });
      };

      window.downloadPdf = (id) => {
        // Perform a fetch to get the specific PDF file based on the ID
        fetch(`/getFile/${id}`)
          .then(response => response.blob())
          .then(blobData => {
            // Create a Blob URL
            const blobUrl = URL.createObjectURL(blobData);
      
            // Create a download link
            const downloadLink = document.createElement('a');
            downloadLink.href = blobUrl;
            downloadLink.download = `file_${id}.pdf`; // You can customize the filename
            downloadLink.style.display = 'none';
            document.body.appendChild(downloadLink);
      
            // Trigger the download
            downloadLink.click();
      
            // Remove the download link from the DOM
            document.body.removeChild(downloadLink);
          })
          .catch(error => {
            console.error('Error downloading PDF file: ', error);
            alert('Error downloading PDF file. Please try again.');
          });
      };
      
      
});

  

// document.addEventListener('DOMContentLoaded', () => {
//     // Fetch subjects from the server and populate the dropdown for mamnotes
//     fetch('/subjects')
//       .then(response => response.json())
//       .then(subjects => {
//         const mamSubjectSelect = document.getElementById('mamSubjectSelect');
//         subjects.forEach(subject => {
//           const option = document.createElement('option');
//           option.value = subject;
//           option.textContent = subject;
//           mamSubjectSelect.appendChild(option);
//         });
//       });
  
//     // Function to populate chapters based on the selected subject for mamnotes
//     window.populateMamChapters = () => {
//       const mamSubjectSelect = document.getElementById('mamSubjectSelect');
//       const mamChapterSelect = document.getElementById('mamChapterSelect');
//       const selectedSubject = mamSubjectSelect.value;
  
//       // Clear existing options
//       mamChapterSelect.innerHTML = '<option value="" disabled selected>Select a Chapter</option>';
  
//       // Fetch chapters for the selected subject from the server
//       if (selectedSubject) {
//         fetch(`/chapters/${selectedSubject}`)
//           .then(response => response.json())
//           .then(chapters => {
//             chapters.forEach(chapter => {
//               const option = document.createElement('option');
//               option.value = chapter;
//               option.textContent = chapter;
//               mamChapterSelect.appendChild(option);
//             });
//           });
//       }
//     };
  
//     // Function to handle the PDF upload and data submission
//     window.uploadNotesData = () => {
//       const mamSubjectSelect = document.getElementById('mamSubjectSelect');
//       const mamChapterSelect = document.getElementById('mamChapterSelect');
//       const descriptionInput = document.getElementById('descriptionInput');
//       const pdfInput = document.getElementById('pdfInput');
//       const classSelect = document.getElementById('classSelect');
//       const divisionSelect = document.getElementById('divisionSelect');
  
//       const selectedSubject = mamSubjectSelect.value;
//       const selectedChapter = mamChapterSelect.value;
//       const description = descriptionInput.value;
//       const pdfFile = pdfInput.files[0];
//       const selectedClass = classSelect.value;
//       const selectedDivision = divisionSelect.value;
  
  
//       // Check if all required fields are filled
//       if (selectedSubject && selectedChapter && description && pdfFile) {
//         const formData = new FormData();
//         formData.append('Class', selectedClass);
//         formData.append('division', selectedDivision);
//         formData.append('subject', selectedSubject);
//         formData.append('chapter', selectedChapter);
//         formData.append('description', description);
//         formData.append('pdfFile', pdfFile);
  
//         // Perform a fetch to submit data to the server
//         fetch('/submitNotesData', {
//           method: 'POST',
//           body: formData,
//         })
//           .then(response => response.json())
//           .then(data => {
//             // Optionally, you can handle the response from the server
//             console.log('Data submitted successfully:', data);
//             alert('Submitted succefully');
//             location.reload();
//           })
//           .catch(error => {
//             console.error('Error submitting notes data: ', error);
//             alert('Error submitting notes data. Please try again.');
//           });
//       } else {
//         alert('Please fill in all required fields.');
//       }
//     };
//   });


// document.addEventListener('DOMContentLoaded', () => {
//   const classSelect = document.getElementById('classSelect');
//   const divisionSelect = document.getElementById('divisionSelect');
//   const mamSubjectSelect = document.getElementById('mamSubjectSelect');

//   // Event listener for class and division change
//   classSelect.addEventListener('change', updateSubjectsDropdown);
//   divisionSelect.addEventListener('change', updateSubjectsDropdown);

//   // Fetch subjects for the selected class and division
//   function updateSubjectsDropdown() {
//     const selectedClass = classSelect.value;
//     const selectedDivision = divisionSelect.value;

//     // Check if both class and division are selected
//     if (selectedClass && selectedDivision) {
//       fetch(`/subjects/${selectedClass}`)
//         .then(response => response.json())
//         .then(subjects => {
//           // Clear existing options
//           mamSubjectSelect.innerHTML = '<option value="" disabled selected>Select a Subject</option>';

//           // Populate subjects dropdown with fetched subjects
//           subjects.forEach(subject => {
//             const option = document.createElement('option');
//             option.value = subject;
//             option.textContent = subject;
//             mamSubjectSelect.appendChild(option);
//           });
//         })
//         .catch(error => {
//           console.error('Error fetching subjects: ', error);
//           alert('Error fetching subjects. Please try again.');
//         });
//     }
//   }

//   // Rest of your code remains unchanged

//   window.populateMamChapters = () => {
//     const mamSubjectSelect = document.getElementById('mamSubjectSelect');
//     const mamChapterSelect = document.getElementById('mamChapterSelect');
//     const selectedSubject = mamSubjectSelect.value;

//     // Clear existing options
//     mamChapterSelect.innerHTML = '<option value="" disabled selected>Select a Chapter</option>';

//     // Fetch chapters for the selected subject from the server
//     if (selectedSubject) {
//       fetch(`/chapters/${selectedSubject}`)
//         .then(response => response.json())
//         .then(chapters => {
//           chapters.forEach(chapter => {
//             const option = document.createElement('option');
//             option.value = chapter;
//             option.textContent = chapter;
//             mamChapterSelect.appendChild(option);
//           });
//         });
//     }
//   };

//   window.uploadNotesData = () => {
//     const mamSubjectSelect = document.getElementById('mamSubjectSelect');
//     const mamChapterSelect = document.getElementById('mamChapterSelect');
//     const descriptionInput = document.getElementById('descriptionInput');
//     const pdfInput = document.getElementById('pdfInput');
//     const classSelect = document.getElementById('classSelect');
//     const divisionSelect = document.getElementById('divisionSelect');
   
//     const selectedSubject = mamSubjectSelect.value;
//     const selectedChapter = mamChapterSelect.value;
//     const description = descriptionInput.value;
//     const pdfFile = pdfInput.files[0];
//     const selectedClass = classSelect.value;
//     const selectedDivision = divisionSelect.value;

//     // Check if all required fields are filled
//     if (selectedSubject && selectedChapter && description && pdfFile) {
//       const formData = new FormData();
//       formData.append('class', selectedClass);
//       formData.append('division', selectedDivision);
//       formData.append('subject', selectedSubject);
//       formData.append('chapter', selectedChapter);
//       formData.append('description', description);
//       formData.append('pdfFile', pdfFile);

//       // Perform a fetch to submit data to the server
//       fetch('/submitNotesData', {
//         method: 'POST',
//         body: formData,
//       })
//         .then(response => response.json())
//         .then(data => {
//           // Optionally, you can handle the response from the server
//           console.log('Data submitted successfully:', data);
//           alert('Submitted successfully');
//           location.reload();
//         })
//         .catch(error => {
//           console.error('Error submitting notes data: ', error);
//           alert('Error submitting notes data. Please try again.');
//         });
//     } else {
//       alert('Please fill in all required fields.');
//     }
//   };
// });



// document.addEventListener('DOMContentLoaded', () => {
   
//     // Rest of your code remains unchanged
  
//     window.populateMamChapters = () => {
//       const mamSubjectSelect = document.getElementById('mamSubjectSelect');
//       const mamChapterSelect = document.getElementById('mamChapterSelect');
//       const selectedSubject = mamSubjectSelect.value;
  
//       // Clear existing options
//       mamChapterSelect.innerHTML = '<option value="" disabled selected>Select a Chapter</option>';
  
//       // Fetch chapters for the selected subject from the server
//       if (selectedSubject) {
//         fetch(`/chapters/${selectedSubject}`)
//           .then(response => response.json())
//           .then(chapters => {
//             chapters.forEach(chapter => {
//               const option = document.createElement('option');
//               option.value = chapter;
//               option.textContent = chapter;
//               mamChapterSelect.appendChild(option);
//             });
//           });
//       }
//     };
  
//     window.uploadNotesData = () => {
//       const mamSubjectSelect = document.getElementById('mamSubjectSelect');
//       const mamChapterSelect = document.getElementById('mamChapterSelect');
//       const descriptionInput = document.getElementById('descriptionInput');
//       const pdfInput = document.getElementById('pdfInput');
//       const classSelect = document.getElementById('classSelect');
//       const divisionSelect = document.getElementById('divisionSelect');
     
//       const selectedSubject = mamSubjectSelect.value;
//       const selectedChapter = mamChapterSelect.value;
//       const description = descriptionInput.value;
//       const pdfFile = pdfInput.files[0];
//       const selectedClass = classSelect.value;
//       const selectedDivision = divisionSelect.value;
  
//       // Check if all required fields are filled
//       if (selectedSubject && selectedChapter && description && pdfFile) {
//         const formData = new FormData();
//         formData.append('class', selectedClass);
//         formData.append('division', selectedDivision);
//         formData.append('subject', selectedSubject);
//         formData.append('chapter', selectedChapter);
//         formData.append('description', description);
//         formData.append('pdfFile', pdfFile);
  
//         // Perform a fetch to submit data to the server
//         fetch('/submitNotesData', {
//           method: 'POST',
//           body: formData,
//         })
//           .then(response => response.json())
//           .then(data => {
//             // Optionally, you can handle the response from the server
//             console.log('Data submitted successfully:', data);
//             alert('Submitted successfully');
//             location.reload();
//           })
//           .catch(error => {
//             console.error('Error submitting notes data: ', error);
//             alert('Error submitting notes data. Please try again.');
//           });
//       } else {
//         alert('Please fill in all required fields.');
//       }
//     };
//   });
  

//   document.addEventListener('DOMContentLoaded', () => {
//   const classSelect = document.getElementById('classSelect');
//   const mamSubjectSelect = document.getElementById('mamSubjectSelect');
//   const mamChapterSelect = document.getElementById('mamChapterSelect');
//   const descriptionInput = document.getElementById('descriptionInput');
//   const pdfInput = document.getElementById('pdfInput');

//   // Event listener for class and subject change
//   classSelect.addEventListener('change', updateSubjectsDropdown);
//   mamSubjectSelect.addEventListener('change', updateChaptersDropdown);

//   // Fetch subjects for the selected class
//   function updateSubjectsDropdown() {
//     const selectedClass = classSelect.value;

//     if (selectedClass) {
//       fetch(`/subjects/${selectedClass}`)
//         .then(response => response.json())
//         .then(subjects => {
//           mamSubjectSelect.innerHTML = '<option value="" disabled selected>Select a Subject</option>';
//           subjects.forEach(subject => {
//             const option = document.createElement('option');
//             option.value = subject;
//             option.textContent = subject;
//             mamSubjectSelect.appendChild(option);

//             // Reset chapters dropdown when subjects change
//             mamChapterSelect.innerHTML = '<option value="" disabled selected>Select a Chapter</option>';
//           });
//         })
//         .catch(error => {
//           console.error('Error fetching subjects: ', error);
//           alert('Error fetching subjects. Please try again.');
//         });
//     }
//   }

//   // Fetch chapters for the selected subject
//   function updateChaptersDropdown() {
//     const selectedClass = classSelect.value;
//     const selectedSubject = mamSubjectSelect.value;

//     if (selectedClass && selectedSubject) {
//       fetch(`/chapters/${selectedClass}/${selectedSubject}`)
//         .then(response => response.json())
//         .then(chapters => {
//           console.log('Fetched chapters:', chapters); // Add this line for debugging
//           mamChapterSelect.innerHTML = '<option value="" disabled selected>Select a Chapter</option>';
//           chapters.forEach(chapter => {
//             const option = document.createElement('option');
//             option.value = chapter;
//             option.textContent = chapter;
//             mamChapterSelect.appendChild(option);
//           });
//         })
//         .catch(error => {
//           console.error('Error fetching chapters: ', error);
//           alert('Error fetching chapters. Please try again.');
//         });
//     }
//   }

//   // Function to handle the PDF upload and data submission
//   window.uploadNotesData = () => {
//     const selectedSubject = mamSubjectSelect.value;
//     const selectedChapter = mamChapterSelect.value;
//     const description = descriptionInput.value;
//     const pdfFile = pdfInput.files[0];
//     const selectedClass = classSelect.value;

//     // Check if all required fields are filled
//     if (selectedSubject && selectedChapter && description && pdfFile) {
//       const formData = new FormData();
//       formData.append('class', selectedClass);
//       formData.append('subject', selectedSubject);
//       formData.append('chapter', selectedChapter);
//       formData.append('description', description);
//       formData.append('pdfFile', pdfFile);

//       // Perform a fetch to submit data to the server
//       fetch('/submitNotesData', {
//         method: 'POST',
//         body: formData,
//       })
//         .then(response => response.json())
//         .then(data => {
//           // Optionally, you can handle the response from the server
//           console.log('Data submitted successfully:', data);
//           alert('Submitted successfully');
//           location.reload();
//         })
//         .catch(error => {
//           console.error('Error submitting notes data: ', error);
//           alert('Error submitting notes data. Please try again.');
//         });
//     } else {
//       alert('Please fill in all required fields.');
//     }
//   };
// });
// document.addEventListener('DOMContentLoaded', () => {
//     const classSelect = document.getElementById('classSelect');
//     const divisionSelect = document.getElementById('divisionSelect');
//     const mamSubjectSelect = document.getElementById('mamSubjectSelect');
//     const mamChapterSelect = document.getElementById('mamChapterSelect');
//     const descriptionInput = document.getElementById('descriptionInput');
//     const pdfInput = document.getElementById('pdfInput');
  
//     classSelect.addEventListener('change', updateSubjectsDropdown);
//     mamSubjectSelect.addEventListener('change', updateChaptersDropdown);
  
//     function updateSubjectsDropdown() {
//       const selectedClass = classSelect.value;
  
//       if (selectedClass) {
//         fetch(`/subjects/${selectedClass}`)
//           .then(response => response.json())
//           .then(subjects => {
//             mamSubjectSelect.innerHTML = '<option value="" disabled selected>Select a Subject</option>';
//             subjects.forEach(subject => {
//               const option = document.createElement('option');
//               option.value = subject;
//               option.textContent = subject;
//               mamSubjectSelect.appendChild(option);
//               mamChapterSelect.innerHTML = '<option value="" disabled selected>Select a Chapter</option>';
//             });
//           })
//           .catch(error => {
//             console.error('Error fetching subjects: ', error);
//             alert('Error fetching subjects. Please try again.');
//           });
//       }
//     }
  
//     function updateChaptersDropdown() {
//       const selectedClass = classSelect.value;
//       const selectedSubject = mamSubjectSelect.value;
  
//       if (selectedClass && selectedSubject) {
//         fetch(`/chapters/${selectedClass}/${selectedSubject}`)
//           .then(response => response.json())
//           .then(chapters => {
//             mamChapterSelect.innerHTML = '<option value="" disabled selected>Select a Chapter</option>';
//             chapters.forEach(chapter => {
//               const option = document.createElement('option');
//               option.value = chapter;
//               option.textContent = chapter;
//               mamChapterSelect.appendChild(option);
//             });
//           })
//           .catch(error => {
//             console.error('Error fetching chapters: ', error);
//             alert('Error fetching chapters. Please try again.');
//           });
//       }
//     }
  
//     window.uploadNotesData = () => {
//       const selectedClass = classSelect.value;
//       const selectedDivision = divisionSelect.value; 
//       const selectedSubject = mamSubjectSelect.value;
//       const selectedChapter = mamChapterSelect.value;
//       const description = descriptionInput.value;
//       const pdfFile = pdfInput.files[0];
  
//       if (selectedClass && selectedSubject && selectedChapter && description && pdfFile) {
//         const formData = new FormData();
//         formData.append('class', selectedClass);
//         formData.append('division', selectedDivision);
//         formData.append('subject', selectedSubject);
//         formData.append('chapter', selectedChapter);
//         formData.append('description', description);
//         formData.append('pdfFile', pdfFile);
  
//         fetch('/submitNotesData', {
//           method: 'POST',
//           body: formData,
//         })
//           .then(response => response.json())
//           .then(data => {
//             console.log('Data submitted successfully:', data);
//             alert('Submitted successfully');
//             location.reload();
//           })
//           .catch(error => {
//             console.error('Error submitting notes data: ', error);
//             alert('Error submitting notes data. Please try again.');
//           });
//       } else {
//         alert('Please fill in all required fields.');
//       }
//     };
//   });
  


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
  


  // function populateSubjects() {
  //   const subjectSelect = document.getElementById('subjectSelect');

  //   // Make an asynchronous request to the userSubjects endpoint
  //   fetch('/userSubjects')
  //     .then(response => {
  //       if (!response.ok) {
  //         throw new Error('Network response was not ok');
  //       }
  //       return response.json();
  //     })
  //     .then(data => {
  //       // Enable the subject dropdown
  //       subjectSelect.disabled = false;

  //       // Clear existing options
  //       subjectSelect.innerHTML = '<option value="" disabled selected>Select a Subject</option>';

  //       // Populate options based on the data received
  //       data.forEach(subject => {
  //         const option = document.createElement('option');
  //         option.value = subject;
  //         option.text = subject;
  //         subjectSelect.appendChild(option);
  //       });
  //     })
  //     .catch(error => {
  //       console.error('Error fetching userSubjects:', error);
  //     });
  // }

  // function populateChapters() {
  //   const subjectSelect = document.getElementById('subjectSelect');
  //   const chapterSelect = document.getElementById('chapterSelect');

  //   // Disable the chapters dropdown
  //   chapterSelect.disabled = true;

  //   // Clear existing options
  //   chapterSelect.innerHTML = '<option value="" disabled selected>Select a Chapter</option>';

  //   // Get the selected subject
  //   const selectedSubject = subjectSelect.value;

  //   // Make an asynchronous request to get chapters for the selected subject
  //   fetch(`/chapters/${selectedSubject}`)
  //     .then(response => {
  //       if (!response.ok) {
  //         throw new Error('Network response was not ok');
  //       }
  //       return response.json();
  //     })
  //     .then(data => {
  //       // Enable the chapters dropdown
  //       chapterSelect.disabled = false;

  //       // Populate options based on the data received
  //       data.forEach(chapter => {
  //         const option = document.createElement('option');
  //         option.value = chapter;
  //         option.text = chapter;
  //         chapterSelect.appendChild(option);
  //       });
  //     })
  //     .catch(error => {
  //       console.error(`Error fetching chapters for ${selectedSubject}:`, error);
  //     });
  // }

  // window.onload = populateSubjects;


// public/scripts.js

document.addEventListener('DOMContentLoaded', () => {
  // Fetch subjects from the server and populate the dropdown
  fetch('/subjects')
    .then(response => response.json())
    .then(subjects => {
      const subjectSelect = document.getElementById('subjectSelect');
      subjects.forEach(subject => {
        const option = document.createElement('option');
        option.value = subject;
        option.textContent = subject;
        subjectSelect.appendChild(option);
      });
    });

  // Function to populate chapters based on the selected subject
  window.populateChapters = () => {
    const subjectSelect = document.getElementById('subjectSelect');
    const chapterSelect = document.getElementById('chapterSelect');
    const selectedSubject = subjectSelect.value;

    // Clear existing options
    chapterSelect.innerHTML = '<option value="" disabled selected>Select a Chapter</option>';

    // Fetch chapters for the selected subject from the server
    if (selectedSubject) {
      fetch(`/chapters/${selectedSubject}`)
        .then(response => response.json())
        .then(chapters => {
          chapters.forEach(chapter => {
            const option = document.createElement('option');
            option.value = chapter;
            option.textContent = chapter;
            chapterSelect.appendChild(option);
          });
        });
    }
  };

  // Function to handle chapter selection
  window.checkNotesData = () => {
    const subjectSelect = document.getElementById('subjectSelect');
    const chapterSelect = document.getElementById('chapterSelect');
    const selectedSubject = subjectSelect.value;
    const selectedChapter = chapterSelect.value;

    // Check if both subject and chapter are selected
    if (selectedSubject && selectedChapter) {
      // Perform a fetch to get the specific PDF file based on the subject and chapter
      fetch(`/getNotesData`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subject: selectedSubject, chapter: selectedChapter }),
      })
        .then(response => response.json())
        .then(data => {
          const resultDiv = document.getElementById('resultDiv');//<th>Sr.No</th><td>${item.id}</td>
          resultDiv.innerHTML = `<table border="1">
                                    <tr>
                                    
                                      <th>Subject</th>
                                      <th>Chapter</th>
                                      <th>Description</th>
                                      <th>File Data</th>
                                      <th>Download</th>
                                    </tr>
                                    ${data.map(item => `<tr>
                                                       
                                                        <td>${item.subject}</td>
                                                        <td>${item.chapter}</td>
                                                        <td>${item.description}</td>
                                                        <td><a href="#" onclick="openPdfInNewTab(${item.id})">Open PDF</a></td>
                                                        <td><a href="#" onclick="downloadPdf(${item.id})">Download PDF</a></td>
                                                      </tr>`).join('')}
                                </table>
                                <div id="pdfIframeContainer"></div>`;
        })
        .catch(error => {
          console.error('Error fetching notes data: ', error);
          alert('Error fetching notes data. Please try again.');
        });
    } else {
      alert('Please select both subject and chapter.');
    }
  };

  // Function to open the PDF file in an iframe
  window.openPdfInNewTab = (id) => {
      // Perform a fetch to get the specific PDF file based on the ID
      fetch(`/getFile/${id}`)
        .then(response => response.blob())
        .then(blobData => {
          // Create a Blob URL
          const blobUrl = URL.createObjectURL(blobData);
    
          // Open a new tab with the Blob URL
          window.open(blobUrl, '_blank');
        })
        .catch(error => {
          console.error('Error opening PDF file: ', error);
          alert('Error opening PDF file. Please try again.');
        });
    };

    window.downloadPdf = (id) => {
      // Perform a fetch to get the specific PDF file based on the ID
      fetch(`/getFile/${id}`)
        .then(response => response.blob())
        .then(blobData => {
          // Create a Blob URL
          const blobUrl = URL.createObjectURL(blobData);
    
          // Create a download link
          const downloadLink = document.createElement('a');
          downloadLink.href = blobUrl;
          downloadLink.download = `file_${id}.pdf`; // You can customize the filename
          downloadLink.style.display = 'none';
          document.body.appendChild(downloadLink);
    
          // Trigger the download
          downloadLink.click();
    
          // Remove the download link from the DOM
          document.body.removeChild(downloadLink);
        })
        .catch(error => {
          console.error('Error downloading PDF file: ', error);
          alert('Error downloading PDF file. Please try again.');
        });
    };
    
    
});
