import { UserType } from "./user";

export interface LoanType {
  _id: string;
  why: string;
  amount: number;
  date: Date;
  // returnDate?: Date;
  // returns: { amount: number; date: Date }[];
  returns: LoanReturnType[];
  user: UserType;
}

export interface LoanReturnType {
  amount: number;
  date: Date;
}
