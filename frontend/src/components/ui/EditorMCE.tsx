/* eslint-disable @typescript-eslint/no-explicit-any */
import { Editor } from "@tinymce/tinymce-react";
export const EditorMCE = (props: { editorRef: any; value: string; id: string }) => {
  const { editorRef, value, id = "" } = props;

  return (
    <>
      <Editor
        apiKey={process.env.NEXT_PUBLIC_TINYMCE}
        onInit={(_evt, editor) => (editorRef.current = editor)}
        initialValue={value}
        init={{
          height: 500,
          plugins: ["anchor", "link", "charmap", "image", "lists", "media"],
          toolbar: `undo redo | styles | bold italic | alignleft aligncenter alignright alignjustify | outdent indent | link anchor charmap image numlist bullist media`,
          images_upload_url: `${process.env.NEXT_PUBLIC_API_URL}/uploads`,
        }}
        id={id}
      />
    </>
  );
};
