// draggerProps.js
import { message } from "antd";

const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (e) => reject(e);
  });

export const useDraggerProps = (fileList, setFileList, setBase64) => {
  return {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    listType: "picture-circle",
    showUploadList: false,
    beforeUpload: async (file) => {
      const fileExtension = file.name.split(".").pop();
      if (
        fileExtension === "png" ||
        fileExtension === "PNG" ||
        fileExtension === "jpeg" ||
        fileExtension === "JPEG" ||
        fileExtension === "jpg" ||
        fileExtension === "JPG"
      ) {
        // setFileList([file]);
        const base = await fileToBase64(file);
        setFileList([base]);
        setBase64(base);

        return false;
      }
      message.error("Not a PNG or JPG file.");
      return true;
    },
    fileList,
  };
};
