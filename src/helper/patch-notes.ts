import { PatchNotes } from "../backend/about";
import DOMPurify from "dompurify";
import { marked } from "marked";

export const patchNotesToHTML = (patchNotes: PatchNotes): { __html: string } => {
    return {
        __html: DOMPurify.sanitize(
            marked(
                patchNotes.join("\n\n"),
                {
                    headerIds: false
                }
            )
        )
    }
}
