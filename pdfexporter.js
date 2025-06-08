export async function exportTextPDF() {
    const { jsPDF } = window.jspdf;
    const element = document.getElementById("outputArea");
    
    if (!element) {
        console.error("Element with ID 'outputArea' not found");
        return;
    }
    
    if (!element.innerHTML.trim()) {
        console.error("Element is empty");
        return;
    }

    try {
        // Import html2canvas dynamically
        const html2canvas = window.html2canvas;
        
        if (!html2canvas) {
            console.error("html2canvas library not found. Please include it in your HTML.");
            return;
        }

        // Create a clone of the element for styling
        const clonedElement = element.cloneNode(true);
        
        // Apply styles to the cloned element
        clonedElement.style.position = 'absolute';
        clonedElement.style.left = '-9999px';
        clonedElement.style.top = '0';
        clonedElement.style.width = '800px';
        clonedElement.style.padding = '20px';
        clonedElement.style.backgroundColor = '#ffffff';
        clonedElement.style.fontFamily = 'Arial, sans-serif';
        
        // Style all child elements
        const allElements = clonedElement.querySelectorAll('*');
        allElements.forEach(el => {
            // Force black text and standard document fonts
            el.style.color = '#000000';
            
            // Set font sizes
            if (el.tagName === 'H1') {
                el.style.fontSize = '14px';
                el.style.marginBottom = '10px';
                el.style.marginTop = '10px';
                el.style.fontWeight = 'bold';
            } else if (el.tagName === 'H2') {
                el.style.fontSize = '12px';
                el.style.marginBottom = '8px';
                el.style.marginTop = '8px';
                el.style.fontWeight = 'bold';
            } else if (el.tagName === 'H3') {
                el.style.fontSize = '11px';
                el.style.marginBottom = '7px';
                el.style.marginTop = '7px';
                el.style.fontWeight = 'bold';
            } else {
                el.style.fontSize = '10px';
            }
            
            // Set line spacing (7px between lines)
            el.style.lineHeight = '17px'; // 10px font + 7px spacing
            el.style.marginBottom = '7px';
            
            // Handle text overflow
            el.style.wordWrap = 'break-word';
            el.style.wordBreak = 'break-word';
            el.style.overflowWrap = 'break-word';
            el.style.whiteSpace = 'normal';
            el.style.maxWidth = '100%';
            
            // Remove problematic styles
            el.style.textShadow = 'none';
            el.style.webkitTextStroke = 'none';
            el.style.boxShadow = 'none';
            
            // Hide images to avoid encoding issues
            if (el.tagName === 'IMG') {
                el.style.display = 'none';
            }
        });
        
        // Add to document temporarily
        document.body.appendChild(clonedElement);
        
        // Convert to canvas
        const canvas = await html2canvas(clonedElement, {
            scale: 2, // Higher resolution
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            width: 800,
            height: clonedElement.scrollHeight + 40, // Add padding
            scrollX: 0,
            scrollY: 0,
            logging: false
        });
        
        // Remove cloned element
        document.body.removeChild(clonedElement);
        
        // Create PDF
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgData = canvas.toDataURL('image/png');
        
        // Calculate dimensions
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        
        // Calculate scaling to fit page width with margins
        const margin = 10;
        const availableWidth = pdfWidth - (2 * margin);
        const scale = availableWidth / (imgWidth / 2); // Divide by 2 due to scale: 2
        const scaledHeight = (imgHeight / 2) * scale;
        
        // Add image to PDF, splitting across pages if necessary
        let yPosition = margin;
        let remainingHeight = scaledHeight;
        let sourceY = 0;
        
        while (remainingHeight > 0) {
            const availableHeight = pdfHeight - yPosition - margin;
            const heightToAdd = Math.min(remainingHeight, availableHeight);
            
            // Create a temporary canvas for this page section
            const pageCanvas = document.createElement('canvas');
            const pageCtx = pageCanvas.getContext('2d');
            
            pageCanvas.width = canvas.width;
            pageCanvas.height = (heightToAdd / scale) * 2; // Account for scale
            
            // Draw the portion of the image for this page
            pageCtx.drawImage(
                canvas,
                0, sourceY * 2, // Source coordinates (account for scale)
                canvas.width, pageCanvas.height,
                0, 0, // Destination coordinates
                pageCanvas.width, pageCanvas.height
            );
            
            const pageImgData = pageCanvas.toDataURL('image/png');
            pdf.addImage(pageImgData, 'PNG', margin, yPosition, availableWidth, heightToAdd);
            
            remainingHeight -= heightToAdd;
            sourceY += heightToAdd / scale;
            
            if (remainingHeight > 0) {
                pdf.addPage();
                yPosition = margin;
            }
        }
        
        // Save the PDF
        pdf.save("notes.pdf");
        console.log("PDF exported successfully using image approach");
        
    } catch (error) {
        console.error("Error exporting PDF:", error);
        alert("Error exporting PDF. Please try again.");
    }
}