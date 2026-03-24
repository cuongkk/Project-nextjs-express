import City from "./city.model";

export const list = async () => {
  const cityList = await City.find({});

  return {
    code: "success",
    message: "Thành công!",
    cityList,
  };
};
