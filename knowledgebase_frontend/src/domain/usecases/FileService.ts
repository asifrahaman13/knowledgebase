import PdfInterface from "../interfaces/PdfInterface";

class FileService {
  private pdfRepository: PdfInterface;

  constructor(pdfRepository: PdfInterface) {
    this.pdfRepository = pdfRepository;
  }

  async fetchAllPdfs(access_token: string) {
    return this.pdfRepository.fetchAllPdfs(access_token);
  }
}

export default FileService;
