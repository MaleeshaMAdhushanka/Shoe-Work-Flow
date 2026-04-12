export type Customer = {
  id: string;
  name: string;
  email: string;
  mobile: string;
  address: string;
};

export type User = {
  id: string;
  email: string;
  password: string;
  role: string;
};

export type UserState = {
  errors?: {
    email?: string[];
    password?: string[];
    role?: string[];
  };
  message?: string | null;
};

export type CustomerFormData = Omit<Customer, "id">;

export type Item = {
  id: string;
  name: string;
  image: string;
  price: number;
  size: string;
  qty: number;
  status: string;
};

export type ItemFormData = Omit<Item, "id">;

export type CustomerState = {
  errors?: {
    name?: string[];
    email?: string[];
    mobile?: string[];
    address?: string[];
  };
  message?: string | null;
};

export type ItemState = {
  errors?: {
    name?: string[];
    price?: string[];
    size?: string[];
    qty?: string[];
    status?: string[];
  };
  message?: string | null;
};

export type OrderItem = {
  item: Item;
  quantity: number;
};

export type OrderState = {
  errors?: {
    customerId?: string[];
    orderItems?: string[];
  };
  message?: string | null;
};

export type Transaction = {
  order_id: string;
  customer_name: string;
  total_amount: string;
  order_date: string;
  item_name: string;
  quantity: string;
  price: string;
  total_price: string;
};

export type FilterdTransaction = {
  order_id: string;
  customer_name: string;
  total_amount: string;
  order_date: string;
  items: {
    item_name: string;
    quantity: string;
    price: string;
    total_price: string;
  }[];
};

export type FilterdTransactionItem = {
  item_name: string;
  quantity: string;
  price: string;
  total_price: string;
};

export type CreateUserState = {
  errors?: {
    email?: string[];
    password?: string[];
    confirmPassword?: string[];
  };
  message?: string | null;
};

export type DeleteUserState = {
  errors?: {
    password?: string[];
    email?: string[];  
  };
  message?: string | null;
};
declare module "next-auth" {
  interface User {
    role: string;
  }

  interface Session {
    user: {
      role: string ;
      email: string;
      name: string ;
    };
  }
}
