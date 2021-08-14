import {
  EnrolmentFamilyRequest,
  FamilyBaseRequest,
  StudentRequest,
} from "api/types";
import { Interaction } from "types";

export type InteractionFormData = Interaction & {
  index: number;
  isEditing: boolean;
};

export type StudentFormData = StudentRequest & { index: number };

export type FamilyFormData = FamilyBaseRequest & {
  children: StudentFormData[];
  guests: StudentFormData[];
  parent: StudentRequest;
  interactions: InteractionFormData[];
};

export type EnrolmentFormData = Pick<
  EnrolmentFamilyRequest,
  "preferred_class" | "session" | "status"
> & {
  family: FamilyFormData;
};
