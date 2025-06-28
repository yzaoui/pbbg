/**
 * Returns a copy of an array with one element moved to a new index and all elements in-between shifted by 1 to make room for it.
 */
export const arrayReorder: <T>(array: T[], sourceIndex: number, targetIndex: number) => T[] = (array, sourceIndex, targetIndex) => {
    const copy = [...array];

    if (sourceIndex === targetIndex) return copy;

    if (sourceIndex < targetIndex) {
        for (let i = sourceIndex; i < targetIndex; i++) {
            copy[i] = copy[i+1];
        }
    } else {
        for (let i = sourceIndex; i > targetIndex; i--) {
            copy[i] = copy[i-1];
        }
    }
    copy[targetIndex] = array[sourceIndex];

    return copy;
};
