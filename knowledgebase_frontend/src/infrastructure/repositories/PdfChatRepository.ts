import { SuccessEntity } from "@/domain/entities/Success";
import {PdfChatInterface} from "@/domain/interfaces/PdfChatInterface";
import axios from "axios";

class PdfChatRepository implements PdfChatInterface {
  // Logic to get chat response from the chatbot
  async getChatResponse(access_token: string, filename: string, question: string) {
    const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;
    console.log(`${backend_url}/chatbot/get_response`);
    try {
      const response = await axios.post(
        `${backend_url}/pdf/ask_question`,
        {
            filename: filename,
          question: question,
        },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
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

export default PdfChatRepository;
