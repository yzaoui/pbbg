/**
 * /about/version
 */
export type BackendVersionResponse = string;

/**
 * /about/patch-notes
 */
export type PatchNotesResponse = PatchNotes;

type PatchNotes = string[];
