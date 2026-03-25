import AccountUser from "./user.model";
import { AccountRequest } from "../../interfaces/request.interface";

export const profilePatch = async (req: AccountRequest) => {
  if (req.file) {
    (req.body as any).avatar = req.file.path;
  } else {
    delete (req.body as any).avatar;
  }

  await AccountUser.updateOne(
    {
      _id: req.account.id,
    },
    req.body,
  );

  return {
    code: "success",
    message: "Cập nhật thành công!",
  };
};
