export default class DocumentTextExtractor {
    constructor() {
      this.supportedTypes = ['pdf', 'doc', 'docx'];
    }
  
    /**
     * Extract text from uploaded file
     * @param {File} file - The uploaded file
     * @returns {Promise<string>} - Extracted text content
     */
    async extractText(file) {
      if (!file) {
        throw new Error('No file provided');
      }
  
      const fileExtension = this.getFileExtension(file.name);
      
      if (!this.isSupported(file)) {

        throw new Error(`Unsupported file type: ${fileExtension}. Supported types: ${this.supportedTypes.join(', ')}`);
      }
  
      try {
        switch (fileExtension) {
          case '.pdf':
            return await this.extractFromPDF(file);
          case '.doc':
          case '.docx':
            return await this.extractFromDOC(file);
          default:
            throw new Error(`Handler not implemented for ${fileExtension}`);
        }
      } catch (error) {
        throw new Error(`Failed to extract text from ${fileExtension}: ${error.message}`);
      }
    }
  
    /**
     * Extract text from PDF file
     * @param {File} file - PDF file
     * @returns {Promise<string>} - Extracted text
     */
    async extractFromPDF(file) {
      try {
        // Load PDF-lib for client-side PDF processing
        const { getDocument, GlobalWorkerOptions } = pdfjsLib;
        
        // Set worker source
        GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await getDocument({ data: arrayBuffer }).promise;
        
        let fullText = '';
        
        // Extract text from each page
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          const textContent = await page.getTextContent();
          
          // Combine text items from the page
          const pageText = textContent.items
            .map(item => item.str)
            .join(' ')
            .trim();
            
          if (pageText) {
            fullText += pageText + '\n\n';
          }
        }
        
        return fullText.trim();
      } catch (error) {
        throw new Error(`PDF processing failed: ${error.message}`);
      }
    }
  
    /**
     * Extract text from DOC/DOCX file
     * @param {File} file - DOC/DOCX file
     * @returns {Promise<string>} - Extracted text
     */
    async extractFromDOC(file) {
      try {
        const arrayBuffer = await file.arrayBuffer();
        
        // Use mammoth to extract text from .docx files
        const result = await mammoth.extractRawText({ arrayBuffer });
        
        if (result.messages && result.messages.length > 0) {
          console.warn('Mammoth processing warnings:', result.messages);
        }
        
        return result.value || '';
      } catch (error) {
        throw new Error(`DOC processing failed: ${error.message}`);
      }
    }
  
    /**
     * Get file extension from filename
     * @param {string} filename - Name of the file
     * @returns {string} - File extension in lowercase
     */
    getFileExtension(filename) {
      return filename.toLowerCase().substring(filename.lastIndexOf('.'));
    }
  
    /**
     * Check if file type is supported
     * @param {string} extension - File extension
     * @returns {boolean} - Whether the file type is supported
     */
    isSupported(file ) {
       const  fileExtension= file.name.split('.').length==2 ? file.name.split('.')[1].trim().toLowerCase() : "notsupported";
        // console.log("extention found : ",fileExtension);
      return this.supportedTypes.includes(fileExtension.toLowerCase());
    }
  
    /**
     * Get list of supported file types
     * @returns {Array<string>} - Array of supported extensions
     */
    getSupportedTypes() {
      return [...this.supportedTypes];
    }
  
    /**
     * Clean extracted text (remove extra whitespace, normalize line breaks)
     * @param {string} text - Raw extracted text
     * @returns {string} - Cleaned text
     */
    cleanText(text) {
      return text
        .replace(/\s+/g, ' ') // Replace multiple spaces with single space
        .replace(/\n\s*\n/g, '\n\n') // Normalize paragraph breaks
        .trim();
    }
  
    /**
     * Extract text and return cleaned version
     * @param {File} file - The uploaded file
     * @returns {Promise<string>} - Cleaned extracted text
     */
    async extractAndCleanText(file) {
      const rawText = await this.extractText(file);
      return this.cleanText(rawText);
    }
  }
  
