"use client"
//npm install @pdf-lib/core
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { useState } from 'react';

export default function Home() {
    // ค่าที่รับ file
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    // รูปที่ file uploadเข้ามา แล้วเก็บค่า state
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    // เอาค่า state ไปใช้เมือกดsubmit แปลงเป็น pdf
    const handleSubmit = async () => {
        if (selectedFile) {
            const reader = new FileReader();
            reader.readAsArrayBuffer(selectedFile);
            reader.onload = async () => {
                const pdfDoc = await PDFDocument.create();
                const image = await pdfDoc.embedPng(reader.result as ArrayBuffer);
                const page = pdfDoc.addPage();
                page.drawImage(image, {
                    x: 50,
                    y: 500,
                    width: 400,
                    height: 400,
                });
                const pdfBytes = await pdfDoc.save();

                const blob = new Blob([pdfBytes], { type: 'application/pdf' });
                const fileURL = URL.createObjectURL(blob);

                const downloadLink = document.createElement('a');
                downloadLink.href = fileURL;
                downloadLink.download = selectedFile.name.replace(/\.[^/.]+$/, '') + '.pdf';
                downloadLink.click();

                URL.revokeObjectURL(fileURL);

                console.log('File converted to PDF:', selectedFile);
            };
        } else {
            console.log('Please select a file.');
        }
    };

    return (
        <div>
            <h1>Upload File</h1>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleSubmit}>Submit</button>
        </div>
    );
}
