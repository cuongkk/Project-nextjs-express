export const uploadImage = async (filePath?: string | null) => {
  return {
    location: filePath || null,
  };
};
