type SizeType = {
  quantity: number;
  price: number;
};

export type ProductType = {
  name: string;
  code: string;
  M?: SizeType;
  S?: SizeType;
  L?: SizeType;
};

export type SuccessType = {
  status: true;
  data: any;
};

export type ErrorType = {
  status: false;
  message: string;
};
