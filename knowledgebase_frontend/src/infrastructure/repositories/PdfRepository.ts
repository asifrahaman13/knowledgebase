import PdfInterface from "@/domain/interfaces/PdfInterface";
import axios from "axios";
import { SuccessEntity } from "@/domain/entities/Success";

class PdfRepository implements PdfInterface {
  // Logic to fetch pdf from database or API
  async fetchAllPdfs(access_token: string) {
    const backend_url = process.env.NEXT_PUBLIC_BACKEND_PORT;
    console.log(`${backend_url}/aws/get_all_pdfs`)
    try {
      const response = await axios.get(`${backend_url}/aws/get_all_pdfs`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      if (response.status === 200) {
        return new SuccessEntity(200, response.data.pdfs);
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }

  // Logic to fetch pdf from database or API
  async fetchPdfPresignedUrl(access_token: string, pdfId: string) {
    const backend_url = process.env.NEXT_PUBLIC_BACKEND_PORT;
    console.log(`${backend_url}/aws/get_presigned_url`)
    try {
      const response = await axios.get(`${backend_url}/aws/get_pdf_url?file_name=${pdfId}`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      if (response.status === 200) {
        return new SuccessEntity(200, response.data);
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }
}

export default PdfRepository;
