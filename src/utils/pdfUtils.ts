import * as pdfjsLib from 'pdfjs-dist';
import { ExtractedMetadata, PDFPermissions } from '../types';
import { getBaseMetadata } from './fileUtils';

// Set up PDF.js worker (using CDN for compatibility)
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

// Extract PDF metadata
export const extractPDFMetadata = async (file: File): Promise<ExtractedMetadata> => {
  const base = getBaseMetadata(file);
  const metadata: ExtractedMetadata = { ...base };

  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({
      data: arrayBuffer,
      verbosity: pdfjsLib.VerbosityLevel.ERRORS,
    }).promise;

    const info = await pdf.getMetadata();

    // Basic info
    metadata.pageCount = pdf.numPages;
    metadata.pdfVersion = info.contentDispositionFilename || undefined;
    metadata.title = info.metadata?.get('dc:title') || undefined;
    metadata.author = info.metadata?.get('dc:creator') || undefined;
    metadata.subject = info.metadata?.get('dc:description') || info.contentDispositionFilename || undefined;
    metadata.keywords = info.metadata?.get('pdf:keywords') as string | undefined;
    metadata.creator = info.metadata?.get('xmp:creatortool') as string | undefined;
    metadata.producer = info.metadata?.get('pdf:producer') as string | undefined;
    metadata.creationDate = info.metadata?.get('xmp:createdate') as string | undefined;
    metadata.modificationDate = info.metadata?.get('xmp:modifydate') as string | undefined;

    // Extract from info object (alternative source for metadata)
    const pdfInfo = (pdf as unknown as { _pdfInfo?: Record<string, unknown> })._pdfInfo;
    if (pdfInfo) {
      if (!metadata.title) metadata.title = pdfInfo.Title as string | undefined;
      if (!metadata.author) metadata.author = pdfInfo.Author as string | undefined;
      if (!metadata.subject) metadata.subject = pdfInfo.Subject as string | undefined;
      if (!metadata.creator) metadata.creator = pdfInfo.Creator as string | undefined;
      if (!metadata.producer) metadata.producer = pdfInfo.Producer as string | undefined;
      if (!metadata.creationDate) metadata.creationDate = pdfInfo.CreationDate as string | undefined;
      if (!metadata.keywords) metadata.keywords = pdfInfo.Keywords as string | undefined;
    }

    // Permissions
    const permissions = checkPDFPermissions(pdf);
    metadata.encrypted = permissions.isEncrypted;
    metadata.permissions = {
      canPrint: permissions.canPrint,
      canCopy: permissions.canCopy,
      canModify: permissions.canModify,
      canAnnotate: permissions.canAnnotate,
      canFillForms: permissions.canFillForms,
      canExtract: permissions.canExtract,
      canAssemble: permissions.canAssemble,
      canPrintHighQuality: permissions.canPrintHighQuality,
    };

    // Raw metadata
    metadata.raw = {
      title: metadata.title,
      author: metadata.author,
      subject: metadata.subject,
      creator: metadata.creator,
      producer: metadata.producer,
      pageCount: metadata.pageCount,
      permissions: metadata.permissions,
    };

    metadata.allTags = Object.keys(metadata.raw);
  } catch (error) {
    console.error('PDF metadata extraction error:', error);
  }

  return metadata;
};

// Check PDF permissions
const checkPDFPermissions = (pdf: pdfjsLib.PDFDocumentProxy): {
  isEncrypted: boolean;
  canPrint: boolean;
  canCopy: boolean;
  canModify: boolean;
  canAnnotate: boolean;
  canFillForms: boolean;
  canExtract: boolean;
  canAssemble: boolean;
  canPrintHighQuality: boolean;
} => {
  try {
    const permissions = pdf.getPermissions() || [];
    const isEncrypted = permissions.length > 0;

    return {
      isEncrypted,
      canPrint: !permissions.includes('PRINT'),
      canCopy: !permissions.includes('COPY'),
      canModify: !permissions.includes('MODIFY_CONTENTS'),
      canAnnotate: !permissions.includes('MODIFY_ANNOTATIONS'),
      canFillForms: !permissions.includes('FILL_FORM'),
      canExtract: !permissions.includes('EXTRACT'),
      canAssemble: !permissions.includes('ASSEMBLE'),
      canPrintHighQuality: !permissions.includes('PRINT_HIGH_QUALITY'),
    };
  } catch {
    return {
      isEncrypted: false,
      canPrint: true,
      canCopy: true,
      canModify: true,
      canAnnotate: true,
      canFillForms: true,
      canExtract: true,
      canAssemble: true,
      canPrintHighQuality: true,
    };
  }
};

// Format date string
export const formatPDFDate = (dateStr: string): string => {
  if (!dateStr) return '';
  // PDF date format: D:YYYYMMDDHHmmSS or similar
  try {
    if (dateStr.startsWith('D:')) {
      const year = dateStr.substring(2, 6);
      const month = dateStr.substring(6, 8);
      const day = dateStr.substring(8, 10);
      const hour = dateStr.substring(10, 12) || '00';
      const min = dateStr.substring(12, 14) || '00';
      return `${year}-${month}-${day} ${hour}:${min}`;
    }
    return dateStr;
  } catch {
    return dateStr;
  }
};
