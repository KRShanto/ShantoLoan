import { UserType } from "./user";
export interface LoanType {
  _id: string;
  why: string;
  amount: number;
  date: Date;
  returnDate?: Date;
  user: UserType;
}
