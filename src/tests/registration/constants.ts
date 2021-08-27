import QuestionType from "constants/QuestionType";
import StudentRole from "constants/StudentRole";

export enum TestValue {
  Address = "42 Wallaby Way",
  CellNumber = "123",
  ChildDob = "01012018",
  ChildFavouriteColour = "blue",
  ChildFirstName = "Nemo",
  Email = "marlin@test.com",
  GuestDob = "01011987",
  GuestFavouriteColour = "periwinkle",
  GuestFirstName = "Dory",
  HomeNumber = "456",
  LastName = "Fish",
  Notes = "Just keep swimming",
  ParentFavouriteColour = "red",
  ParentFirstName = "Marlin",
  ParentDob = "01011990",
  TimeInCanada = "1 year",
  WorkNumber = "789",
}

export const TEST_DYNAMIC_FIELD = {
  is_default: false,
  name: "Favourite colour",
  question_type: QuestionType.TEXT,
  options: [],
};

export const TEST_PARENT_DYNAMIC_FIELD = {
  id: 1,
  role: StudentRole.PARENT,
  ...TEST_DYNAMIC_FIELD,
};

export const TEST_CHILD_DYNAMIC_FIELD = {
  id: 2,
  role: StudentRole.CHILD,
  ...TEST_DYNAMIC_FIELD,
};

export const TEST_GUEST_DYNAMIC_FIELD = {
  id: 3,
  role: StudentRole.GUEST,
  ...TEST_DYNAMIC_FIELD,
};

export const TEST_SESSION_DYNAMIC_FIELD = {
  id: 4,
  role: StudentRole.SESSION,
  is_default: false,
  name: "Time in Canada",
  question_type: QuestionType.TEXT,
  options: [],
};
