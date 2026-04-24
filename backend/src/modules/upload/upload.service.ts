export const uploadImage = async (filePath?: string | null) => {
  return {
    code: "success",
    url: filePath || null,
  };
};
