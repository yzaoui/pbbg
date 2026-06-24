import DOMPurify from "dompurify";
import { marked } from "marked";

import { PatchNotes } from "../backend/about";

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
