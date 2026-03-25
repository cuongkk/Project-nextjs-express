import { Request } from "express";
import CV from "./cv.model";
import { AccountRequest } from "../../interfaces/request.interface";
import { PAGINATION } from "../../configs/variable.config";

// User: list own CVs
export const listForUser = async (req: AccountRequest) => {
  const userEmail = req.account.email;

  const find = {
    email: userEmail,
  };

  const limitItems = PAGINATION.USER_CV_PAGE_SIZE;
  let page = 1;
  if (req.query.page) {
    page = parseInt(`${req.query.page}`);
  }

  const totalRecord = await CV.countDocuments(find);
  const totalPage = Math.ceil(totalRecord / limitItems) || 1;
  const skip = (page - 1) * limitItems;

  const listCV = await CV.find(find)
    .sort({
      createdAt: "desc",
    })
    .limit(limitItems)
    .skip(skip);

  return {
    code: "success",
    message: "Lấy danh sách CV thành công!",
    listCV,
    totalPage,
  };
};

// User: view single CV
export const detailForUser = async (req: AccountRequest) => {
  const userEmail = req.account.email;
  const id = req.params.id;

  const cv = await CV.findOne({ _id: id, email: userEmail });
  if (!cv) {
    return { code: "error", message: "Không tìm thấy CV!" };
  }

  return {
    code: "success",
    message: "Thành công!",
    cv,
  };
};

// User: create a CV
export const create = async (req: Request & { file?: any }) => {
  const filePath = req.file ? req.file.path : (req.body as any).fileCV || "";

  const cv = await CV.create({
    email: (req as any).account?.email ?? req.body.email,
    userName: (req.body as any).userName,
    phone: (req.body as any).phone,
    fileCV: filePath,
  });

  return {
    code: "success",
    message: "Tạo CV thành công!",
    cv,
  };
};

// User: update a CV
export const update = async (req: Request & { file?: any }) => {
  const userEmail = (req as any).account?.email;
  const id = req.params.id;

  const cv = await CV.findOne({ _id: id, email: userEmail });
  if (!cv) {
    return { code: "error", message: "Không tìm thấy CV!" };
  }

  const filePath = req.file ? req.file.path : (req.body as any).fileCV || cv.fileCV;

  cv.userName = (req.body as any).userName ?? cv.userName;
  cv.phone = (req.body as any).phone ?? cv.phone;
  cv.fileCV = filePath;

  await cv.save();

  return {
    code: "success",
    message: "Cập nhật CV thành công!",
    cv,
  };
};

// User: delete a CV
export const remove = async (req: AccountRequest) => {
  const userEmail = req.account.email;
  const id = req.params.id;

  const cv = await CV.findOne({ _id: id, email: userEmail });
  if (!cv) {
    return { code: "error", message: "Không tìm thấy CV!" };
  }

  await CV.deleteOne({ _id: id, email: userEmail });

  return {
    code: "success",
    message: "Đã xóa CV!",
  };
};
