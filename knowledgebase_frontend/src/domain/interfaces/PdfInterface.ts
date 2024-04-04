import { SuccessEntity } from "../entities/Success";

interface PdfInterface {
  fetchAllPdfs(access_token: string): Promise<SuccessEntity | null>;
}
export default PdfInterface;
