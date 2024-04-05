import PdfInterface from "@/domain/interfaces/PdfInterface";
import axios from "axios";
import { SuccessEntity } from "@/domain/entities/Success";

class PdfRepository implements PdfInterface {
  // This is the repository to deal with the pdf data.
  // The repository is responsible for fetching, uploading and deleting pdfs from the database or API etc.

  // Logic to upload pdf to database or API
  async uploadPdf(access_token: string, file: File, description: string, tag: string) {
    const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;
    console.log(`${backend_url}/aws/upload_pdf`);
    try {
      const formData = new FormData();

      // Append the file to the form data
      formData.append("file", file);
      formData.append("description", description);
      formData.append("tag", tag);

      // Make a POST request to the backend
      const response = await axios.post(`${backend_url}/aws/upload_pdf`, formData, {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "multipart/form-data",
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

  // Logic to fetch pdf from database or API
  async fetchAllPdfs(access_token: string) {
    const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;
    console.log(`${backend_url}/aws/get_all_pdfs`);
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
    const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;
   
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

  // Logic to delete pdf from database or API
  async deletePdf(access_token: string, pdfId: string) {
    const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;
    try {
      const response = await axios.delete(`${backend_url}/aws/delete_pdf?file_name=${pdfId}`, {
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
